import Immutable from 'seamless-immutable';
import { CHANGE_CURRENT_AGENT, } from './constants';

// The initial state of the App
const initialState = Immutable({
  domainData: {
    agent: null,
  },
});

function domainReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CURRENT_AGENT:
      return state
        .updateIn(['domainData'], x => x.set(action.payload.field, action.payload.value));
    default:
      return state;
  }
}

export default domainReducer;
