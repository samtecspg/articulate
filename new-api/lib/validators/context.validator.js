import Joi from 'joi';
import {
    PARAM_LOAD_FRAMES,
    PARAM_SESSION
} from '../../util/constants';

const ContextModel = require('../models/context.model').schema;

class ContextValidate {
    constructor() {

        this.create = {
            payload: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.session.required()
                };
            })()
        };
        this.findBySession = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.session.required()
                };
            })(),
            query: (() => {

                return {
                    [PARAM_LOAD_FRAMES]: Joi.boolean().optional().default(false)
                };
            })()
        };

        this.removeBySession = {
            params: (() => {

                return {
                    [PARAM_SESSION]: ContextModel.session.required()
                };
            })()
        };
    }
}

const actionValidate = new ContextValidate();
module.exports = actionValidate;
