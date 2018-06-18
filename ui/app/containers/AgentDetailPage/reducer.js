import Immutable from 'seamless-immutable';

import {
  LOAD_AGENT,
  LOAD_AGENT_SUCCESS,
  LOAD_AGENT_ERROR,
  LOAD_WEBHOOK,
  LOAD_WEBHOOK_SUCCESS,
  LOAD_WEBHOOK_ERROR,
  LOAD_POSTFORMAT,
  LOAD_POSTFORMAT_SUCCESS,
  LOAD_POSTFORMAT_ERROR,
  LOAD_AGENT_SETTINGS_ERROR,
  LOAD_AGENT_SETTINGS_SUCCESS,
  LOAD_AGENT_SETTINGS,
} from './constants';


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
  },
  webhookData: {
    agent: '',
    webhookUrl: '',
    webhookVerb: '',
    webhookPayloadType: '',
    webhookPayload: '',
  },
  postFormatData: {
    agent: '',
    postFormatPayload: ''
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
});

function agentReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_AGENT:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_AGENT_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('agentData', action.agent);
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
        .set('webhookData', action.webhook);
    case LOAD_WEBHOOK_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
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
