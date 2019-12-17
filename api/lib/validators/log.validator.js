import Joi from 'joi';
import _ from 'lodash';

import {
    PARAM_DIRECTION,
    PARAM_FIELD,
    PARAM_FILTER,
    PARAM_LIMIT,
    PARAM_SKIP,
    SORT_ASC,
    SORT_DESC
} from '../../util/constants';

const Model = require('../models/log.model').schema;

class LogValidate {
    constructor() {

        this.findAllLogs = {
            query: (() => {
                return {
                    [PARAM_SKIP]: Joi
                        .number()
                        .integer()
                        .optional()
                        .description('Number of resources to skip. Default=0'),
                    [PARAM_LIMIT]: Joi
                        .number()
                        .integer()
                        .optional()
                        .description('Number of resources to return. Default=50'),
                    [PARAM_DIRECTION]: Joi
                        .string()
                        .optional()
                        .allow(SORT_ASC, SORT_DESC)
                        .description('Sort direction. Default= ASC'),
                    [PARAM_FIELD]: Joi
                        .string()
                        .allow(_(Model).keys().sort().value())
                        .optional()
                        .description('Field to sort with. Default= "@timestamp"'),
                    [PARAM_FILTER]: Joi
                        .object()
                        .optional()
                        .description('Values to filter the the results (experimental)'),
                };
            })()
        };

        this.search = {
            payload: (() => {
                return Joi.object();
            })()
        };
    }
}

module.exports = new LogValidate();
