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
    sorted = sorted.slice(skip, skip + limit);
    return sorted;
};

module.exports = class BaseModel extends NohmModel {

    constructor({ schema }) {

        super();
        schema.creationDate = {
            type: 'timestamp'
        };

        schema.modificationDate = {
            type: 'timestamp'
        };

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

        if (!modified) {
            data.creationDate = Moment().utc().format();
            data.modificationDate = Moment().utc().format();
        }
        await this.property(data);
        await this.save();
        await this.linkParents({ parentModels });
        return this.allProperties();
    }

    async updateInstance({ id = null, data, parentModels, removedParents }) {

        if (id) {
            // loads the model, if there is no id assumes that was already loaded
            await this.findById({ id });
        }
        data.modificationDate = Moment().utc().format();
        await this.createInstance({ data, modified: true });
        await this.linkParents({ parentModels });
        await this.unlinkParents({ parentModels: removedParents });
    }

    async saveInstance() {

        this.property('modificationDate', Moment().utc().format());
        await this.save();
    }

    async findById({ id }) {

        return await this.load(id);
    }

    async findAll({ skip = defaults.SKIP, limit = defaults.LIMIT, direction = defaults.DIRECTION, field, filter = null }) {

        const ids = await this.find();
        field = field ? field : this.defaultSortField();
        if (filter) {
            const results = await this.loadAllByIds({ ids });
            const filteredResults = filterResults({ results, filter });
            return manualPaging({ results: filteredResults, skip, limit, direction, field });
        }
        return await this.findAllByIds({ ids, skip, limit, direction, field });
    }

    async count() {

        const ids = await this.find();
        return ids.length;
    }

    async findAllByIds({ ids, skip = defaults.SKIP, limit = defaults.LIMIT, direction = defaults.DIRECTION, field, filter, include }) {

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
            return await manualPaging({ results: filteredResults, skip, limit, direction, field });
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
            return [];
        }
        return await this.loadAllByIds({ ids });
    }

    async loadAllByIds({ ids }) {

        if (!Array.isArray(ids) || ids.length === 0) {
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
        return loadedModels.filter((model) => typeof model !== 'undefined');
    }

    async removeInstance({ id = null, silent = false } = {}) {

        if (id) {
            await this.findById({ id });
        }
        await this.remove(silent);
        return true;
    }

    async searchByField({ field, value }) {

        const schemaField = this.schema[field];
        if (!schemaField) {
            throw Error(Constants.ERROR_FIELD_NOT_FOUND);
        }
        const ids = await this.find({
            [field]: value
        });

        if (ids.length > 0) {
            if (schemaField.unique) {
                return await this.findById({ id: ids[0] });
            }
            return await this.findAllByIds({ ids });
        }
        return [];
    }

    async linkParents({ parentModels = [], linkName = null }) {

        if (parentModels.length > 0) {
            const linkPromises = parentModels.map(async (parentModel) => {

                await parentModel.link(this, linkName || this.modelName);
                await parentModel.save();
            });
            await Promise.all(linkPromises);
        }

    }

    async unlinkParents({ parentModels = [], linkName = null }) {

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
