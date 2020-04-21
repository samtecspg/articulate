import isString from 'lodash/isString';
import util from 'util';
import Package from '../package.json';
import * as Constants from './constants';

module.exports = ({ name }) => {

    const Debug = require('debug');
    const baseScope = `${Package.name}:${name}`;
    const scope = {
        info: `${baseScope}:${Constants.DEBUG_LEVEL_INFO}`,
        debug: `${baseScope}:${Constants.DEBUG_LEVEL_DEBUG}`,
        error: `${baseScope}:${Constants.DEBUG_LEVEL_ERROR}`,
        inspect: `${baseScope}:${Constants.DEBUG_LEVEL_INSPECT}`
    };
    const info = Debug(scope.info);
    const debug = Debug(scope.debug);
    const error = Debug(scope.error);
    const inspectDebug = Debug(scope.inspect);
    const inspect = (message, { showHidden = false, depth = 5, colors = true, header = true } = {}) => {
        if (isString(message)) {
            return inspectDebug(message);
        }
        if (header) {
            return inspectDebug(util.inspect(message, showHidden, depth, colors));
        }
        return console.log(util.inspect(message, showHidden, depth, colors));
    };
    return { info, debug, error, inspect };
};
