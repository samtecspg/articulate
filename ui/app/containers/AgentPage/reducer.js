import { fromJS } from 'immutable';

import { CHANGE_AGENT_DATA, RESET_AGENT_DATA} from './constants';

// The initial state of the App
const initialState = fromJS({
  agentData: {
    agentName: '',
    description: '',
    language: 'en',
    timezone: 'America/Kentucky/Louisville',
    domainClassifierThreshold: 50,
    webhookUrl: 'http://localhost:3000',
    fallbackResponses: [
      'Sorry can you rephrase that?',
      'I\'m still learning to speak with humans. What you mean?',
    ],
    useWebhookFallback: false,
  },
});

function agentReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_AGENT_DATA:
      return state
        .updateIn(['agentData'], x => x.set(action.payload.field, action.payload.value));
    case RESET_AGENT_DATA:
      return initialState;
    default:
      return state;
  }
}

export default agentReducer;
