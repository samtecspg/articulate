import _ from 'lodash';
import Joi from 'joi';

import Channels from '../channels';
import { PARAM_CONNECTION_ID } from '../../util/constants';

class ConnetionValidate {
    constructor() {

        this.create = {
            payload: (() => {

                return {
                    channel: Joi.string().valid(_.keys(Channels)).required(),
                    enabled: Joi.boolean().required(),
                    agent: Joi.number().required(),
                    details: Joi.object().required()
                };
            })()
        };

        this.post = {
            params: (() => {

                return {
                    [PARAM_CONNECTION_ID]: Joi.string().required()
                };
            })(),
            payload:  Joi.object().required()
        };

        this.get = {
            params: (() => {

                return {
                    [PARAM_CONNECTION_ID]: Joi.string().required()
                };
            })()
        };

        // this.update = {
        //     params: (() => {

        //         return {
        //             [PARAM_DOCUMENT_ID]: Model.id.required()
        //         };
        //     })(),
        //     payload: (() => {

        //         return {
        //             document: Model.document,
        //             time_stamp: Model.time_stamp,
        //             maximum_saying_score: Model.maximum_saying_score,
        //             maximum_category_score: Model.maximum_category_score,
        //             total_elapsed_time_ms: Model.total_elapsed_time_ms,
        //             rasa_results: Model.rasa_results,
        //             creationDate: Model.creationDate,
        //             modificationDate: Model.modificationDate,
        //             webhookResponses: Model.webhookResponses
        //         };
        //     })()
        // };

        // this.search = {
        //     payload: (() => {

        //         return Joi.object();
        //     })()
        // };
    }
}

module.exports = new ConnetionValidate();
