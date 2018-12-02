import _ from 'lodash';

module.exports = class BaseModel {
    constructor({ name, properties, client }) {

        this.name = name;
        this.index = _.snakeCase(name);
        this.properties = properties;
        this.client = client;
    }

    async count({ query = null }) {

        const { index } = this;
        const body = query ? { query } : undefined;
        const { count } = await this.client.count({
            index,
            body
        });
        return count;
    }

    async createInstance({ document, refresh = true, source = true }) {

        const { index } = this;
        return await this.client.create({
            index,
            type: index,
            body: document,
            refresh,
            _source: source
        });
    }

    async updateInstance({ id, document, refresh = true, source = true }) {

        const { index } = this;
        return await this.client.update({
            index,
            type: index,
            id,
            body: document,
            refresh,
            _source: source
        });
    }

    async removeInstance({ id, refresh = true }) {

        const { index } = this;
        await this.client.delete({
            index,
            type: index,
            id,
            refresh
        });
    }

    async findById({ id, refresh = true, source = true }) {

        const { index } = this;
        return await this.client.get({
            index,
            type: index,
            id,
            refresh,
            _source: source
        });
    }

    //MARK: findAll
    //MARK: search
    //MARK: count
};
