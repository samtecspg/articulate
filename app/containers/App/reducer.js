import { fromJS } from 'immutable';

import {
  LOAD_AGENTS,
  LOAD_AGENTS_SUCCESS,
  LOAD_AGENTS_ERROR,
  LOAD_DOMAINS,
  LOAD_DOMAINS_SUCCESS,
  LOAD_DOMAINS_ERROR,
  CREATE_AGENT,
  CREATE_AGENT_SUCCESS,
  CREATE_AGENT_ERROR,
  CREATE_DOMAIN,
  CREATE_DOMAIN_SUCCESS,
  CREATE_DOMAIN_ERROR,
  CREATE_INTENT,
  CREATE_INTENT_SUCCESS,
  CREATE_INTENT_ERROR,
  CREATE_ENTITY,
  CREATE_ENTITY_SUCCESS,
  CREATE_ENTITY_ERROR,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentAgent: false,
  currentDomain: false,
  agents: false,
  domains: false,
  /*agent: {
    data: false,
  },*/
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_AGENTS:
      return state
        .set('loading', true)
        .set('error', false)
        .set('agents', false);
    case LOAD_AGENTS_SUCCESS:
      return state
        .set('agents', action.data)
        .set('loading', false)
    case LOAD_AGENTS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case LOAD_DOMAINS:
      return state
        .set('loading', true)
        .set('error', false)
        .set('domains', false);
    case LOAD_DOMAINS_SUCCESS:
      return state
        .set('domains', action.data)
        .set('loading', false)
    case LOAD_DOMAINS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case CREATE_AGENT:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['agent', 'data'], false);
    case CREATE_AGENT_SUCCESS:
      return state
        .setIn(['agent', 'data'], action.data)
        .set('loading', false)
        .set('currentAgent', action._id);
    case CREATE_AGENT_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case CREATE_DOMAIN:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['domain', 'data'], false);
    case CREATE_DOMAIN_SUCCESS:
      return state
        .setIn(['domain', 'data'], action.data)
        .set('loading', false)
        .set('currentDomain', action._id);
    case CREATE_DOMAIN_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case CREATE_INTENT:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['intent', 'data'], false);
    case CREATE_INTENT_SUCCESS:
      return state
        .setIn(['intent', 'data'], action.data)
        .set('loading', false)
        .set('currentIntent', action._id);
    case CREATE_INTENT_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case CREATE_ENTITY:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['entity', 'data'], false);
    case CREATE_ENTITY_SUCCESS:
      return state
        .setIn(['entity', 'data'], action.data)
        .set('loading', false)
        .set('currentEntity', action._id);
    case CREATE_ENTITY_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default appReducer;
