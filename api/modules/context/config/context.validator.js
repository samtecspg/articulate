'use strict';

const ContextSchema = require('../../../models/index').Context.schema;
const Joi = require('joi');

class ContextValidate {
    constructor() {

        this.addById = {
            params: (() => {

                return {
                    sessionId: Joi.string().required().description('Id of the session')
                };
            })(),
            payload: (() => {

                return {
                    name: ContextSchema.name.required(),
                    scenario: ContextSchema.scenario.required(),
                    slots: ContextSchema.slots
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    sessionId: Joi.string().required().description('Id of the session')
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    sessionId: Joi.string().required().description('Id of the session'),
                    id: Joi.string().required().description('Id of the context element')
                };
            })(),
            payload: (() => {

                return {
                    slots: ContextSchema.slots
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    sessionId: Joi.string().required().description('Id of the session')
                };
            })()
        };
    }
}

const contextValidate = new ContextValidate();
module.exports = contextValidate;
