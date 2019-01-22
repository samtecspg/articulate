import _ from 'lodash';

const logger = require('../../../../util/logger')({ name: `plugin:handlebars:initialize-helpers` });

module.exports = async ({ Handlebars, path }) => {

    const Models = require(path);
    const initializedModels = {};
    await _.each(Models, (model) => {

        model.default({ Handlebars });
        logger.debug(model.name);
    });
    return initializedModels;
};
