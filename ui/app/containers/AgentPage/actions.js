import {
  CHANGE_AGENT_DATA,
  CHANGE_WEBHOOK_DATA,
  LOAD_AGENT,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  RESET_AGENT_DATA,
  REMOVE_AGENT_FALLBACK,
  LOAD_WEBHOOK_ERROR,
  LOAD_WEBHOOK_SUCCESS,
  LOAD_WEBHOOK,
  CHANGE_POSTFORMAT_DATA,
  LOAD_POSTFORMAT_ERROR,
  LOAD_POSTFORMAT_SUCCESS,
  LOAD_POSTFORMAT,
  CHANGE_AGENT_SETTINGS_DATA,
  LOAD_AGENT_SETTINGS_ERROR,
  LOAD_AGENT_SETTINGS_SUCCESS,
  LOAD_AGENT_SETTINGS,
} from './constants';

export function changeAgentData(payload) {
  return {
    type: CHANGE_AGENT_DATA,
    payload,
  };
}

export function loadPostFormat(id){
  return{
    type: LOAD_POSTFORMAT,
    apiCall: true,
    id,
  }
}

export function changeWebhookData(payload) {
  return {
    type: CHANGE_WEBHOOK_DATA,
    payload,
  };
}

export function changePostFormatData(payload) {
  return {
    type: CHANGE_POSTFORMAT_DATA,
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

export function loadWebhookError(error) {
  return {
    type: LOAD_WEBHOOK_ERROR,
    error,
  };
}

export function loadWebhookSuccess(webhook) {
  return {
    type: LOAD_WEBHOOK_SUCCESS,
    webhook,
  };
}

export function loadPostFormatError(error) {
  return {
    type: LOAD_POSTFORMAT_ERROR,
    error,
  };
}

export function loadPostFormatSuccess(postFormat) {
  return {
    type: LOAD_POSTFORMAT_SUCCESS,
    postFormat,
  };
}

export function loadAgent(id) {
  return {
    type: LOAD_AGENT,
    apiCall: true,
    id,
  };
}

export function loadWebhook(id) {
  return {
    type: LOAD_WEBHOOK,
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

export function changeAgentSettingsData(payload) {
  return {
    type: CHANGE_AGENT_SETTINGS_DATA,
    payload,
  };
}

export function loadAgentSettings(id) {
  return {
    type: LOAD_AGENT_SETTINGS,
    apiCall: true,
    id,
  };
}

export function loadAgentSettingsError(error) {
  return {
    type: LOAD_AGENT_SETTINGS_ERROR,
    error,
  };
}

export function loadAgentSettingsSuccess(agentSettings) {
  return {
    type: LOAD_AGENT_SETTINGS_SUCCESS,
    agentSettings,
  };
}


