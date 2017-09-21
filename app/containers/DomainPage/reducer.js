import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

import {
  CHANGE_DOMAIN_DATA,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  domainData: {
    agent: null,
    domainName: '',
    enabled: true,
    intentThreshold: 0.65,
  },
});

function domainReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DOMAIN_DATA:

      return state
        .updateIn(['domainData'], x => x.set(action.payload.field, action.payload.value));
    default:
      return state;
  }
}

export default domainReducer;
