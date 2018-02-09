'use strict';

const EntitySchema = require('../../../models/index').Entity.schema;
const ExampleSchema = require('../../../models/index').Example.schema;
const Joi = require('joi');
class EntityValidate {
    constructor() {

        this.add = {
            payload: (() => {

                return {
                    entityName: EntitySchema.entityName.required(),
                    agent: EntitySchema.agent.required(),
                    uiColor: EntitySchema.uiColor,
                    examples: Joi.array().items({
                        value: ExampleSchema.value.required(),
                        synonyms: ExampleSchema.synonyms
                    }).required()
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: EntitySchema.id.required().description('Id of the entity')
                };
            })()
        };

        this.findIntentsByEntityId = {
            params: (() => {

                return {
                    id: EntitySchema.id.required().description('Id of the entity')
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    id: EntitySchema.id.required().description('Id of the entity')
                };
            })(),
            payload: (() => {

                return {
                    entityName: EntitySchema.entityName,
                    uiColor: EntitySchema.uiColor,
                    examples: Joi.array().items({
                        value: ExampleSchema.value.required(),
                        synonyms: ExampleSchema.synonyms
                    })
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: EntitySchema.id.required().description('Id of the entity')
                };
            })()
        };

    }
}

const entityValidate = new EntityValidate();
module.exports = entityValidate;
