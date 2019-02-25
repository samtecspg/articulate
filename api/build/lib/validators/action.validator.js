"use strict";

var _constants = require("../../util/constants");

const ActionSchema = require('../models/action.model').schema;

const PostFormatSchema = require('../models/postFormat.model').schema;

class ActionValidate {
  constructor() {
    this.removeById = {
      params: (() => {
        return {
          [_constants.PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
        };
      })()
    };
    this.addPostFormat = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: ActionSchema.id.required().description('Id of the action')
        };
      })(),
      payload: (() => {
        return {
          postFormatPayload: PostFormatSchema.postFormatPayload.required()
        };
      })()
    };
  }

}

const actionValidate = new ActionValidate();
module.exports = actionValidate;
//# sourceMappingURL=action.validator.js.map