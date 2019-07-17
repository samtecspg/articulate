import Joi from 'joi';
import {
    PARAM_SESSION,
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

        this.update = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required() };
            })(),
            payload: (() => {

                return {
                    savedSlots: ContextModel.savedSlots,
                    actionQueue: ContextModel.actionQueue,
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
            })()
        };

        this.findDocsBySession = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.sessionId.required()
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
    }
}

const contextValidate = new ContextValidate();
module.exports = contextValidate;
