import Package from '../../package.json';
import * as Constants from './constants';

module.exports = ({ name }) => {

    const Debug = require('debug');
    const baseScope = `${Package.name}:${name}`;
    const scope = {
        info: `${baseScope}:${Constants.DEBUG_LEVEL_INFO}`,
        debug: `${baseScope}:${Constants.DEBUG_LEVEL_DEBUG}`,
        error: `${baseScope}:${Constants.DEBUG_LEVEL_ERROR}`
    };
    const info = Debug(scope.info);
    const debug = Debug(scope.debug);
    const error = Debug(scope.error);
    return { info, debug, error };
};
