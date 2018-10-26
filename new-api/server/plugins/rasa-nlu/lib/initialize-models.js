import _ from 'lodash';

const logger = require('../../../../util/logger')({ name: `plugin:rasa-nlu:initialize-model` });

module.exports = async ({ http, path }) => {

    const Models = require(path);
    const initializedModels = {};
    await _.each(Models, (model, index) => {

        if (_.isNil(model.name) || _.isNil(model.path)) {
            throw new Error(`Model [${path}/${index}] should have a name and path properties.`);
        }
        const defaultFunction = model.default({ http });

        if (_.isNil(defaultFunction)) {
            throw new Error(`Model [${model.name}] should have a default export`);
        }
        logger.debug(model.name);
        initializedModels[model.name] = defaultFunction;
    });
    return initializedModels;
};
