import _ from 'lodash';

const logger = require('../../../../util/logger')({ name: `plugin:es:initialize-model` });

module.exports = async ({ client, path }) => {

    const Mods = require(path);
    const models = {};
    await _.each(Mods, async (model) => {

        const instance = new model({ client });
        const { name, mappings, settings, index, registerConfiguration, isMappingTemplate } = instance;

        logger.debug(name);

        if (registerConfiguration) {
            if (isMappingTemplate) {
                await client.indices.putTemplate(
                    {
                        name: index + '_template',
                        order: 1,
                        create: false,
                        body: {
                            index_patterns: [index + '*'],
                            settings,
                            mappings
                        }
                    }
                )
            }

            const exists = await client.indices.exists({ index });
            if (!exists.body) {
                await client.indices.create({ index });
            }

            if (!isMappingTemplate) {
                await client.indices.putMapping({
                    index,
                    body: { ...mappings }
                });
            }

            await client.indices.putSettings({
                index,
                body: { ...settings }
            });
        }

        models[name] = instance;
    });
    return models;

};
