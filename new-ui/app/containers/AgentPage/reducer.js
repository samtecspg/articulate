/*
 *
 * AgentPage reducer
 *
 */

import Immutable from 'seamless-immutable';
import {
  RESET_DATA,
  LOAD_AGENT,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  CHANGE_AGENT_DATA,
  CHANGE_AGENT_NAME,
  CHANGE_WEBHOOK_DATA,
  CHANGE_WEBHOOK_PAYLOAD_TYPE,
  CHANGE_POST_FORMAT_DATA,
  CHANGE_SETTINGS_DATA,
  ADD_FALLBACK,
  DELETE_FALLBACK
} from './constants';

export const initialState = Immutable({
  agent: {
    agentName: '',
    description: '',
    language: 'en',
    timezone: 'utc',
    useWebhook: false,
    usePostFormat: false,
    extraTrainingData: false,
    enableModelsPerDomain: true,
    fallbackResponses: [
      'Sorry, can you rephrase that?',
      'I\'m sorry, I\'m still learning to speak with humans'
    ],
    domainClassifierThreshold: 50,
  },
  webhook: {
    agent: '',
    webhookUrl: '',
    webhookVerb: 'GET',
    webhookPayloadType: 'None',
    webhookPayload: '',
  },
  postFormat: {
    agent: '',
    postFormatPayload: '{\n\t"textResponse" : "{{ textResponse }}"\n}'
  },
  agentSettings: {
    rasaURL: '',
    ducklingURL: '',
    ducklingDimension: '[]',
    spacyPretrainedEntities: '[]',
    domainClassifierPipeline: '[]',
    intentClassifierPipeline: '[]',
    entityClassifierPipeline: '[]',
  },
  oldPayloadJSON: '{\n\t"text": "{{text}}",\n\t"intent": {{{JSONstringify intent}}},\n\t"slots": {{{JSONstringify slots}}}\n}',
  oldPayloadXML: '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n\t<text>{{text}}</text>\n\t<intent>{{{toXML intent}}}</intent>\n\t<slots>{{{toXML slots}}}</slots>\n</data>',
  touched: false,
});

function agentPageReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_DATA:
      return initialState;
    case LOAD_AGENT:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_AGENT_ERROR:
      return state
        .set('agent', {})
        .set('loading', false)
        .set('error', action.error);
    case LOAD_AGENT_SUCCESS:
      return state
        .set('agent', action.agent)
        .set('loading', false)
        .set('error', false);
    case CHANGE_AGENT_NAME:
      return state
        .setIn(['agent', action.payload.field], action.payload.value)
        .setIn(['webhook', 'agent'], action.payload.value)
        .setIn(['postFormatData', 'agent'], action.payload.value)
        .set('touched', true);;
    case CHANGE_AGENT_DATA:
      return state.setIn(['agent', action.payload.field], action.payload.value);
    case CHANGE_WEBHOOK_DATA:
      return state.setIn(['webhook', action.payload.field], action.payload.value);
    case CHANGE_WEBHOOK_PAYLOAD_TYPE:
      if (action.payload.value === 'None') {
        if (state.webhook.webhookPayloadType === 'JSON') {
          state = state.set('oldPayloadJSON', state.webhook.webhookPayload);
        }
        if (state.webhook.webhookPayloadType === 'XML') {
          state = state.set('oldPayloadXML', state.webhook.webhookPayload);
        }
        return state
          .setIn(['webhook', 'webhookPayload'], '')
          .setIn(['webhook', action.payload.field], action.payload.value)
          .set('touched', true);
      }
      else {
        if (action.payload.value === 'JSON' && state.webhook.webhookPayloadType !== 'JSON') {
          if (state.webhook.webhookPayloadType === 'XML') {
            state = state.set('oldPayloadXML', state.webhook.webhookPayload);
          }
          state = state.setIn(['webhook', 'webhookPayload'], state.oldPayloadJSON);
        }
        if (action.payload.value === 'XML' && state.webhook.webhookPayloadType !== 'XML') {
          if (state.webhook.webhookPayloadType === 'JSON') {
            state = state.set('oldPayloadJSON', state.webhook.webhookPayload);
          }
          state = state.setIn(['webhook', 'webhookPayload'], state.oldPayloadXML);
        }
        return state
          .setIn(['webhook', action.payload.field], action.payload.value)
          .set('touched', true);
      }
    case CHANGE_POST_FORMAT_DATA:
      return state
        .setIn(['postFormat', action.payload.field], action.payload.value)
        .set('touched', true);
    case CHANGE_SETTINGS_DATA:
      return state
        .setIn(['agentSettings', action.payload.field], action.payload.value)
        .set('touched', true);
    case ADD_FALLBACK:
      return state.updateIn(['agent', 'fallbackResponses'], fallbackResponses => fallbackResponses.concat(action.newFallback));
    case DELETE_FALLBACK:
      return state.updateIn(['agent', 'fallbackResponses'], fallbackResponses => fallbackResponses.filter((item, index) => index !== action.fallbackIndex));
    default:
      return state;
  }
}

export default agentPageReducer;
