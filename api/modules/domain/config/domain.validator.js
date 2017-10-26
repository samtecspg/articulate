'use strict';
const DomainSchema = require('../../../models/index').Domain.schema;
const Joi = require('joi');

class DomainValidate {
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
                    agent: DomainSchema.agent.required(),
                    domainName: DomainSchema.domainName.required(),
                    enabled: DomainSchema.enabled.required(),
                    intentThreshold: DomainSchema.intentThreshold.required(),
                    lastTraining: DomainSchema.lastTraining
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: DomainSchema._id.required().description('Id of the domain')
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    id: DomainSchema._id.required().description('Id of the domain')
                };
            })(),
            payload: (() => {

                return {
                    agent: DomainSchema.agent.required(),
                    domainName: DomainSchema.domainName,
                    enabled: DomainSchema.enabled,
                    intentThreshold: DomainSchema.intentThreshold,
                    lastTraining: DomainSchema.lastTraining
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: DomainSchema._id.required().description('Id of the domain')
                };
            })()
        };

    }
}

const domainValidate = new DomainValidate();
module.exports = domainValidate;
