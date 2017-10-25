'use strict';

const IntentSchema = require('../../../models/index').Intent.schema;
const UserSayingModel = require('../../../models/index').UserSaying.schema;
const EntityUserSayingModel = require('../../../models/index').EntityUserSaying.schema;
const Joi = require('joi');

class IntentValidate {
    constructor() {

        this.findAll = {
            query: (() => {

                return {
                    size: Joi.number().description('Number of elements to return. Default 10')
                };
            })()
        };

        this.add = {
            payload: (() => {

                return {
                    agent: IntentSchema.agent.required(),
                    domain: IntentSchema.domain.required(),
                    intentName: IntentSchema.intentName.required(),
                    examples: Joi.array().items({
                        userSays: UserSayingModel.userSays.required(),
                        entities: Joi.array().items({
                            value: EntityUserSayingModel.value.required(),
                            entity: EntityUserSayingModel.entity.required(),
                            start: EntityUserSayingModel.start.required(),
                            end: EntityUserSayingModel.end.required()
                        })
                    }).required()
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: IntentSchema._id.required().description('Id of the intent')
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    id: IntentSchema._id.required().description('Id of the intent')
                };
            })(),
            payload: (() => {

                return {
                    agent: IntentSchema.agent.required(),
                    domain: IntentSchema.domain.required(),
                    intentName: IntentSchema.intentName,
                    examples: Joi.array().items({
                        userSays: UserSayingModel.userSays.required(),
                        entities: Joi.array().items({
                            value: EntityUserSayingModel.value.required(),
                            entity: EntityUserSayingModel.entity.required(),
                            start: EntityUserSayingModel.start.required(),
                            end: EntityUserSayingModel.end.required()
                        })
                    })
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: IntentSchema._id.required().description('Id of the intent')
                };
            })()
        };

    }
}

const intentValidate = new IntentValidate();
module.exports = intentValidate;
