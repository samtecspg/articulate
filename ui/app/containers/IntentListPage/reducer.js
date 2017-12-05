import { fromJS } from 'immutable';

import { CHANGE_CURRENT_AGENT, } from './constants';

// The initial state of the App
const initialState = fromJS({
  domainData: {
    agent: null,
    domainName: '',
    enabled: true,
    intentThreshold: 65,
  },
});

function intentListReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CURRENT_AGENT:

      return state
        .updateIn(['domainData'], x => x.set(action.payload.field, action.payload.value));
    default:
      return state;
  }
}

export default intentListReducer;
