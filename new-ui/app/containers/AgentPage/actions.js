/*
 *
 * AgentPage actions
 *
 */

import {
  RESET_DATA,
  LOAD_AGENT,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  CHANGE_AGENT_DATA,
  CHANGE_AGENT_NAME,
  CHANGE_WEBHOOK_DATA,
  CHANGE_WEBHOOK_PAYLOAD_TYPE,
  CHANGE_POST_FORMAT_DATA,
  CHANGE_SETTINGS_DATA,
  ADD_FALLBACK,
  DELETE_FALLBACK
} from './constants';

export function resetData() {
  return {
    type: RESET_DATA,
  }
}

export function loadAgent(agentId) {
  return {
    type: LOAD_AGENT,
    agentId,
  }
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


export function changeAgentData(payload) {
  return {
    type: CHANGE_AGENT_DATA,
    payload,
  };
}

export function changeAgentName(payload) {
  return {
    type: CHANGE_AGENT_NAME,
    payload,
  }
}

export function changeDomainClassifierThreshold(value) {
  return {
    type: CHANGE_AGENT_DATA,
    payload: {
      field: 'domainClassifierThreshold',
      value: parseInt(value)
    },
  };
}

export function addFallbackResponse(newFallback) {
  return {
    type: ADD_FALLBACK,
    newFallback,
  }
}

export function deleteFallbackResponse(fallbackIndex) {
  return {
    type: DELETE_FALLBACK,
    fallbackIndex,
  }
}

export function changeWebhookData(payload) {
  return {
    type: CHANGE_WEBHOOK_DATA,
    payload
  };
}

export function changeWebhookPayloadType(payload) {
  return {
    type: CHANGE_WEBHOOK_PAYLOAD_TYPE,
    payload
  };
}

export function changePostFormatData(payload) {
  return {
    type: CHANGE_POST_FORMAT_DATA,
    payload,
  };
}

export function changeSettingsData(payload) {
  return {
    type: CHANGE_SETTINGS_DATA,
    payload,
  }
}
