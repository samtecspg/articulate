"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _perf_hooks = require("perf_hooks");

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.default-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = async function ({
  id,
  sessionId,
  text,
  timezone,
  debug = false,
  additionalKeys = null,
  requestId = null
}) {
  const _this$server$app = this.server.app,
        redis = _this$server$app.redis,
        handlebars = _this$server$app.handlebars;

  const _ref = await this.server.services(),
        agentService = _ref.agentService,
        contextService = _ref.contextService,
        globalService = _ref.globalService,
        documentService = _ref.documentService;

  const webhookResponses = []; //MARK: reduce the remaining life of the saved slots

  const updateLifespanOfSlots = _perf_hooks.performance.timerify(function updateLifespanOfSlots(conversationStateObject) {
    Object.keys(conversationStateObject.context.savedSlots).forEach(slot => {
      const savedSlot = conversationStateObject.context.savedSlots[slot];

      if (savedSlot.remainingLife > -1) {
        if (savedSlot.remainingLife > 0) {
          //1 is the shortest value of life, after that it is set to null as 0 is infinity
          if (savedSlot.remainingLife === 1) {
            savedSlot.remainingLife = null;
          } else {
            savedSlot.remainingLife--;
          }
        }
      }
    }); //Removes all the slots that doesn't have a remaining life

    Object.keys(conversationStateObject.context.savedSlots).forEach(slot => {
      if (!conversationStateObject.context.savedSlots[slot].remainingLife) {
        delete conversationStateObject.context.savedSlots[slot];
      }
    });
  }); //MARK: get all the keywords for all the categories


  const getKeywordsFromRasaResults = _perf_hooks.performance.timerify(function getKeywordsFromRasaResults({
    rasaResults
  }) {
    return _lodash.default.flatMap(rasaResults, category => {
      category.keywords = _lodash.default.map(category.keywords, keyword => {
        //MARK: assigns category name to keyword
        keyword.category = category.category;
        return keyword;
      });
      return category.keywords;
    });
  }); //MARK: returns the category recognizer, or the only category or just list of keywords


  const getBestRasaResult = _perf_hooks.performance.timerify(function getBestRasaResult({
    rasaResults,
    categoryClassifierThreshold,
    multiCategory
  }) {
    let rasaResult = {};
    const recognizedCategory = rasaResults[0];

    if (multiCategory) {
      //MARK: if there is more than one category and this exceeds the agent.categoryClassifierThreshold then return it
      if (rasaResults.length > 0 && recognizedCategory.categoryScore > categoryClassifierThreshold) {
        rasaResult = recognizedCategory;
      } else {
        //MARK: if there is only one then return it
        if (rasaResults.length === 1) {
          rasaResult = recognizedCategory;
        } //MARK: if there is more than one then collect all keywords
        //MARK: but this will have a different structure?
        else {
            rasaResult.keywords = getKeywordsFromRasaResults({
              rasaResults
            });
          }
      }
    } else {
      rasaResult = recognizedCategory;
    }

    return rasaResult;
  }); //MARK: if there is an action, look for it in the agent actions, return the first one


  const getActionData = _perf_hooks.performance.timerify(function getActionData({
    rasaResult,
    agentActions
  }) {
    //MARK: rasaResult comes from getBestRasaResult
    if (rasaResult.action) {
      return _lodash.default.filter(agentActions, agentAction => {
        return agentAction.actionName === rasaResult.action.name;
      })[0];
    }

    return null;
  }); //MARK: if there is a modifier, look for it in the agent keywords, return the first one


  const getModifierData = _perf_hooks.performance.timerify(function getModifierData({
    rasaResult,
    agentKeywords
  }) {
    //MARK: rasaResult comes from getBestRasaResult
    if (rasaResult.action) {
      const agentModifiers = _lodash.default.flatten(_lodash.default.map(agentKeywords, keyword => {
        return _lodash.default.map(keyword.modifiers, modifier => {
          modifier.keyword = keyword.keywordName;
          return modifier;
        });
      }));

      return _lodash.default.filter(agentModifiers, modifier => {
        return modifier.modifierName === rasaResult.action.name;
      })[0];
    }

    return null;
  }); //MARK: find and action from the agent object by name


  const getActionByName = _perf_hooks.performance.timerify(function getActionByName({
    actionName,
    agentActions
  }) {
    return _lodash.default.filter(agentActions, agentAction => {
      return agentAction.actionName === actionName;
    })[0];
  }); //MARK: find category from agent.categories by name


  const getCategoryByName = _perf_hooks.performance.timerify(function getCategoryByName({
    agentCategories,
    categoryName
  }) {
    return _lodash.default.filter(agentCategories, agentCategory => {
      return agentCategory.categoryName === categoryName;
    })[0];
  }); //MARK: look into all the context until you get one with slots


  const getLastContextWithValidSlots = _perf_hooks.performance.timerify(function getLastContextWithValidSlots({
    context,
    recognizedKeywords
  }) {
    const recognizedKeywordsNames = _lodash.default.map(recognizedKeywords, 'keyword');

    let keepGoing = true;
    let contextIndex = context.length - 1;
    let lastValidContext = null;

    while (keepGoing && contextIndex !== -1) {
      const contextSlots = context[contextIndex].slots ? Object.keys(context[contextIndex].slots) : [];

      const intersection = _lodash.default.intersection(recognizedKeywordsNames, contextSlots);

      if (intersection.length > 0) {
        keepGoing = false;
        lastValidContext = _lodash.default.cloneDeep(context[contextIndex]);
      }

      contextIndex--;
    }

    return lastValidContext;
  });

  const recognizedKeywordsArePartOfTheContext = _perf_hooks.performance.timerify(function recognizedKeywordsArePartOfTheContext({
    slots,
    recognizedKeywords
  }) {
    let results = _lodash.default.map(recognizedKeywords, recognizedKeyword => {
      return Object.keys(slots).indexOf(recognizedKeyword.keyword) > -1;
    });

    results = _lodash.default.compact(results);
    return results.length > 0;
  });

  const response = async ({
    conversationStateObject
  }) => {
    updateLifespanOfSlots(conversationStateObject); //MARK: CSO.parse ===true

    if (conversationStateObject.parse) {
      //MARK: if the model recognized an action
      if (conversationStateObject.action && !conversationStateObject.modifier) {
        //MARK: if there is an action but no responses call RespondFallback and persist context
        if (!conversationStateObject.action.responses || conversationStateObject.action.responses.length === 0) {
          await agentService.converseUpdateContextFrames({
            id: conversationStateObject.context.id,
            frames: conversationStateObject.context.frames
          });
          return agentService.converseGenerateResponseFallback({
            agent: conversationStateObject.agent
          });
        } //MARK: CSO.parse ===false
        //MARK: get category using rasaResult category name


        conversationStateObject.category = getCategoryByName({
          agentCategories: conversationStateObject.agent.categories,
          categoryName: conversationStateObject.rasaResult.category
        }); //MARK: if there is an action and a category, check if the action confidence ia bigger than the category threshold === true

        if (!conversationStateObject.agent.multiCategory && conversationStateObject.rasaResult.action.confidence > conversationStateObject.agent.categoryClassifierThreshold || conversationStateObject.agent.multiCategory && conversationStateObject.category && conversationStateObject.rasaResult.action.confidence > conversationStateObject.category.actionThreshold) {
          //MARK: if the current context is empty or the current OR if the action name is the same as the current context action add a new frame with empty slots
          if (!conversationStateObject.currentFrame || conversationStateObject.rasaResult.action.name !== conversationStateObject.currentFrame.action) {
            const frame = {
              action: conversationStateObject.rasaResult.action.name,
              slots: {}
            };
            conversationStateObject.context.frames.push(frame); //MARK: get the last context, but it is the same that was pushed above?

            conversationStateObject.currentFrame = frame;
          }

          const actionResponse = await agentService.converseGenerateResponse({
            conversationStateObject
          }); //TODO: agentService.converseGenerateResponse, this needs to be removed from there

          await agentService.converseUpdateContextFrames({
            id: conversationStateObject.context.id,
            frames: conversationStateObject.context.frames
          });
          return actionResponse;
        }
      } //MARK: if the model recognized a modifier


      if (conversationStateObject.modifier && conversationStateObject.action) {
        //MARK: get the slots of the current context action
        const currentFrameSlotsKeywords = _lodash.default.map(conversationStateObject.action.slots, 'keyword'); //MARK: if the modifier applies to the current context


        if (currentFrameSlotsKeywords.indexOf(conversationStateObject.modifier.keyword) !== -1) {
          //MARK: generate response using the modifier
          const actionResponse = await agentService.converseGenerateResponse({
            conversationStateObject
          }); //TODO: agentService.converseGenerateResponse, this needs to be removed from there

          await agentService.converseUpdateContextFrames({
            id: conversationStateObject.context.id,
            frames: conversationStateObject.context.frames
          });
          return actionResponse;
        }
      } //MARK: if there is NO action then use the rasaResult.keywords else get them from getKeywordsFromRasaResults
      //MARK: I think this line doesn't do much since we already called getKeywordsFromRasaResults before to get rasaResult, the only difference is that we are saving the entire rasaResult instead of just the keywords


      const recognizedKeywords = conversationStateObject.rasaResult.action ? getKeywordsFromRasaResults(conversationStateObject) : conversationStateObject.rasaResult.keywords; //MARK: conversationStateObject.currentFrame === true

      if (conversationStateObject.currentFrame) {
        //MARK: recognizedKeywords>0
        if (recognizedKeywords.length > 0) {
          //MARK: if there are slots and the recognizedKeywords are part of the context == true
          if (conversationStateObject.currentFrame.slots && Object.keys(conversationStateObject.currentFrame.slots).length > 0 && recognizedKeywordsArePartOfTheContext({
            slots: conversationStateObject.currentFrame.slots,
            recognizedKeywords
          })) {
            //MARK: update action object from the action of the context
            conversationStateObject.action = getActionByName({
              actionName: conversationStateObject.currentFrame.action,
              agentActions: conversationStateObject.agent.actions
            });
            const actionResponse = agentService.converseGenerateResponse({
              conversationStateObject
            }); //TODO: agentService.converseGenerateResponse, this needs to be removed from there

            await agentService.converseUpdateContextFrames({
              context: conversationStateObject.context
            });
            return actionResponse;
          } //MARK: recognizedKeywords <= 0
          //MARK: if there are no slots then we get the last one with valid slots, update teh context list and set the last context, then get the action used by that context


          const lastValidContext = getLastContextWithValidSlots({
            context: conversationStateObject.context,
            recognizedKeywords
          });

          if (lastValidContext) {
            conversationStateObject.context.push(lastValidContext);
            conversationStateObject.currentFrame = lastValidContext;
            conversationStateObject.action = getActionByName({
              actionName: conversationStateObject.currentFrame.name,
              agentActions: conversationStateObject.agent.actions
            });
            const actionResponse = agentService.converseGenerateResponse({
              conversationStateObject
            }); //TODO: agentService.converseGenerateResponse, this needs to be removed from there

            await agentService.converseUpdateContextFrames({
              context: conversationStateObject.context
            });
            return actionResponse;
          }
        }
      }

      return agentService.converseGenerateResponseFallback({
        agent: conversationStateObject.agent
      });
    }

    return Promise.reject((0, _global.default)({
      message: `Sorry, the engine wasn't able to parse your text`
    }));
  };

  const storeDataInQueue = ({
    conversationStateObject,
    action,
    response,
    indexOfActionInQueue
  }) => {
    if (indexOfActionInQueue === -1) {
      conversationStateObject.context.actionQueue.push({
        action,
        slots: conversationStateObject.currentFrame.slots
      });
      conversationStateObject.context.responseQueue.push(_objectSpread({}, response));
    } else {
      conversationStateObject.context.actionQueue[indexOfActionInQueue] = {
        action,
        slots: conversationStateObject.currentFrame.slots
      };
      conversationStateObject.context.responseQueue[indexOfActionInQueue] = _objectSpread({}, response);
    }
  };

  const saveContextQueues = async ({
    context
  }) => {
    await contextService.update({
      sessionId: context.sessionId,
      data: {
        actionQueue: context.actionQueue,
        responseQueue: context.responseQueue
      }
    });
  };

  const removeFromQueue = async ({
    conversationStateObject,
    action
  }) => {
    const index = indexOnQueue({
      actionQueue: conversationStateObject.context.actionQueue,
      action
    });
    conversationStateObject.context.actionQueue.splice(index, 1);
    conversationStateObject.context.responseQueue.splice(index, 1);
    await contextService.update({
      sessionId: conversationStateObject.context.sessionId,
      data: {
        actionQueue: conversationStateObject.context.actionQueue,
        responseQueue: conversationStateObject.context.responseQueue
      }
    });
  };

  const moveOnQueue = ({
    context,
    oldIndex,
    newIndex
  }) => {
    context.actionQueue.splice(newIndex, 0, context.actionQueue.splice(oldIndex, 1)[0]);
    context.responseQueue.splice(newIndex, 0, context.responseQueue.splice(oldIndex, 1)[0]);
  };

  const indexOnQueue = ({
    actionQueue,
    action,
    modifier,
    agentActions
  }) => {
    let actionIndex = -1;

    if (modifier) {
      actionQueue.some((tempAction, tempIndex) => {
        const tempActionData = getActionByName({
          actionName: tempAction.action,
          agentActions
        });
        tempActionData.slots.some(tempSlot => {
          if (tempSlot.keyword === modifier.keyword) {
            actionIndex = tempIndex;
          }

          return actionIndex !== -1;
        });
        return actionIndex !== -1;
      });
    } else {
      actionQueue.some((tempAction, tempIndex) => {
        if (tempAction.action === action) {
          actionIndex = tempIndex;
        }

        return actionIndex !== -1;
      });
    }

    return actionIndex;
  };

  const getResponsesFromQueue = ({
    context
  }) => {
    const responses = [];
    const actionsToRemove = [];
    context.responseQueue.every((response, index) => {
      if (response.actionWasFulfilled) {
        responses.push(context.responseQueue[index].textResponse);
        actionsToRemove.push(index);
        return true;
      }

      if (index === 0) {
        responses.push(context.responseQueue[index].textResponse);
      }

      return false;
    });
    context.actionQueue = _lodash.default.filter(context.actionQueue, (action, index) => {
      return actionsToRemove.indexOf(index) === -1;
    });
    context.responseQueue = _lodash.default.filter(context.responseQueue, (response, index) => {
      return actionsToRemove.indexOf(index) === -1;
    });
    return responses;
  };

  const getResponseOfChainedAction = async ({
    action,
    conversationStateObject
  }) => {
    const response = {
      actionWasFulfilled: true
    }; //If the chained action have required slots, check if those can be pulled from the current context

    const requiredSlotNames = _lodash.default.compact(_lodash.default.map(action.slots, slot => {
      return slot.isRequired ? slot : null;
    }));

    if (requiredSlotNames.length > 0) {
      const missingSlots = _lodash.default.filter(requiredSlotNames, slot => {
        if (conversationStateObject.slots) {
          const currentSlotValue = conversationStateObject.slots[slot.slotName];
          return currentSlotValue === undefined || currentSlotValue === '' || currentSlotValue === null || Array.isArray(currentSlotValue) && currentSlotValue.length === 0;
        }

        return true;
      });

      if (missingSlots.length > 0) {
        response.actionWasFulfilled = false;
        const textResponse = await agentService.converseCompileResponseTemplates({
          responses: missingSlots[0].textPrompts,
          templateContext: conversationStateObject,
          isTextPrompt: true
        });
        Object.assign(response, _objectSpread({}, textResponse));
        return response;
      }
    }

    if (action.useWebhook || conversationStateObject.agent.useWebhook) {
      let modelPath, webhook;

      if (action.useWebhook) {
        modelPath = [{
          model: _constants.MODEL_AGENT,
          id: conversationStateObject.agent.id
        }, {
          model: _constants.MODEL_ACTION,
          id: action.id
        }, {
          model: _constants.MODEL_WEBHOOK
        }];
        webhook = await globalService.findInModelPath({
          modelPath,
          isFindById: false,
          isSingleResult: true
        });
      } else {
        modelPath = [{
          model: _constants.MODEL_AGENT,
          id: conversationStateObject.agent.id
        }, {
          model: _constants.MODEL_WEBHOOK
        }];
        webhook = await globalService.findInModelPath({
          modelPath,
          isFindById,
          isSingleResult,
          skip,
          limit,
          direction,
          field
        });
      }

      const webhookResponse = await agentService.converseCallWebhook({
        url: webhook.webhookUrl,
        templatePayload: webhook.webhookPayload,
        payloadType: webhook.webhookPayloadType,
        method: webhook.webhookVerb,
        headers: webhook.webhookHeaders,
        username: webhook.webhookUser ? webhook.webhookUser : undefined,
        password: webhook.webhookPassword ? webhook.webhookPassword : undefined,
        templateContext: conversationStateObject
      });

      if (webhookResponse.textResponse) {
        return {
          textResponse: webhookResponse.textResponse,
          actions: webhookResponse.actions ? webhookResponse.actions : [],
          actionWasFulfilled: true,
          webhookResponse
        };
      }

      conversationStateObject.webhookResponse = _objectSpread({}, webhookResponse);
      const textResponse = await agentService.converseCompileResponseTemplates({
        responses: action.responses,
        templateContext: conversationStateObject
      });
      return _objectSpread({}, textResponse, {
        webhookResponse,
        actionWasFulfilled: true
      });
    }

    const textResponse = await agentService.converseCompileResponseTemplates({
      responses: action.responses,
      templateContext: conversationStateObject
    });
    Object.assign(response, _objectSpread({}, textResponse));
    return response;
  };

  const chainResponseActions = async ({
    conversationStateObject,
    responseActions
  }) => {
    const agentActions = conversationStateObject[_constants.CSO_AGENT].actions;
    let currentQueueIndex = 0;

    for (let responseAction of responseActions) {
      let agentAction = _lodash.default.filter(agentActions, tempAction => {
        return tempAction.actionName === responseAction;
      });

      if (agentAction.length > 0) {
        agentAction = agentAction[0];
        const indexOfActionInQueue = indexOnQueue({
          actionQueue: conversationStateObject.context.actionQueue,
          action: agentAction.actionName
        });

        if (indexOfActionInQueue !== -1) {
          moveOnQueue({
            context: conversationStateObject.context,
            oldIndex: indexOfActionInQueue,
            newIndex: currentQueueIndex
          });
          currentQueueIndex++;
        } else {
          conversationStateObject.context.actionQueue.push({
            action: agentAction.actionName,
            slots: {}
          });
          const response = await getResponseOfChainedAction({
            action: agentAction,
            conversationStateObject
          });

          if (response.webhookResponse) {
            webhookResponses.push(response.webhookResponse);
          }

          conversationStateObject.context.responseQueue.push(_objectSpread({}, response));
        }
      }
    }
  };

  const conversationStateObject = {};

  try {
    const AgentModel = await redis.factory(_constants.MODEL_AGENT, id);
    const ParsedDocument = await agentService.parse({
      AgentModel,
      text,
      timezone,
      returnModel: true,
      sessionId
    });

    const recognizedActionNames = ParsedDocument[_constants.PARAM_DOCUMENT_RASA_RESULTS][0].action.name.split(_constants.RASA_INTENT_SPLIT_SYMBOL);

    conversationStateObject[_constants.CSO_AGENT] = AgentModel.allProperties();
    conversationStateObject[_constants.CSO_AGENT].actions = await globalService.loadAllLinked({
      parentModel: AgentModel,
      model: _constants.MODEL_ACTION,
      returnModel: false
    });
    conversationStateObject[_constants.CSO_AGENT].categories = await globalService.loadAllLinked({
      parentModel: AgentModel,
      model: _constants.MODEL_CATEGORY,
      returnModel: false
    });
    conversationStateObject[_constants.CSO_AGENT].keywords = await globalService.loadAllLinked({
      parentModel: AgentModel,
      model: _constants.MODEL_KEYWORD,
      returnModel: false
    });
    let storeInQueue = false;
    let currentQueueIndex = 0;
    const responses = await recognizedActionNames.reduce(async (previousPromise, recognizedActionName) => {
      let finalResponse = null;
      const data = await previousPromise; //This block will handle sessionIds that doesn't exists
      //If the sessionId doesn't exists it creates one context for that session
      //And adds a frames attribute which is an empty array
      //The frames will be updated once converse resolve the value

      let context;

      try {
        context = await contextService.findBySession({
          sessionId,
          loadFrames: true
        });
      } catch (error) {
        if (error.statusCode && error.statusCode === 404) {
          context = await contextService.create({
            data: {
              sessionId
            }
          });
          context.frames = [];
        } else {
          return Promise.reject(error);
        }
      }

      conversationStateObject[_constants.CSO_CONTEXT] = context; //MARK: Get the last frame context from the context array

      conversationStateObject.currentFrame = _lodash.default.last(conversationStateObject.context.frames);
      ParsedDocument[_constants.PARAM_DOCUMENT_RASA_RESULTS][0].action.name = recognizedActionName;
      conversationStateObject.docId = ParsedDocument.id;
      conversationStateObject.parse = ParsedDocument[_constants.PARAM_DOCUMENT_RASA_RESULTS];
      conversationStateObject.text = text;
      conversationStateObject.sessionId = sessionId;
      conversationStateObject.timezone = timezone || conversationStateObject[_constants.CSO_AGENT].timezone || _constants.CSO_TIMEZONE_DEFAULT;

      if (!_lodash.default.isEmpty(additionalKeys)) {
        _lodash.default.mapKeys(additionalKeys, (value, key) => {
          if (!conversationStateObject[key]) {
            conversationStateObject[key] = value;
          }
        });
      }

      let indexOfActionInQueue = -1; //MARK: get category recognizer, 1 category or list of keywords from all categories

      conversationStateObject.rasaResult = getBestRasaResult({
        rasaResults: conversationStateObject.parse,
        categoryClassifierThreshold: conversationStateObject.agent.categoryClassifierThreshold,
        multiCategory: conversationStateObject.agent.multiCategory
      }); //MARK: if there is an action, look for it in the agent actions

      conversationStateObject.action = getActionData({
        rasaResult: conversationStateObject.rasaResult,
        agentActions: conversationStateObject.agent.actions
      });

      if (!conversationStateObject.action) {
        //MARK: look if the model recognized a modifier
        conversationStateObject.modifier = getModifierData({
          rasaResult: conversationStateObject.rasaResult,
          agentKeywords: conversationStateObject.agent.keywords
        });

        if (conversationStateObject.modifier) {
          //MARK: search if there is an action in the queue that can be modified by the modifier
          indexOfActionInQueue = indexOnQueue({
            actionQueue: conversationStateObject.context.actionQueue,
            modifier: conversationStateObject.modifier,
            agentActions: conversationStateObject.agent.actions
          });

          if (indexOfActionInQueue !== -1) {
            //MARK: if there is an action that can be modified by the modifier, then get its data
            conversationStateObject.action = getActionByName({
              actionName: conversationStateObject.context.actionQueue[0].action,
              agentActions: conversationStateObject.agent.actions
            });
          } else {
            //MARK: if the modifier doesn't modifies any action in the action queue, get latest action in context
            if (conversationStateObject.currentFrame) {
              conversationStateObject.action = getActionByName({
                actionName: conversationStateObject.currentFrame.action,
                agentActions: conversationStateObject.agent.actions
              });
            }
          }
        }
      } else {
        indexOfActionInQueue = indexOnQueue({
          actionQueue: conversationStateObject.context.actionQueue,
          action: conversationStateObject.action.actionName
        });
      }

      if (indexOfActionInQueue !== -1) {
        moveOnQueue({
          context: conversationStateObject.context,
          oldIndex: indexOfActionInQueue,
          newIndex: currentQueueIndex
        });
        currentQueueIndex++;
      }

      const agentToolResponse = await response({
        conversationStateObject
      });

      if (agentToolResponse.webhookResponse) {
        webhookResponses.push(agentToolResponse.webhookResponse);
      }

      const cleanAgentToolResponse = {
        docId: agentToolResponse.docId,
        textResponse: agentToolResponse.textResponse,
        actionWasFulfilled: agentToolResponse.actionWasFulfilled,
        actions: agentToolResponse.actions
      };
      storeInQueue = storeInQueue || !cleanAgentToolResponse.actionWasFulfilled;
      cleanAgentToolResponse.docId = conversationStateObject.docId;
      let postFormatPayloadToUse;
      let usedPostFormatAction;

      if (conversationStateObject.action && conversationStateObject.action.usePostFormat) {
        postFormatPayloadToUse = conversationStateObject.action.postFormat.postFormatPayload;
        usedPostFormatAction = true;
      } else if (conversationStateObject.agent.usePostFormat) {
        usedPostFormatAction = false;
        postFormatPayloadToUse = conversationStateObject.agent.postFormat.postFormatPayload;
      }

      if (postFormatPayloadToUse) {
        try {
          const compiledPostFormat = handlebars.compile(postFormatPayloadToUse);
          const processedPostFormat = compiledPostFormat(_objectSpread({}, conversationStateObject, {
            textResponse: cleanAgentToolResponse.textResponse
          }));
          const processedPostFormatJson = JSON.parse(processedPostFormat);
          processedPostFormatJson.docId = cleanAgentToolResponse.docId;

          if (!processedPostFormatJson.textResponse) {
            processedPostFormatJson.textResponse = cleanAgentToolResponse.textResponse;
          }

          finalResponse = processedPostFormatJson;
        } catch (error) {
          const errorMessage = usedPostFormatAction ? 'Error formatting the post response using action POST format : ' : 'Error formatting the post response using agent POST format : ';
          console.error(errorMessage, error);

          const responseWithError = _objectSpread({}, {
            postFormatting: errorMessage + error
          }, {
            cleanAgentToolResponse
          });

          finalResponse = responseWithError;
        }
      } else {
        finalResponse = cleanAgentToolResponse;
      }

      if (storeInQueue) {
        await storeDataInQueue({
          conversationStateObject,
          action: conversationStateObject.action ? conversationStateObject.action.actionName : recognizedActionName,
          response: finalResponse,
          indexOfActionInQueue
        });
      } else {
        if (indexOfActionInQueue !== -1) {
          await removeFromQueue({
            conversationStateObject,
            action: recognizedActionName
          });
        }

        data.push(finalResponse);
      }

      if (cleanAgentToolResponse.actionWasFulfilled && cleanAgentToolResponse.actions && cleanAgentToolResponse.actions.length > 0) {
        await chainResponseActions({
          conversationStateObject,
          responseActions: cleanAgentToolResponse.actions
        });
      }

      return data;
    }, Promise.resolve([]));

    let textResponses = _lodash.default.map(responses, 'textResponse'); //extract responses from previous answers


    const responsesFromQueue = getResponsesFromQueue({
      context: conversationStateObject.context
    });
    textResponses = textResponses.concat(responsesFromQueue);
    const textResponse = textResponses.length === 1 ? textResponses : textResponses.join(' ');
    await saveContextQueues({
      context: conversationStateObject.context
    });
    await documentService.update({
      id: conversationStateObject.docId,
      data: {
        webhookResponses
      }
    });
    await contextService.update({
      sessionId: conversationStateObject.context.sessionId,
      data: {
        savedSlots: conversationStateObject.context.savedSlots
      }
    });
    const converseResult = {
      textResponse,
      docId: conversationStateObject.docId,
      responses
    };

    if (debug) {
      const context = conversationStateObject.context,
            currentFrame = conversationStateObject.currentFrame,
            parse = conversationStateObject.parse,
            docId = conversationStateObject.docId;
      converseResult.conversationStateObject = {
        docId,
        context,
        currentFrame,
        parse,
        webhookResponses
      };
    }

    return converseResult;
  } catch (error) {
    if (error.isParseError) {
      if (error.missingCategories) {
        return {
          textResponse: 'I don\'t have any knowledge in my brain yet. Please teach me something.'
        };
      }

      if (error.missingTrainedCategories) {
        return {
          textResponse: 'Ok I know you have teach me a couple of things, but first you have to train me.'
        };
      }
    }

    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.converse.service.js.map