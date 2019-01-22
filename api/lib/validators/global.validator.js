import Joi from 'joi';
import {
    PARAM_DIRECTION,
    PARAM_FIELD,
    PARAM_FILTER,
    PARAM_LIMIT,
    PARAM_SKIP,
    PARAM_VALUE
} from '../../util/constants';

class AgentValidate {
    constructor() {

        this.searchByfield = {
            params: (() => {

                return {
                    [PARAM_FIELD]: Joi.string().required().description('Field name. Must be indexed. If unique then a single value will be returned.'),
                    [PARAM_VALUE]: Joi.string().required().description('Value to search for')
                };
            })()
        };

        this.findAll = {
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
                        .allow('ASC', 'DESC')
                        .description('Sort direction. Default= ASC'),
                    [PARAM_FIELD]: Joi
                        .string()
                        .optional()
                        .description('Field used to do the sorting'),
                    [PARAM_FILTER]: Joi
                        .object()
                        .optional()
                        .description('Values to filter the the results (experimental). Arrays will be treated as OR values.')
                };
            })()
        };

    }
}

const agentValidate = new AgentValidate();
module.exports = agentValidate;
