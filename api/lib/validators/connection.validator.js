import { PARAM_CONNECTION_ID } from '../../util/constants';
const ConnectionSchema = require('../models/connection.model').schema;

class ConnetionValidate {
    constructor() {

        this.create = {
            payload: (() => {

                return {
                    channel: ConnectionSchema.channel.required(),
                    enabled: ConnectionSchema.enabled.required(),
                    agent: ConnectionSchema.agent.required(),
                    details: ConnectionSchema.details.required(),
                };
            })()
        };

        this.post = {
            params: (() => {

                return {
                    [PARAM_CONNECTION_ID]: ConnectionSchema.id.required()
                };
            })(),
            payload:  ConnectionSchema.payload.required()
        };

        this.get = {
            params: (() => {

                return {
                    [PARAM_CONNECTION_ID]: ConnectionSchema.id.required()
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    [PARAM_CONNECTION_ID]: ConnectionSchema.id.required()
                };
            })(),
            payload: (() => {

                return {
                    enabled: ConnectionSchema.enabled,
                    agent: ConnectionSchema.agent,
                    details: ConnectionSchema.details,
                    creationDate: ConnectionSchema.creationDate,
                    modificationDate: ConnectionSchema.modificationDate,
                    status: ConnectionSchema.status
                };
            })()
        };
    }
}

module.exports = new ConnetionValidate();
