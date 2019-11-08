import _ from 'lodash';

module.exports = class BaseModel {
    constructor({ name, mappings, settings, client }) {

        this.name = name;
        this.index = _.snakeCase(name);
        this.mappings = mappings;
        this.settings = settings;
        this.client = client;
    }

    async count({ query = null } = {}) {

        const { index } = this;
        const body = query ? { query } : undefined;
        const { count } = await this.client.count({
            index,
            body
        });
        return count;
    }

    async createInstance({ data, refresh = true }) {

        const { index } = this;
        return await this.client.index({
            index,
            //type: index,
            body: data,
            refresh
        });
    }

    async updateInstance({ id, data, refresh = true }) {

        const { index } = this;
        return await this.client.index({
            index,
            //type: index,
            id,
            body: data,
            refresh
        });
    }

    async removeInstance({ id, refresh = true }) {

        const { index } = this;
        await this.client.delete({
            index,
            //type: index,
            id,
            refresh
        });
    }

    async findById({ id, refresh = true, source = true }) {

        const { index } = this;
        return await this.client.get({
            index,
            //type: index,
            id,
            refresh,
            _source: source
        });
    }

    async search({ body, trackTotalHits = true }) {

        const { index } = this;
        return await this.client.search({
            index,
            body,
            trackTotalHits
        });
    }

    async deleteByQuery({ body, refresh = true }) {

        const { index } = this;
        return await this.client.deleteByQuery({
            index,
            body,
            refresh
        });
    }
};
