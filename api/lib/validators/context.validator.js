import Joi from 'joi';
import {
    PARAM_LOAD_FRAMES,
    PARAM_SESSION,
    PARAM_FRAME,
    PARAM_SKIP,
    PARAM_LIMIT,
    PARAM_DIRECTION,
    PARAM_FIELD
} from '../../util/constants';

const ContextModel = require('../models/context.model').schema;

class ContextValidate {
    constructor() {

        this.create = {
            payload: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required()
                };
            })()
        };

        this.createFrameBySession = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required()
                };
            })(),
            payload: (() => {

                return {
                    action: Joi.string().required(),
                    slots: Joi.object().required()
                };
            })()
        };

        this.updateFrameBySessionAndFrame = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required(),
                    [PARAM_FRAME]: Joi.number().required() //Not certain why there is no frames model
                };
            })(),
            payload: (() => {

                return {
                    action: Joi.string(),
                    slots: Joi.object().required()
                };
            })()
        };

        this.update = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required() };
            })(),
            payload: (() => {

                return {
                    savedSlots: ContextModel.savedSlots,
                    actionQueue: ContextModel.actionQueue,
                    responseQueue: ContextModel.responseQueue,
                    docIds: ContextModel.docIds,
                    creationDate: ContextModel.creationDate,
                    modificationDate: ContextModel.modificationDate
                };
            })()
        };

        this.findBySession = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required()
                };
            })(),
            query: (() => {

                return {
                    [PARAM_LOAD_FRAMES]: Joi.boolean().optional().default(false)
                };
            })()
        };

        this.findFramesBySession = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required()
                };
            })(),
            query: (() => {

                return {
                    [PARAM_SKIP]: Joi
                        .number()
                        .integer()
                        .optional()
                        .description('Number of resources to skip. Default=0'),
                    [PARAM_LIMIT]: Joi
                        .number()
                        .integer()
                        .optional()
                        .description('Number of resources to return. Default=50'),
                    [PARAM_DIRECTION]: Joi
                        .string()
                        .optional()
                        .allow('ASC', 'DESC')
                        .description('Sort direction. Default= ASC'),
                    [PARAM_FIELD]: Joi
                        .string()
                        .optional()
                        .description('Field used to do the sorting')
                };
            })()
        };

        this.findDocsBySession = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required()
                };
            })()
        };

        this.findFrameBySessionAndFrame = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required(),
                    [PARAM_FRAME]: Joi.number().required() //Not certain why there is no frames model
                };
            })()
        };

        this.removeBySession = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required()
                };
            })()
        };

        this.removeBySessionAndFrame = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required(),
                    [PARAM_FRAME]: Joi.number().required() //Not certain why there is no frames model
                };
            })()
        };
    }
}

const actionValidate = new ContextValidate();
module.exports = actionValidate;
