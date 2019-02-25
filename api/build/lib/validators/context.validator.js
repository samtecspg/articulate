"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _constants = require("../../util/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ContextModel = require('../models/context.model').schema;

class ContextValidate {
  constructor() {
    this.create = {
      payload: (() => {
        return {
          [_constants.PARAM_SESSION]: ContextModel.sessionId.required()
        };
      })()
    };
    this.createFrameBySession = {
      params: (() => {
        return {
          [_constants.PARAM_SESSION]: ContextModel.sessionId.required()
        };
      })(),
      payload: (() => {
        return {
          action: _joi.default.string().required(),
          slots: _joi.default.object().required()
        };
      })()
    };
    this.updateFrameBySessionAndFrame = {
      params: (() => {
        return {
          [_constants.PARAM_SESSION]: ContextModel.sessionId.required(),
          [_constants.PARAM_FRAME]: _joi.default.number().required() //Not certain why there is no frames model

        };
      })(),
      payload: (() => {
        return {
          action: _joi.default.string(),
          slots: _joi.default.object().required()
        };
      })()
    };
    this.update = {
      params: (() => {
        return {
          [_constants.PARAM_SESSION]: ContextModel.sessionId.required()
        };
      })(),
      payload: (() => {
        return {
          savedSlots: ContextModel.savedSlots,
          actionQueue: ContextModel.actionQueue,
          responseQueue: ContextModel.responseQueue,
          creationDate: ContextModel.creationDate,
          modificationDate: ContextModel.modificationDate
        };
      })()
    };
    this.findBySession = {
      params: (() => {
        return {
          [_constants.PARAM_SESSION]: ContextModel.sessionId.required()
        };
      })(),
      query: (() => {
        return {
          [_constants.PARAM_LOAD_FRAMES]: _joi.default.boolean().optional().default(false)
        };
      })()
    };
    this.findFramesBySession = {
      params: (() => {
        return {
          [_constants.PARAM_SESSION]: ContextModel.sessionId.required()
        };
      })(),
      query: (() => {
        return {
          [_constants.PARAM_SKIP]: _joi.default.number().integer().optional().description('Number of resources to skip. Default=0'),
          [_constants.PARAM_LIMIT]: _joi.default.number().integer().optional().description('Number of resources to return. Default=50'),
          [_constants.PARAM_DIRECTION]: _joi.default.string().optional().allow('ASC', 'DESC').description('Sort direction. Default= ASC'),
          [_constants.PARAM_FIELD]: _joi.default.string().optional().description('Field used to do the sorting')
        };
      })()
    };
    this.findFrameBySessionAndFrame = {
      params: (() => {
        return {
          [_constants.PARAM_SESSION]: ContextModel.sessionId.required(),
          [_constants.PARAM_FRAME]: _joi.default.number().required() //Not certain why there is no frames model

        };
      })()
    };
    this.removeBySession = {
      params: (() => {
        return {
          [_constants.PARAM_SESSION]: ContextModel.sessionId.required()
        };
      })()
    };
    this.removeBySessionAndFrame = {
      params: (() => {
        return {
          [_constants.PARAM_SESSION]: ContextModel.sessionId.required(),
          [_constants.PARAM_FRAME]: _joi.default.number().required() //Not certain why there is no frames model

        };
      })()
    };
  }

}

const actionValidate = new ContextValidate();
module.exports = actionValidate;
//# sourceMappingURL=context.validator.js.map