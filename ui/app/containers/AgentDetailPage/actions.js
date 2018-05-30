import {
  LOAD_AGENT,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  LOAD_WEBHOOK_ERROR,
  LOAD_WEBHOOK_SUCCESS,
  LOAD_WEBHOOK,
  LOAD_POSTFORMAT_ERROR,
  LOAD_POSTFORMAT_SUCCESS
} from './constants';

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
