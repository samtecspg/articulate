import { fromJS } from 'immutable';

import { CHANGE_WEBHOOK_DATA, RESET_WEBHOOK_DATA, } from './constants';

// The initial state of the App
const initialState = fromJS({
  webhookData: {
    agent: null,
    webhookUrl: '',
  },
});

function webhookReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_WEBHOOK_DATA:
      return state
        .updateIn(['webhookData'], x => x.set(action.payload.field, action.payload.value));
    case RESET_WEBHOOK_DATA:
      return initialState;
    default:
      return state;
  }
}

export default webhookReducer;
