import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

import {
  CHANGE_AGENT_DATA,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  agentData: {
    agentName: '',
    agentDescription: '',
    language: 'english',
    defaultTimezone: 'America/Kentucky/Louisville',
    domainClassifierThreshold: 85,
    webhookUrl: 'http://localhost:3000',
    fallbackResponses: [
      'Sorry can you repharse that?',
      'I\'m still learning to speak with humans. What you mean?',
    ],
    useWebhookFallback: false
  },
});

function agentReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_AGENT_DATA:

      return state
        .updateIn(['agentData'], x => x.set(action.payload.field, action.payload.value));
    default:
      return state;
  }
}

export default agentReducer;
