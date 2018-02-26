import { fromJS } from 'immutable';
import {
  CHANGE_AGENT_DATA,
  CHANGE_WEBHOOK_DATA,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  LOAD_WEBHOOK_ERROR,
  LOAD_WEBHOOK_SUCCESS,
  RESET_AGENT_DATA,
  LOAD_AGENT,
  REMOVE_AGENT_FALLBACK,
  LOAD_WEBHOOK,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  agentData: {
    agentName: '',
    description: '',
    language: 'en',
    timezone: 'America/Kentucky/Louisville',
    domainClassifierThreshold: 50,
    fallbackResponses: [
      'Sorry can you rephrase that?',
      'I\'m still learning to speak with humans. What you mean?',
    ],
    useWebhook: false,
  },
  webhookData: {
    agent: '',
    webhookUrl: '',
    webhookVerb: 'GET',
    webhookPayloadType: 'None',
    webhookPayload: '',
  },
  oldPayloadJSON: '',
  oldPayloadXML: '',
  touched: false,
});

function agentReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_AGENT_DATA:
      if (action.payload.field === 'fallbackResponses'){
        return state
          .updateIn(['agentData'], agent => agent.set('fallbackResponses', agent.get('fallbackResponses').push(action.payload.value)))
          .set('touched', true);
      }
      else {
        if (action.payload.field === 'agentName'){
          return state
            .updateIn(['agentData'], x => x.set(action.payload.field, action.payload.value))
            .updateIn(['webhookData'], x => x.set('agent', action.payload.value))
            .set('touched', true);
        }
        else {
          if (action.payload.field === 'useWebhook'){
            return state
              .updateIn(['agentData'], x => x.set(action.payload.field, action.payload.value === 'true'))
              .set('touched', true);
          }
          else {
            return state
              .updateIn(['agentData'], x => x.set(action.payload.field, action.payload.value))
              .set('touched', true);
          }
        }
      }
    case CHANGE_WEBHOOK_DATA:
      if (action.payload.field === 'webhookPayloadType' && action.payload.value === 'None'){
        if (state.getIn(['webhookData', 'webhookPayloadType']) === 'JSON'){
          state = state.set('oldPayloadJSON', state.getIn(['webhookData', 'webhookPayload']));
        }
        if (state.getIn(['webhookData', 'webhookPayloadType']) === 'XML'){
          state = state.set('oldPayloadXML', state.getIn(['webhookData', 'webhookPayload']));
        }
        return state
          .updateIn(['webhookData'], x => x.set('webhookPayload', ''))
          .updateIn(['webhookData'], x => x.set(action.payload.field, action.payload.value))
          .set('touched', true);
      }
      else {
        if (action.payload.field === 'webhookPayloadType'){
          if(action.payload.value === 'JSON' && state.getIn(['webhookData', 'webhookPayloadType']) !== 'JSON'){
            if (state.getIn(['webhookData', 'webhookPayloadType']) === 'XML'){
              state = state.set('oldPayloadXML', state.getIn(['webhookData', 'webhookPayload']));
            }
            state = state.setIn(['webhookData', 'webhookPayload'], state.get('oldPayloadJSON'));
          }
          if(action.payload.value === 'XML' && state.getIn(['webhookData', 'webhookPayloadType']) !== 'XML'){
            if (state.getIn(['webhookData', 'webhookPayloadType']) === 'JSON'){
              state = state.set('oldPayloadJSON', state.getIn(['webhookData', 'webhookPayload']));
            }
            state = state.setIn(['webhookData', 'webhookPayload'], state.get('oldPayloadXML'));
          }
        }
        return state
          .updateIn(['webhookData'], x => x.set(action.payload.field, action.payload.value))
          .set('touched', true);
      }
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
    case REMOVE_AGENT_FALLBACK:
      return state
        .setIn(['agentData', 'fallbackResponses'], state.getIn(['agentData', 'fallbackResponses']).splice(action.index, 1));
    default:
      return state;
  }
}

export default agentReducer;
