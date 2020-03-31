import _ from 'lodash';
import Moment from 'moment';
import { NohmModel } from 'nohm';
import * as Constants from '../../../../util/constants';

//const logger = require('../../../../util/logger')({ name: `plugin:redis:base-model` });
const defaults = {
    SKIP: 0,
    LIMIT: 50,
    DIRECTION: Constants.SORT_ASC
};
const getLimit = ({ skip, limit, length = undefined }) => {

    let parsedLimit = null;
    if (!limit) {
        parsedLimit = null;
    }
    else if (skip === undefined) {
        parsedLimit = [limit, length];
    }
    else {
        parsedLimit = [skip, limit];
    }
    return parsedLimit;
};

const filterResults = ({ results, filter }) => {
    if (_.isEmpty(filter)) {
        return results;
    }
    const match = [];
    _.each(filter, (value, attributeName) => {

        _.each(results, (result) => {

            if (_.includes(match, result)) { //Already matched this value
                return;
            }
            const properties = result.allProperties();
            const property = properties[attributeName];
            if (property === null) { //valid attribute but with null value
                return;
            }
            if (property === undefined) { //invalid attribute
                return match.push(result);
            }
            if (_.isArray(property)) {
                const arrayValue = _.isArray(value) ? value : [value];
                const intersection = _.intersection(arrayValue, property);
                if (intersection.length > 0) {
                    return match.push(result);
                }
            }
            if (_.isString(property)) {
                if (property.toLowerCase().search(value.toLowerCase()) >= 0) {
                    return match.push(result);
                }
            }
            else if (property === value) {
                return match.push(result);
            }
        });
    });
    return match;
};

const manualPaging = ({ results, skip, limit, direction, field }) => {

    let sorted = _.sortBy(results, [(o) => {

        const value = field === 'id' ? _.toNumber(o.id) : _.toNumber(o.property(field));
        return isNaN(value) ? o.property(field) : value;
    }]);
    sorted = direction === Constants.SORT_ASC ? sorted : sorted.reverse();
    sorted = sorted.slice(skip, limit === -1 ? sorted.length : skip + limit);
    return sorted;
};

module.exports = class BaseModel extends NohmModel {

    constructor({ schema }) {

        super();
        this.schema = schema;
    }

    defaultSortField() {

        let field = null;
        _.each(this.schema, (current, key) => {

            field = current.defaultSort ? key : field;
        });
        return _.isNil(field) ? 'id' : field;
    };

    //using create() or update() conflicts with functions from NohmModel
    async createInstance({ data, parentModels, modified }) {
        var hrstart = process.hrtime()

        if (!modified) {
            data.creationDate = Moment().utc().format();
            data.modificationDate = Moment().utc().format();
        }
        await this.property(data);
        await this.save();
        await this.linkParents({ parentModels });
        const resp = this.allProperties();

        var hrend = process.hrtime(hrstart)

        console.info('%f Redis create instance execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
        return resp;
    }

    async updateInstance({ id = null, data, parentModels, removedParents }) {
        var hrstart = process.hrtime()

        if (id) {
            // loads the model, if there is no id assumes that was already loaded
            await this.findById({ id });
        }
        data.modificationDate = Moment().utc().format();
        await this.createInstance({ data, modified: true });
        await this.linkParents({ parentModels });
        await this.unlinkParents({ parentModels: removedParents });

        var hrend = process.hrtime(hrstart)

        console.info('%f Redis update instance execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
    }

    async saveInstance() {
        var hrstart = process.hrtime()
        
        this.property('modificationDate', Moment().utc().format());
        await this.save();

        var hrend = process.hrtime(hrstart)

        console.info('%f Redis save instance execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
    }

    async findById({ id }) {
        var hrstart = process.hrtime()

        const resp = await this.load(id);

        var hrend = process.hrtime(hrstart)

        console.info('%f Redis find by id execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)

        return resp;
    }

    async findAll({ skip = defaults.SKIP, limit = defaults.LIMIT, direction = defaults.DIRECTION, field, filter = null }) {
        var hrstart = process.hrtime()

        const ids = await this.find();
        field = field ? field : this.defaultSortField();
        if (filter) {
            const results = await this.loadAllByIds({ ids });
            const filteredResults = filterResults({ results, filter });
            return manualPaging({ results: filteredResults, skip, limit, direction, field });
        }
        const resp =  await this.findAllByIds({ ids, skip, limit, direction, field });

        var hrend = process.hrtime(hrstart)

        console.info('%f Redis find all execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)

        return resp;
    }

    async count() {
        var hrstart = process.hrtime()

        const ids = await this.find();

        var hrend = process.hrtime(hrstart)

        console.info('%f Redis count execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
        return ids.length;
    }

    async findAllByIds({ ids, skip = defaults.SKIP, limit = defaults.LIMIT, direction = defaults.DIRECTION, field, filter, include }) {
        var hrstart = process.hrtime()

        if (!_.isArray(ids) || ids.leading === 0) {
            return [];
        }
        field = field ? field : this.defaultSortField();

        if (include || filter) {
            const results = await this.loadAllByIds({ ids });
            /* if (include.length > 0) {
                 await this.include({ include, results });
             }*/
            const filteredResults = await filterResults({ results, filter });
            const resp =  await manualPaging({ results: filteredResults, skip, limit, direction, field });

            var hrend = process.hrtime(hrstart)

            console.info('%f Redis find all by ids execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
            return resp
        }

        if (field) {
            if (field === 'id') {
                if (direction === Constants.SORT_DESC) {
                    ids = ids.reverse();
                }
                if (limit === -1) {
                    ids = ids.slice(skip);
                }
                else {
                    ids = ids.slice(skip, skip + limit);
                }
            }
            else {
                limit = getLimit({ skip, limit, length: ids.length });
                ids = await this.sort({ field, direction, limit }, ids);
            }
        }
        else {
            if (limit === -1) {
                ids = ids.slice(skip, ids.length);
            }
            else {
                ids = ids.slice(skip, skip + limit);
            }
        }
        if (ids.length === 0) {

            var hrend = process.hrtime(hrstart)

            console.info('%f Redis find all by ids execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
            return [];
        }
        const resp =  await this.loadAllByIds({ ids });

        var hrend = process.hrtime(hrstart)

        console.info('%f Redis find all by ids execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)

        return resp;
    }

    async loadAllByIds({ ids }) {
        var hrstart = process.hrtime()

        if (!Array.isArray(ids) || ids.length === 0) {
            var hrend = process.hrtime(hrstart)

            console.info('%f Redis load all by ids execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
            return [];
        }
        const loadPromises = ids.map(async (id) => {

            try {
                return await this.nohmClass.factory(this.modelName, id);
            }
            catch (err) {
                if (!(err && err.message === 'not found')) {
                    throw err;
                }
            }
        });
        const loadedModels = await Promise.all(loadPromises);
        const resp =  loadedModels.filter((model) => typeof model !== 'undefined');

        var hrend = process.hrtime(hrstart)

        console.info('%f Redis load all by ids execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)

        return resp;
    }

    async removeInstance({ id = null, silent = false } = {}) {
        var hrstart = process.hrtime()

        if (id) {
            await this.findById({ id });
        }
        await this.remove(silent);

        var hrend = process.hrtime(hrstart)

        console.info('%f Redis remove instance execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
        return true;
    }

    async searchByField({ field, value }) {
        var hrstart = process.hrtime()

        const schemaField = this.schema[field];
        if (!schemaField) {
            throw Error(Constants.ERROR_FIELD_NOT_FOUND);
        }
        const ids = await this.find({
            [field]: value
        });

        if (ids.length > 0) {
            if (schemaField.unique) {
                const resp =  await this.findById({ id: ids[0] });

                var hrend = process.hrtime(hrstart)

                console.info('%f Redis search by field execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
                return resp;
            }
            const resp = await this.findAllByIds({ ids });

            var hrend = process.hrtime(hrstart)

            console.info('%f Redis search by field execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
            return resp
        }
        var hrend = process.hrtime(hrstart)

        console.info('%f Redis search by field execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
        return [];
    }

    async linkParents({ parentModels = [], linkName = null }) {
        var hrstart = process.hrtime()

        if (parentModels.length > 0) {
            const linkPromises = parentModels.map(async (parentModel) => {

                await parentModel.link(this, linkName || this.modelName);
                await parentModel.save();
            });
            await Promise.all(linkPromises);

            var hrend = process.hrtime(hrstart)

            console.info('%f Redis link parents execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
        }

    }

    async unlinkParents({ parentModels = [], linkName = null }) {
        var hrstart = process.hrtime()

        if (parentModels.length > 0) {
            const linkPromises = parentModels.map(async (parentModel) => {

                const belongs = await parentModel.belongsTo(this, linkName || this.modelName);
                if (!belongs) {
                    return;
                }
                await parentModel.unlink(this, linkName || this.modelName);
                await parentModel.save();
            });
            await Promise.all(linkPromises);

            var hrend = process.hrtime(hrstart)

            console.info('%f Redis unlink parents execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
        }
    }

    export() {

        const properties = this.allProperties();
        delete properties.id;
        return properties;
    }

    async include({ include, results }) {

        const resultPromises = results.map(async (result) => {

            const includePromises = await include.map(async (inc) => {

                const relatedModelsIds = await result.getAll(inc, inc);
                const relatedModel = await this.nohmClass.factory(inc);
                const relatedModels = await relatedModel.loadAllByIds({ ids: relatedModelsIds });
                //result.property(inc, relatedModels.map((rm) => rm.allProperties()));
            });
            return await Promise.all(includePromises);
        });
        return await Promise.all(resultPromises);
    }
};
