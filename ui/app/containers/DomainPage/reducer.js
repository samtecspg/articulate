import Immutable from 'seamless-immutable';
import {
  CHANGE_DOMAIN_DATA,
  LOAD_DOMAIN,
  LOAD_DOMAIN_ERROR,
  LOAD_DOMAIN_SUCCESS,
  RESET_DOMAIN_DATA
} from './constants';

// The initial state of the App
const initialState = Immutable({
  domainData: {
    agent: null,
    domainName: '',
    enabled: true,
    intentThreshold: 50,
    extraTrainingData: false,
  },
});

function domainReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DOMAIN_DATA:
      return state
        .setIn(['domainData', action.payload.field], action.payload.value);
    case RESET_DOMAIN_DATA:
      return initialState;
    case LOAD_DOMAIN:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_DOMAIN_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('domainData', action.domain);
    case LOAD_DOMAIN_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default domainReducer;
