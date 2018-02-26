import { fromJS } from 'immutable';
import {
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  LOAD_WEBHOOK_ERROR,
  LOAD_WEBHOOK_SUCCESS,
  LOAD_AGENT,
  LOAD_WEBHOOK,
} from './constants';


// The initial state of the App
const initialState = fromJS({
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
        .set('agentData', fromJS(action.agent));
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
        .set('webhookData', fromJS(action.webhook));
    case LOAD_WEBHOOK_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default agentReducer;
