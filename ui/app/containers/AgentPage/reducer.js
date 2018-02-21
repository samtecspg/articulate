import { fromJS } from 'immutable';
import {
  CHANGE_AGENT_DATA,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  RESET_AGENT_DATA,
  LOAD_AGENT,
  REMOVE_AGENT_FALLBACK,
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
        return state
          .updateIn(['agentData'], x => x.set(action.payload.field, action.payload.value))
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
    case REMOVE_AGENT_FALLBACK:
      return state
        .setIn(['agentData', 'fallbackResponses'], state.getIn(['agentData', 'fallbackResponses']).splice(action.index, 1));
    default:
      return state;
  }
}

export default agentReducer;
