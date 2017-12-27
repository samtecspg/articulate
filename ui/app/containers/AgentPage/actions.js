import {
  CHANGE_AGENT_DATA,
  RESET_AGENT_DATA,
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
