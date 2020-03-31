import _ from 'lodash';

module.exports = class BaseModel {
    constructor({ name, mappings, settings, client, registerConfiguration }) {

        this.name = name;
        this.index = _.toLower(name);
        this.mappings = mappings;
        this.settings = settings;
        this.client = client;
        this.registerConfiguration = registerConfiguration;
    }

    async count({ query = null } = {}) {
        var hrstart = process.hrtime()

        const { index } = this;
        const body = query ? { query } : undefined;
        const { count } = await this.client.count({
            index,
            body
        });

        var hrend = process.hrtime(hrstart)

        console.info('%f ES count execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
        return count;
    }

    async createInstance({ data, refresh = false }) {

        var hrstart = process.hrtime()

        const { index } = this;
        const { body } = await this.client.index({
            index,
            //type: index,
            body: data,
            refresh
        });

        var hrend = process.hrtime(hrstart)

        console.info('%f ES create instance execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)

        return body;
    }

    async updateInstance({ id, data, refresh = false }) {

        var hrstart = process.hrtime()

        const { index } = this;
        const { body } = await this.client.index({
            index,
            //type: index,
            id,
            body: data,
            refresh
        });

        var hrend = process.hrtime(hrstart)

        console.info('%f ES update instance execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)

        return body;
    }

    async removeInstance({ id, refresh = false }) {

        var hrstart = process.hrtime()

        const { index } = this;
        await this.client.delete({
            index,
            //type: index,
            id,
            refresh
        });

        var hrend = process.hrtime(hrstart)

        console.info('%f ES remove instance execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)
    }

    async findById({ id, refresh = false, source = true }) {

        var hrstart = process.hrtime()

        const { index } = this;
        const { body } = await this.client.get({
            index,
            //type: index,
            id,
            refresh,
            _source: source
        });

        var hrend = process.hrtime(hrstart)

        console.info('%f ES find by id execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)

        return body;
    }

    async search({ bodyParam, trackTotalHits = true }) {

        var hrstart = process.hrtime()

        const { index } = this;
        const { body } = await this.client.search({
            index,
            body: bodyParam,
            trackTotalHits
        });

        var hrend = process.hrtime(hrstart)

        console.info('%f ES search execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)

        return body;
    }

    async deleteByQuery({ bodyParam, refresh = false }) {

        var hrstart = process.hrtime()

        const { index } = this;
        const { body } = await this.client.deleteByQuery({
            index,
            bodyParam,
            refresh
        });

        var hrend = process.hrtime(hrstart)

        console.info('%f ES delete by query execution time (hr): %ds %dms', Date.now(), hrend[0], hrend[1] / 1000000)

        return body;

    }
};
