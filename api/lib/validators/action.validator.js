import {
    PARAM_ACTION_ID,
    PARAM_AGENT_ID
} from '../../util/constants';

const ActionSchema = require('../models/action.model').schema;
const PostFormatSchema = require('../models/postFormat.model').schema;

class ActionValidate {
    constructor() {

        this.removeById = {
            params: (() => {

                return {
                    [PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };

        this.addPostFormat = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: ActionSchema.id.required().description('Id of the action')
                };
            })(),
            payload: (() => {

                return {
                    postFormatPayload: PostFormatSchema.postFormatPayload.required(),
                    creationDate: PostFormatSchema.creationDate,
                    modificationDate: PostFormatSchema.modificationDate
                };
            })()
        };

    }
}

const actionValidate = new ActionValidate();
module.exports = actionValidate;
