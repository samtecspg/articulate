import Joi from 'joi';
import Channels from '../channels';
import _ from 'lodash';

class AgentModel {
    static get schema() {

        return {
            id: Joi.string(),
            channel: Joi.string().valid(_.keys(Channels)),
            enabled: Joi.boolean(),
            agent: Joi.number(),
            details: Joi.object(),
            creationDate: Joi.string(),
            modificationDate: Joi.string(),
            status: Joi.string().allow(''),
            payload:  Joi.object()
        };
    };
}

module.exports = AgentModel;
