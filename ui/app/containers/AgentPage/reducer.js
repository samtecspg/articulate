import Immutable from 'seamless-immutable';

import {
  RESET_AGENT_DATA,
  REMOVE_AGENT_FALLBACK,
  CHANGE_AGENT_DATA,
  CHANGE_WEBHOOK_DATA,
  CHANGE_POSTFORMAT_DATA,
  CHANGE_AGENT_SETTINGS_DATA,
  LOAD_AGENT,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  LOAD_WEBHOOK,
  LOAD_WEBHOOK_ERROR,
  LOAD_WEBHOOK_SUCCESS,
  LOAD_POSTFORMAT,
  LOAD_POSTFORMAT_ERROR,
  LOAD_POSTFORMAT_SUCCESS,
  LOAD_AGENT_SETTINGS,
  LOAD_AGENT_SETTINGS_ERROR,
  LOAD_AGENT_SETTINGS_SUCCESS,
} from './constants';
import messages from '../IntentPage/messages';

// The initial state of the App
const initialState = Immutable({
  agentData: {
    agentName: '',
    description: '',
    language: '',
    timezone: '',
    domainClassifierThreshold: 50,
    fallbackResponses: [],
    useWebhook: false,
    usePostFormat: false,
    extraTrainingData: false,
    enableModelsPerDomain: true,
  },
  webhookData: {
    agent: '',
    webhookUrl: '',
    webhookVerb: 'GET',
    webhookPayloadType: 'None',
    webhookPayload: '',
  },
  postFormatData: {
    agent: '',
    postFormatPayload: '{\n\t"textResponse" : "{{ textResponse }}"\n}'
  },
  agentSettingsData: {
    rasaURL: '',
    ducklingURL: '',
    ducklingDimension: [],
    spacyPretrainedEntities: [],
    domainClassifierPipeline: [],
    intentClassifierPipeline: [],
    entityClassifierPipeline: [],
  },
  oldPayloadJSON: '{\n\t"text": "{{text}}",\n\t"intent": {{{JSONstringify intent}}},\n\t"slots": {{{JSONstringify slots}}}\n}',
  oldPayloadXML: '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n\t<text>{{text}}</text>\n\t<intent>{{{toXML intent}}}</intent>\n\t<slots>{{{toXML slots}}}</slots>\n</data>',
  oldAgentData: null,
  oldWebhookData: null,
  touched: false,
});

function agentReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_AGENT_DATA:
      let stateToReturn = null;
      if (action.payload.field === 'fallbackResponses') {
        stateToReturn = state
          .updateIn(['agentData', 'fallbackResponses'], fallbackResponses => fallbackResponses.concat(action.payload.value));
      }
      else {
        if (action.payload.field === 'agentName') {
          stateToReturn = state
            .setIn(['agentData', action.payload.field], action.payload.value)
            .setIn(['webhookData', 'agent'], action.payload.value)
            .setIn(['postFormatData', 'agent'], action.payload.value);
        }
        else {
          if (action.payload.field === 'usePostFormat') {
            if (action.payload.value && state.getIn(['postFormatData','postFormatPayload']) === ''){
              stateToReturn = state
                .setIn(['postFormatData','postFormatPayload'],messages.defaultPostFormat.defaultMessage);
            }
            stateToReturn = state
              .setIn(['agentData', action.payload.field], action.payload.value);
          }
          else {
            stateToReturn = state
              .setIn(['agentData', action.payload.field], action.payload.value);
          }
        }
      }
      if (!action.initialLoad){
        stateToReturn = stateToReturn.set('touched', true);
      }
      return stateToReturn;
    case CHANGE_WEBHOOK_DATA:
      if (action.payload.field === 'webhookPayloadType' && action.payload.value === 'None') {
        if (state.webhookData.webhookPayloadType === 'JSON') {
          state = state.set('oldPayloadJSON', state.webhookData.webhookPayload);
        }
        if (state.webhookData.webhookPayloadType === 'XML') {
          state = state.set('oldPayloadXML', state.webhookData.webhookPayload);
        }
        return state
          .setIn(['webhookData', 'webhookPayload'], '')
          .setIn(['webhookData', action.payload.field], action.payload.value)
          .set('touched', true);
      }
      else {
        if (action.payload.field === 'webhookPayloadType') {
          if (action.payload.value === 'JSON' && state.webhookData.webhookPayloadType !== 'JSON') {
            if (state.webhookData.webhookPayloadType === 'XML') {
              state = state.set('oldPayloadXML', state.webhookData.webhookPayload);
            }
            state = state.setIn(['webhookData', 'webhookPayload'], state.oldPayloadJSON);
          }
          if (action.payload.value === 'XML' && state.webhookData.webhookPayloadType !== 'XML') {
            if (state.webhookData.webhookPayloadType === 'JSON') {
              state = state.set('oldPayloadJSON', state.webhookData.webhookPayload);
            }
            state = state.setIn(['webhookData', 'webhookPayload'], state.oldPayloadXML);
          }
        }
        return state
          .setIn(['webhookData', action.payload.field], action.payload.value)
          .set('touched', true);
      }
    case CHANGE_POSTFORMAT_DATA:
      return state.setIn(['postFormatData', action.payload.field], action.payload.value);
    case LOAD_POSTFORMAT:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_POSTFORMAT_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('postFormatData', action.postFormat);
    case LOAD_POSTFORMAT_ERROR:
      return state
        .set('loading', false);
    case RESET_AGENT_DATA:
      return initialState;
    case LOAD_AGENT:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_AGENT_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('agentData', action.agent)
        .setIn(['webhookData', 'agent'], action.agent.agentName)
        .setIn(['postFormatData', 'agent'], action.agent.agentName)
        .set('oldAgentData', action.agent);
    case LOAD_AGENT_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case LOAD_WEBHOOK:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_WEBHOOK_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('webhookData', action.webhook)
        .set('oldWebhookData', action.webhook);
    case LOAD_WEBHOOK_ERROR:
      return state
        .set('loading', false);
    case REMOVE_AGENT_FALLBACK:
      return state
        .updateIn(['agentData', 'fallbackResponses'], fallbackResponses => fallbackResponses.filter((item, index) => index !== action.index));
    case CHANGE_AGENT_SETTINGS_DATA:
      if (!action.initialLoad){
        return state
          .setIn(['agentSettingsData', action.payload.field], action.payload.value)
          .set('touched', true);
      }
      return state
        .setIn(['agentSettingsData', action.payload.field], action.payload.value);
    case LOAD_AGENT_SETTINGS:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_AGENT_SETTINGS_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('agentSettingsData', action.agentSettings);
    case LOAD_AGENT_SETTINGS_ERROR:
      return state
        .set('loading', false);
    default:
      return state;
  }
}

export default agentReducer;
