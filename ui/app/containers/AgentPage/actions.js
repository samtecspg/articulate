import {
  CHANGE_AGENT_DATA,
  LOAD_AGENT,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  RESET_AGENT_DATA,
  REMOVE_AGENT_FALLBACK,
} from './constants';

export function changeAgentData(payload) {
  return {
    type: CHANGE_AGENT_DATA,
    payload,
  };
}

export function resetAgentData() {
  return {
    type: RESET_AGENT_DATA,
  };
}

export function loadAgentError(error) {
  return {
    type: LOAD_AGENT_ERROR,
    error,
  };
}

export function loadAgentSuccess(agent) {
  return {
    type: LOAD_AGENT_SUCCESS,
    agent,
  };
}

export function loadAgent(id) {
  return {
    type: LOAD_AGENT,
    apiCall: true,
    id,
  };
}

export function removeAgentFallback(index) {
  return {
    type: REMOVE_AGENT_FALLBACK,
    index,
  };
}
