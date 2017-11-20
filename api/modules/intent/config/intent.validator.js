'use strict';

const IntentSchema = require('../../../models/index').Intent.schema;
const Joi = require('joi');

class IntentValidate {
    constructor() {

        this.add = {
            payload: (() => {

                return {
                    agent: IntentSchema.agent.required(),
                    domain: IntentSchema.domain.required(),
                    intentName: IntentSchema.intentName.required(),
                    examples: IntentSchema.examples.required()
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })(),
            payload: (() => {

                return {
                    agent: IntentSchema.agent,
                    domain: IntentSchema.domain,
                    intentName: IntentSchema.intentName,
                    examples: IntentSchema.examples
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };

    }
}

const intentValidate = new IntentValidate();
module.exports = intentValidate;
