import Joi from 'joi';

class ServerModel {
    static get schema() {

        return {
            status: Joi.string()
        };
    };
}

module.exports = ServerModel;
