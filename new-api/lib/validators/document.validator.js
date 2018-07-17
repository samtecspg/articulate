import Joi from 'joi';
import { PARAM_DOCUMENT_ID } from '../../util/constants';

const Model = require('../models/document.model').schema;

class ContextValidate {
    constructor() {

        this.findById = {
            params: (() => {

                return {
                    [PARAM_DOCUMENT_ID]: Model.id.required()
                };
            })()
        };
        this.create = {
            payload: (() => {

                return {
                    document: Model.document.required(),
                    time_stamp: Model.time_stamp.required(),
                    maximum_saying_score: Model.maximum_saying_score.required(),
                    maximum_domain_score: Model.maximum_domain_score.required(),
                    total_elapsed_time_ms: Model.total_elapsed_time_ms.required(),
                    rasa_results: Model.rasa_results.required(),
                    session: Model.session.required(),
                    agent_id: Model.agent_id.required(),
                    agent_model: Model.agent_model.required()
                };
            })()
        };

        this.remove = {
            params: (() => {

                return {
                    [PARAM_DOCUMENT_ID]: Model.id.required()
                };
            })()
        };

        this.update = {
            params: (() => {

                return {
                    [PARAM_DOCUMENT_ID]: Model.id.required()
                };
            })(),
            payload: (() => {

                return {
                    document: Model.document.required(),
                    time_stamp: Model.time_stamp.required(),
                    maximum_saying_score: Model.maximum_saying_score.required(),
                    maximum_domain_score: Model.maximum_domain_score.required(),
                    total_elapsed_time_ms: Model.total_elapsed_time_ms.required(),
                    rasa_results: Model.rasa_results.required(),
                    creationDate: Model.creationDate,
                    modificationDate: Model.modificationDate
                };
            })()
        };

        this.search = {
            payload: (() => {

                return Joi.object();
            })()
        };
    }
}

module.exports = new ContextValidate();
