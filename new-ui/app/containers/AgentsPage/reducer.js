/*
 *
 * AgentsPage reducer
 *
 */
import Immutable from 'seamless-immutable';

import { LOAD_AGENTS, LOAD_AGENTS_ERROR, LOAD_AGENTS_SUCCESS } from './constants';

const initialState = Immutable({
  agents: [],
  error: false,
  loading: false
});

function agentsPageReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_AGENTS:
      return state.set('agents', [])
      .set('loading', true)
      .set('error', false);
    case LOAD_AGENTS_ERROR:
      return state.set('agents', [])
      .set('loading', false)
      .set('error', action.error);
    case LOAD_AGENTS_SUCCESS:
      return state.set('agents', action.agents)
      .set('loading', false)
      .set('error', false);
    default:
      return state;
  }
}

export default agentsPageReducer;
