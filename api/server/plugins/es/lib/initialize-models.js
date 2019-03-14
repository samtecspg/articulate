import _ from 'lodash';

const logger = require('../../../../util/logger')({ name: `plugin:es:initialize-model` });

module.exports = async ({ client, path }) => {

    const Mods = require(path);
    const models = {};
    await _.each(Mods, async (model) => {

        console.log(`initialize-models::`); // TODO: REMOVE!!!!
        const instance = new model({ client });
        const { name, mappings, index } = instance;

        logger.debug(name);

        const exists = await client.indices.exists({ index });
        if (!exists) {
            await client.indices.create({ index });
        }
        const map = {
            index,
            type: index,
            body: { ...mappings }
        };
        console.log({ map }); // TODO: REMOVE!!!!

        const response = await client.indices.putMapping(map);
        console.log(response); // TODO: REMOVE!!!!

        models[name] = instance;
    });
    return models;

};
