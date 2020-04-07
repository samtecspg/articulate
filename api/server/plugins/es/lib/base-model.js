import _ from 'lodash';

module.exports = class BaseModel {
    constructor({ name, mappings, settings, client, registerConfiguration, isMappingTemplate, getNameForCreate, getNameForSearch }) {

        this.name = name;
        this.index = _.toLower(name);
        this.mappings = mappings;
        this.settings = settings;
        this.client = client;
        this.registerConfiguration = registerConfiguration;
        this.isMappingTemplate = isMappingTemplate;
        this.getNameForCreate = getNameForCreate;
        this.getNameForSearch = getNameForSearch;
    }

    async count({ query = null } = {}) {

        const { index, getNameForSearch } = this;
        const body = query ? { query } : undefined;
        const { count } = await this.client.count({
            index: getNameForSearch(index),
            analyze_wildcard: true,
            allow_no_indices: true,
            body
        });
        return count;
    }

    async createInstance({ data, refresh = false }) {

        const { index, getNameForCreate } = this;
        const { body } = await this.client.index({
            index: getNameForCreate(index),
            body: data,
            refresh
        });
        return body;
    }

    async updateInstance({ id, indexId, data, refresh = false }) {

        const { index } = this;
        const { body } = await this.client.index({
            index: indexId ? indexId : index,
            id,
            body: data,
            refresh
        });

        return body;
    }

    async removeInstance({ id, indexId, refresh = true }) {

        const { index } = this;
        await this.client.delete({
            index: indexId ? indexId : index,
            id,
            refresh
        });
    }

    async findById({ id, indexId, refresh = false, source = true }) {

        const { index } = this;
        try {
            const { body } = await this.client.get({
                index: indexId ? indexId : index,
                id,
                refresh,
                _source: source
            });
            return body;
        } catch (err) {
            return null
        }
    }

    async search({ bodyParam, trackTotalHits = true }) {

        const { index, getNameForSearch } = this;
        const { body } = await this.client.search({
            index: getNameForSearch(index),
            body: bodyParam,
            trackTotalHits
        });
        return body;
    }

    async deleteByQuery({ body, refresh = true }) {

        const { index, getNameForSearch } = this;
        return await this.client.deleteByQuery({
            index: getNameForSearch(index),
            body,
            refresh
        });
    }
};
