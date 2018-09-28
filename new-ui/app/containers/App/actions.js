/*
 *
 * App actions
 *
 */

import {
  CHECK_API,
  RESET_MISSING_API,
  RESET_STATUS_FLAGS,
  TOGGLE_CONVERSATION_BAR,
  CLOSE_NOTIFICATION,
  SEND_MESSAGE,
  RESPOND_MESSAGE,
  RESET_SESSION,
  RESET_SESSION_SUCCESS,
  LOAD_DOC,
  LOAD_DOC_ERROR,
  LOAD_DOC_SUCCESS,

  RESET_AGENT_DATA,
  LOAD_AGENTS,
  LOAD_AGENTS_ERROR,
  LOAD_AGENTS_SUCCESS,
  ADD_AGENT,
  ADD_AGENT_ERROR,
  ADD_AGENT_SUCCESS,
  UPDATE_AGENT,
  UPDATE_AGENT_ERROR,
  UPDATE_AGENT_SUCCESS,
  DELETE_AGENT,
  DELETE_AGENT_ERROR,
  DELETE_AGENT_SUCCESS,

  LOAD_AGENT,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  CHANGE_AGENT_DATA,
  CHANGE_AGENT_NAME,
  CHANGE_WEBHOOK_DATA,
  CHANGE_WEBHOOK_PAYLOAD_TYPE,
  CHANGE_POST_FORMAT_DATA,
  CHANGE_AGENT_SETTINGS_DATA,
  ADD_AGENT_FALLBACK,
  DELETE_AGENT_FALLBACK,
  TRAIN_AGENT,
  TRAIN_AGENT_ERROR,

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
  ADD_ACTION_SAYING,
  DELETE_ACTION_SAYING,
  ADD_ACTION_NEW_SAYING,
  DELETE_ACTION_NEW_SAYING,
  SEND_SAYING_TO_ACTION,
  LOAD_DOMAINS,
  LOAD_DOMAINS_ERROR,
  LOAD_DOMAINS_SUCCESS,
  LOAD_FILTERED_DOMAINS,
  LOAD_FILTERED_DOMAINS_ERROR,
  LOAD_FILTERED_DOMAINS_SUCCESS,
  SELECT_DOMAIN,

  LOAD_KEYWORDS,
  LOAD_KEYWORDS_ERROR,
  LOAD_KEYWORDS_SUCCESS,
  DELETE_KEYWORD,
  DELETE_KEYWORD_ERROR,

  LOAD_SETTINGS,
  LOAD_SETTINGS_ERROR,
  LOAD_SETTINGS_SUCCESS,
  UPDATE_SETTINGS,
  UPDATE_SETTINGS_ERROR,
  UPDATE_SETTINGS_SUCCESS,
  CHANGE_SETTINGS_DATA,
  ADD_FALLBACK,
  DELETE_FALLBACK,

  LOAD_ACTIONS,
  LOAD_ACTIONS_ERROR,
  LOAD_ACTIONS_SUCCESS,
  LOAD_ACTION,
  LOAD_ACTION_ERROR,
  LOAD_ACTION_SUCCESS,
  CHANGE_ACTION_NAME,
  CHANGE_ACTION_DATA,
  ADD_NEW_SLOT,
  ADD_ACTION_RESPONSE,
  DELETE_ACTION_RESPONSE,
  CHANGE_SLOT_NAME,
  CHANGE_SLOT_DATA,
  ADD_SLOT_TEXT_PROMPT_SLOT,
  DELETE_SLOT_TEXT_PROMPT_SLOT,
  CHANGE_ACTION_WEBHOOK_DATA,
  CHANGE_ACTION_WEBHOOK_PAYLOAD_TYPE,
  CHANGE_ACTION_POST_FORMAT_DATA,
  ADD_ACTION,
  ADD_ACTION_ERROR,
  ADD_ACTION_SUCCESS,
  UPDATE_ACTION,
  UPDATE_ACTION_ERROR,
  UPDATE_ACTION_SUCCESS,
  DELETE_ACTION,
  DELETE_ACTION_ERROR,
  DELETE_ACTION_SUCCESS,
  RESET_ACTION_DATA,

  RESET_KEYWORD_DATA,
  LOAD_KEYWORD,
  LOAD_KEYWORD_ERROR,
  LOAD_KEYWORD_SUCCESS,
  CREATE_KEYWORD,
  UPDATE_KEYWORD,
  CHANGE_KEYWORD_DATA,
  CREATE_KEYWORD_ERROR,
  CREATE_KEYWORD_SUCCESS,
  ADD_KEYWORD_EXAMPLE,
  DELETE_KEYWORD_EXAMPLE,
  CHANGE_EXAMPLE_SYNONYMS,
  UPDATE_KEYWORD_ERROR,
  UPDATE_KEYWORD_SUCCESS,

  RESET_DOMAIN_DATA,
  LOAD_DOMAIN,
  LOAD_DOMAIN_ERROR,
  LOAD_DOMAIN_SUCCESS,
  CREATE_DOMAIN,
  UPDATE_DOMAIN,
  CHANGE_DOMAIN_DATA,
  CREATE_DOMAIN_ERROR,
  CREATE_DOMAIN_SUCCESS,
  UPDATE_DOMAIN_ERROR,
  UPDATE_DOMAIN_SUCCESS,
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

export function resetStatusFlag() {
  return {
    type: RESET_STATUS_FLAGS,
  }
}

export function toggleConversationBar(value) {
  return {
    type: TOGGLE_CONVERSATION_BAR,
    value,
  }
}

export function closeNotification(index) {
  return {
    type: CLOSE_NOTIFICATION,
    index,
  }
}

export function sendMessage(message) {
  return {
    type: SEND_MESSAGE,
    apiCall: true,
    message,
  }
}

export function respondMessage(message) {
  return {
    type: RESPOND_MESSAGE,
    message,
  }
}

export function resetSession() {
  return {
    type: RESET_SESSION,
    apiCall: true,
  }
}

export function resetSessionSuccess() {
  return {
    type: RESET_SESSION_SUCCESS,
  }
}

export function loadDoc(docId) {
  return {
    type: LOAD_DOC,
    apiCall: true,
    docId,
  };
}

export function loadDocError(error) {
  return {
    type: LOAD_DOC_ERROR,
    error,
  };
}

export function loadDocSuccess(doc) {
  return {
    type: LOAD_DOC_SUCCESS,
    doc,
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

export function addAgentFallbackResponse(newFallback) {
  return {
    type: ADD_AGENT_FALLBACK,
    newFallback,
  }
}

export function deleteAgentFallbackResponse(fallbackIndex) {
  return {
    type: DELETE_AGENT_FALLBACK,
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

export function changeAgentSettingsData(payload) {
  return {
    type: CHANGE_AGENT_SETTINGS_DATA,
    payload,
  }
}

export function addAgent(){
  return {
    type: ADD_AGENT,
    apiCall: true
  }
}

export function addAgentError(){
  return {
    type: ADD_AGENT_ERROR,
  }
}

export function addAgentSuccess(agent){
  return {
    type: ADD_AGENT_SUCCESS,
    agent
  }
}

export function updateAgent(){
  return {
    type: UPDATE_AGENT,
    apiCall: true
  }
}

export function updateAgentError(){
  return {
    type: UPDATE_AGENT_ERROR,
  }
}

export function updateAgentSuccess(agent){
  return {
    type: UPDATE_AGENT_SUCCESS,
    agent
  }
}

export function deleteAgent(id){
  return {
    type: DELETE_AGENT,
    id,
    apiCall: true
  }
}

export function deleteAgentError(){
  return {
    type: DELETE_AGENT_ERROR,
  }
}

export function deleteAgentSuccess(){
  return {
    type: DELETE_AGENT_SUCCESS,
  }
}


export function trainAgent(){
  return {
    type: TRAIN_AGENT,
    apiCall: true,
  }
}

export function trainAgentError(error){
  return {
    type: TRAIN_AGENT_ERROR,
    error
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

export function addActionSaying(filter, page, saying, actionName){
  return {
    type: ADD_ACTION_SAYING,
    apiCall: true,
    filter,
    page,
    saying,
    actionName,
  };
}

export function deleteActionSaying(filter, page, saying, actionName){
  return {
    type: DELETE_ACTION_SAYING,
    apiCall: true,
    filter,
    page,
    saying,
    actionName,
  };
}

export function addActionNewSaying(actionName){
  return {
    type: ADD_ACTION_NEW_SAYING,
    actionName,
  };
}

export function deleteActionNewSaying(actionName){
  return {
    type: DELETE_ACTION_NEW_SAYING,
    actionName,
  };
}

export function sendSayingToAction(saying){
  return {
    type: SEND_SAYING_TO_ACTION,
    saying,
  }
}

export function loadDomains(){
  return {
    type: LOAD_DOMAINS,
    apiCall: true,
  }
}

export function loadDomainsError(error){
  return {
    type: LOAD_DOMAINS_ERROR,
    error,
  }
}

export function loadDomainsSuccess(domains){
  return {
    type: LOAD_DOMAINS_SUCCESS,
    domains,
  }
}

export function loadFilteredDomains(filter){
  return {
    type: LOAD_FILTERED_DOMAINS,
    filter,
    apiCall: true,
  }
}

export function loadFilteredDomainsError(error){
  return {
    type: LOAD_FILTERED_DOMAINS_ERROR,
    error,
  }
}

export function loadFilteredDomainsSuccess(domains){
  return {
    type: LOAD_FILTERED_DOMAINS_SUCCESS,
    domains,
  }
}

export function selectDomain(domainName){
  return {
    type: SELECT_DOMAIN,
    domainName,
  }
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

/*
* Settings
*/
export function loadSettings() {
  return {
    type: LOAD_SETTINGS,
    apiCall: true,
  };
}

export function loadSettingsError(error) {
  return {
    type: LOAD_SETTINGS_ERROR,
    error,
  };
}

export function loadSettingsSuccess(settings) {
  return {
    type: LOAD_SETTINGS_SUCCESS,
    settings,
  };
}

export function updateSettings() {
  return {
    type: UPDATE_SETTINGS,
    apiCall: true,
  };
}

export function updateSettingsError(error){
  return {
    type: UPDATE_SETTINGS_ERROR,
    error,
  };
}

export function updateSettingsSuccess(){
  return {
    type: UPDATE_SETTINGS_SUCCESS,
  };
}

export function changeSettingsData(payload) {
  return {
    type: CHANGE_SETTINGS_DATA,
    payload,
  }
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

/*
* Actions
*/
export function resetActionData() {
  return {
    type: RESET_ACTION_DATA,
  }
}

export function loadActions() {
  return {
    type: LOAD_ACTIONS,
    apiCall: true,
  }
}

export function loadActionsError(error) {
  return {
    type: LOAD_ACTIONS_ERROR,
    error,
  };
}

export function loadActionsSuccess(actions) {
  return {
    type: LOAD_ACTIONS_SUCCESS,
    actions,
  };
}

export function loadAction(actionId) {
  return {
    type: LOAD_ACTION,
    actionId,
    apiCall: true
  }
}

export function loadActionError(error) {
  return {
    type: LOAD_ACTION_ERROR,
    error,
  };
}

export function loadActionSuccess(payload) {
  return {
    type: LOAD_ACTION_SUCCESS,
    payload,
  };
}

export function changeActionName(payload) {
  return {
    type: CHANGE_ACTION_NAME,
    payload,
  }
}

export function changeActionData(payload) {
  return {
    type: CHANGE_ACTION_DATA,
    payload,
  };
}

export function addNewSlot(){
  return {
    type: ADD_NEW_SLOT,
  };
}

export function addActionResponse(newResponse) {
  return {
    type: ADD_ACTION_RESPONSE,
    newResponse,
  }
}

export function deleteActionResponse(responseIndex) {
  return {
    type: DELETE_ACTION_RESPONSE,
    responseIndex,
  }
}

export function changeSlotName(payload) {
  return {
    type: CHANGE_SLOT_NAME,
    payload,
  }
}

export function changeSlotData(payload) {
  return {
    type: CHANGE_SLOT_DATA,
    payload,
  };
}

export function addSlotTextPrompt(payload) {
  return {
    type: ADD_SLOT_TEXT_PROMPT_SLOT,
    payload,
  }
}

export function deleteSlotTextPrompt(payload) {
  return {
    type: DELETE_SLOT_TEXT_PROMPT_SLOT,
    payload,
  }
}

export function changeActionWebhookData(payload) {
  return {
    type: CHANGE_ACTION_WEBHOOK_DATA,
    payload
  };
}

export function changeActionWebhookPayloadType(payload) {
  return {
    type: CHANGE_ACTION_WEBHOOK_PAYLOAD_TYPE,
    payload
  };
}

export function changeActionPostFormatData(payload) {
  return {
    type: CHANGE_ACTION_POST_FORMAT_DATA,
    payload,
  };
}

export function addAction(){
  return {
    type: ADD_ACTION,
    apiCall: true
  }
}

export function addActionError(){
  return {
    type: ADD_ACTION_ERROR,
  }
}

export function addActionSuccess(action){
  return {
    type: ADD_ACTION_SUCCESS,
    action
  }
}

export function updateAction(){
  return {
    type: UPDATE_ACTION,
    apiCall: true
  }
}

export function updateActionError(){
  return {
    type: UPDATE_ACTION_ERROR,
  }
}

export function updateActionSuccess(action){
  return {
    type: UPDATE_ACTION_SUCCESS,
    action
  }
}

export function deleteAction(){
  return {
    type: DELETE_ACTION,
    apiCall: true
  }
}

export function deleteActionError(){
  return {
    type: DELETE_ACTION_ERROR,
  }
}

export function deleteActionSuccess(){
  return {
    type: DELETE_ACTION_SUCCESS,
  }
}

/* Keyword */
export function resetKeywordData(){
  return {
    type: RESET_KEYWORD_DATA,
  }
}

export function loadKeyword(id){
  return {
    type: LOAD_KEYWORD,
    apiCall: true,
    id,
  }
}

export function loadKeywordError(error){
  return {
    type: LOAD_KEYWORD_ERROR,
    error
  }
}

export function loadKeywordSuccess(keyword){
  return {
    type: LOAD_KEYWORD_SUCCESS,
    keyword
  }
}

export function createKeyword(){
  return {
    type: CREATE_KEYWORD,
    apiCall: true,
  }
}

export function createKeywordError(error){
  return {
    type: CREATE_KEYWORD_ERROR,
    error
  }
}

export function createKeywordSuccess(keyword){
  return {
    type: CREATE_KEYWORD_SUCCESS,
    keyword,
  }
}

export function updateKeyword(){
  return {
    type: UPDATE_KEYWORD,
    apiCall: true,
  }
}

export function updateKeywordError(error){
  return {
    type: UPDATE_KEYWORD_ERROR,
    error
  }
}

export function updateKeywordSuccess(keyword){
  return {
    type: UPDATE_KEYWORD_SUCCESS,
    keyword
  }
}

export function changeKeywordData(payload){
  return {
    type: CHANGE_KEYWORD_DATA,
    payload,
  }
}

export function addKeywordExample(newExample) {
  return {
    type: ADD_KEYWORD_EXAMPLE,
    newExample,
  }
}

export function deleteKeywordExample(exampleIndex) {
  return {
    type: DELETE_KEYWORD_EXAMPLE,
    exampleIndex,
  }
}

export function changeExampleSynonyms(exampleIndex, synonyms) {
  return {
    type: CHANGE_EXAMPLE_SYNONYMS,
    exampleIndex,
    synonyms,
  }
}

/* Domain */
export function resetDomainData(){
  return {
    type: RESET_DOMAIN_DATA,
  }
}

export function loadDomain(id){
  return {
    type: LOAD_DOMAIN,
    apiCall: true,
    id,
  }
}

export function loadDomainError(error){
  return {
    type: LOAD_DOMAIN_ERROR,
    error
  }
}

export function loadDomainSuccess(domain){
  return {
    type: LOAD_DOMAIN_SUCCESS,
    domain
  }
}

export function createDomain(){
  return {
    type: CREATE_DOMAIN,
    apiCall: true,
  }
}

export function createDomainError(error){
  return {
    type: CREATE_DOMAIN_ERROR,
    error
  }
}

export function createDomainSuccess(domain){
  return {
    type: CREATE_DOMAIN_SUCCESS,
    domain,
  }
}

export function updateDomain(){
  return {
    type: UPDATE_DOMAIN,
    apiCall: true,
  }
}

export function updateDomainError(error){
  return {
    type: UPDATE_DOMAIN_ERROR,
    error
  }
}

export function updateDomainSuccess(domain){
  return {
    type: UPDATE_DOMAIN_SUCCESS,
    domain
  }
}

export function changeDomainData(payload){
  return {
    type: CHANGE_DOMAIN_DATA,
    payload,
  }
}

export function changeActionThreshold(value) {
  return {
    type: CHANGE_DOMAIN_DATA,
    payload: {
      field: 'actionThreshold',
      value: parseInt(value)
    },
  };
}