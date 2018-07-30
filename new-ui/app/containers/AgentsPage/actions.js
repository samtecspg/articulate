/*
 *
 * AgentsPage actions
 *
 */

import { LOAD_AGENTS, LOAD_AGENTS_SUCCESS, LOAD_AGENTS_ERROR } from './constants';

export function loadAgents() {
  return {
    type: LOAD_AGENTS,
  };
}

export function loadAgentsError(error) {
  return {
    type: LOAD_AGENTS_ERROR,
    error,
  };
}

export function loadAgentsSuccess(agents) {
  return {
    type: LOAD_AGENTS_SUCCESS,
    agents,
  };
}
