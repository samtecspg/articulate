import Immutable from 'seamless-immutable';

import {
  CHANGE_AGENT_DATA,
  CHANGE_WEBHOOK_DATA,
  CHANGE_POSTFORMAT_DATA,
  LOAD_POSTFORMAT_ERROR,
  LOAD_POSTFORMAT_SUCCESS,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  LOAD_WEBHOOK_ERROR,
  LOAD_WEBHOOK_SUCCESS,
  RESET_AGENT_DATA,
  LOAD_AGENT,
  REMOVE_AGENT_FALLBACK,
  LOAD_WEBHOOK,
  LOAD_POSTFORMAT,
} from './constants';
import messages from '../IntentPage/messages';

// The initial state of the App
const initialState = Immutable({
  agentData: {
    agentName: '',
    description: '',
    language: 'en',
    timezone: 'UTC',
    domainClassifierThreshold: 50,
    fallbackResponses: [
      'Sorry can you rephrase that?',
      'I\'m still learning to speak with humans. What you mean?',
    ],
    useWebhook: false,
    extraTrainingData: false,
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
    postFormatPayload: ''
  },
  oldPayloadJSON: '',
  oldPayloadXML: '',
  oldAgentData: null,
  oldWebhookData: null,
  touched: false,
});

function agentReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_AGENT_DATA:
      if (action.payload.field === 'fallbackResponses') {
        return state
          .updateIn(['agentData', 'fallbackResponses'], fallbackResponses => fallbackResponses.concat(action.payload.value))
          .set('touched', true);
      }
      else {
        if (action.payload.field === 'agentName') {
          return state
            .setIn(['agentData', action.payload.field], action.payload.value)
            .setIn(['webhookData', 'agent'], action.payload.value)
            .setIn(['postFormatData', 'agent'], action.payload.value)
            .set('touched', true);

        }
        else {
          if (action.payload.field === 'usePostFormat') {
            if (action.payload.value === 'true' && state.getIn(['postFormatData','postFormatPayload']) === ''){
              return state
              .setIn(['agentData', action.payload.field], action.payload.value === 'true')
              .setIn(['postFormatData','postFormatPayload'],messages.defaultPostFormat.defaultMessage)
              .set('touched', true);
            }
            return state
              .setIn(['agentData', action.payload.field], action.payload.value === 'true')
              .set('touched', true);
          }
          if (action.payload.field === 'useWebhook') {
            return state
              .setIn(['agentData', action.payload.field], action.payload.value === 'true')
              .set('touched', true);
          }
          else {
            if (action.payload.field === 'extraTrainingData') {
              return state
                .setIn(['agentData', action.payload.field], action.payload.value === 'true')
                .set('touched', true);
            }
            else {
              return state
                .setIn(['agentData', action.payload.field], action.payload.value)
                .set('touched', true);
            }
          }
        }
      }
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
    default:
      return state;
  }
}

export default agentReducer;
