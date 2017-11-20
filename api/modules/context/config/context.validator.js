'use strict';

const ContextSchema = require('../../../models/index').Context.schema;
const SlotSchema = require('../../../models/index').Slot.schema;
const Joi = require('joi');

class ContextValidate {
    constructor() {

        this.add = {
            payload: (() => {

                return {
                    name: ContextSchema.name.required(),
                    scenario: ContextSchema.scenario.required(),
                    slots: ContextSchema.slots.required()
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: ContextSchema.id.required().description('Id of the context')
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    id: ContextSchema.id.required().description('Id of the context')
                };
            })(),
            payload: (() => {

                return {
                    name: ContextSchema.name,
                    scenario: ContextSchema.scenario,
                    slots: ContextSchema.slots
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: ContextSchema.id.required().description('Id of the context')
                };
            })()
        };

    }
}

const contextValidate = new ContextValidate();
module.exports = contextValidate;
