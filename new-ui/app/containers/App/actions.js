/*
 *
 * App actions
 *
 */

import {
  CHECK_API,
  RESET_MISSING_API,
  RESET_AGENT_DATA,

  LOAD_AGENTS,
  LOAD_AGENTS_ERROR,
  LOAD_AGENTS_SUCCESS,

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
  DELETE_FALLBACK,

  LOAD_SAYINGS,
  LOAD_SAYINGS_ERROR,
  LOAD_SAYINGS_SUCCESS,
  ADD_SAYING,
  ADD_SAYING_ERROR,
  DELETE_SAYING,
  DELETE_SAYING_ERROR,
  TAG_KEYWORD,
  UNTAG_KEYWORD,
  UPDATE_SAYING_ERROR,
  ADD_ACTION,
  DELETE_ACTION,

  LOAD_KEYWORDS,
  LOAD_KEYWORDS_ERROR,
  LOAD_KEYWORDS_SUCCESS,
  DELETE_KEYWORD,
  DELETE_KEYWORD_ERROR,
} from './constants';

/*
* Global
*/
export function checkAPI(refURL) {
  return {
    type: CHECK_API,
    apiCall: true,
    refURL,
  };
}

export function resetMissingAPI() {
  return {
    type: RESET_MISSING_API,
  };
}

/*
* Agents
*/
export function loadAgents() {
  return {
    type: LOAD_AGENTS,
    apiCall: true,
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

/*
* Agent
*/

export function resetAgentData() {
  return {
    type: RESET_AGENT_DATA,
  }
}

export function loadAgent(agentId) {
  return {
    type: LOAD_AGENT,
    agentId,
    apiCall: true
  }
}

export function loadAgentError(error) {
  return {
    type: LOAD_AGENT_ERROR,
    error,
  };
}

export function loadAgentSuccess(payload) {
  return {
    type: LOAD_AGENT_SUCCESS,
    payload,
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

/*
* Sayings
*/
export function loadSayings(filter, page) {
  return {
    type: LOAD_SAYINGS,
    apiCall: true,
    filter,
    page,
  };
}

export function loadSayingsError(error) {
  return {
    type: LOAD_SAYINGS_ERROR,
    error,
  };
}

export function loadSayingsSuccess(sayings) {
  return {
    type: LOAD_SAYINGS_SUCCESS,
    sayings,
  };
}

export function addSaying(value) {
  return {
    type: ADD_SAYING,
    apiCall: true,
    value,
  }
}

export function addSayingError(error) {
  return {
    type: ADD_SAYING_ERROR,
    error,
  };
}

export function deleteSaying(sayingId) {
  return {
    type: DELETE_SAYING,
    apiCall: true,
    sayingId,
  }
}

export function deleteSayingError(error) {
  return {
    type: DELETE_SAYING_ERROR,
    error,
  };
}

export function tagKeyword(filter, page, saying, taggedText, keywordId, keywordName){
  return {
    type: TAG_KEYWORD,
    apiCall: true,
    filter,
    page,
    saying,
    taggedText,
    keywordId,
    keywordName,
  }
}

export function untagKeyword(filter, page, saying, start, end){
  return {
    type: UNTAG_KEYWORD,
    apiCall: true,
    filter,
    page,
    saying,
    start,
    end,
  }
}

export function updateSayingError(error){
  return {
    type: UPDATE_SAYING_ERROR,
    error,
  };
}

export function addAction(filter, page, saying, actionName){
  return {
    type: ADD_ACTION,
    apiCall: true,
    filter,
    page,
    saying,
    actionName,
  };
}

export function deleteAction(filter, page, saying, actionName){
  return {
    type: DELETE_ACTION,
    apiCall: true,
    filter,
    page,
    saying,
    actionName,
  };
}

/*
* Keywords
*/
export function loadKeywords(filter, page) {
  return {
    type: LOAD_KEYWORDS,
    apiCall: true,
    filter,
    page,
  };
}

export function loadKeywordsError(error) {
  return {
    type: LOAD_KEYWORDS_ERROR,
    error,
  };
}

export function loadKeywordsSuccess(keywords) {
  return {
    type: LOAD_KEYWORDS_SUCCESS,
    keywords,
  };
}

export function deleteKeyword(keywordId) {
  return {
    type: DELETE_KEYWORD,
    apiCall: true,
    keywordId,
  }
}

export function deleteKeywordError(error) {
  return {
    type: DELETE_KEYWORD_ERROR,
    error,
  };
}
