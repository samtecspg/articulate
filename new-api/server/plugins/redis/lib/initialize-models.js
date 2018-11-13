import _ from 'lodash';
import Nohm from 'nohm';

const logger = require('../../../../util/logger')({ name: `plugin:redis:initialize-model` });

module.exports = async ({ redis, path, prefix }) => {

    Nohm.setPrefix(prefix);
    Nohm.setClient(redis);
    const Mods = require(path);
    await _.each(Mods, (model) => {

        logger.debug(model.modelName);
        Nohm.register(model);
    });
    return Nohm;
};
