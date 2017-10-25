'use strict';

const Joi = require('joi');
const EntityUserSayingModel = require('./entity.userSaying.model');
class UserSayingModel {
    static get schema() {

        return {
            userSays: Joi.string(),
            entities: Joi.array().items(EntityUserSayingModel.schema)
        };
    };
}

module.exports = UserSayingModel;
