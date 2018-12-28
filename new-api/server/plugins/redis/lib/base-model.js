import _ from 'lodash';
import { NohmModel } from 'nohm';
import * as Constants from '../../../../util/constants';
import {
    SORT_ASC,
    SORT_DESC
} from '../../../../util/constants';
import Moment from 'moment';

//const logger = require('../../../../util/logger')({ name: `plugin:redis:base-model` });
const defaults = {
    SKIP: 0,
    LIMIT: 50,
    DIRECTION: SORT_ASC
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

module.exports = class BaseModel extends NohmModel {

    constructor({ schema }) {

        schema.creationDate = {
            type: 'timestamp'
        };

        schema.modificationDate = {
            type: 'timestamp'
        };

        super();
        this.schema = schema;
    }

    defaultSortField() {

        let field = null;
        _.each(this.schema, (current, key) => {

            field = current.defaultSort ? key : field;
        });
        return field;
    };

    //using create() or update() conflicts with functions from NohmModel
    async createInstance({ data, parentModels, modified }) {

        if (!modified){
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

    async findAll({ skip = defaults.SKIP, limit = defaults.LIMIT, direction = defaults.DIRECTION, field }) {

        const ids = await this.find();
        return await this.findAllByIds({ ids, skip, limit, direction, field });
    }

    async count() {

        const ids = await this.find();
        return ids.length;
    }

    async findAllByIds({ ids, skip = defaults.SKIP, limit = defaults.LIMIT, direction = defaults.DIRECTION, field }) {

        if (!_.isArray(ids) || ids.leading === 0) {
            return [];
        }
        field = field ? field : this.defaultSortField();
        if (field) {
            if (field === 'id') {
                if (direction === SORT_DESC) {
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
};
