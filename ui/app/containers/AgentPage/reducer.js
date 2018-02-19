import Immutable from 'seamless-immutable';

import {
  CHANGE_AGENT_DATA,
  LOAD_AGENT,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  REMOVE_AGENT_FALLBACK,
  RESET_AGENT_DATA,
} from './constants';

// The initial state of the App
const initialState = Immutable({
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
      if (action.payload.field === 'fallbackResponses') {
        return state
          .updateIn(['agentData', 'fallbackResponses'], fallbackResponses => fallbackResponses.concat(action.payload.value))
          .set('touched', true);
      }
      return state
        .setIn(['agentData', action.payload.field], action.payload.value)
        .set('touched', true);
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
        .set('agentData', action.agent);
    case LOAD_AGENT_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case REMOVE_AGENT_FALLBACK:
      return state
        .updateIn(['agentData', 'fallbackResponses'], fallbackResponses => fallbackResponses.filter((item, index) => index !== action.index));
    default:
      return state;
  }
}

export default agentReducer;
