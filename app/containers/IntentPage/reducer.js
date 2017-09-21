import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

import {
  CHANGE_INTENT_DATA,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  intentData: {
    agent: null,
    domain: null,
    intentName: '',
  },
});

function intentReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_INTENT_DATA:

      return state
        .updateIn(['intentData'], x => x.set(action.payload.field, action.payload.value));
    default:
      return state;
  }
}

export default intentReducer;
