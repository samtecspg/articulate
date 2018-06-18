import {
  ACTION_CANCELLED,
  CONVERSE,
  CONVERSE_ERROR,
  CONVERSE_SUCCESS,
  CREATE_AGENT,
  CREATE_AGENT_ERROR,
  CREATE_AGENT_SUCCESS,
  CREATE_DOMAIN,
  CREATE_DOMAIN_ERROR,
  CREATE_DOMAIN_SUCCESS,
  CREATE_ENTITY,
  CREATE_ENTITY_ERROR,
  CREATE_ENTITY_SUCCESS,
  CREATE_INTENT,
  CREATE_INTENT_ERROR,
  CREATE_INTENT_SUCCESS,
  CREATE_SCENARIO_ERROR,
  CREATE_SCENARIO_SUCCESS,
  CREATE_WEBHOOK,
  CREATE_WEBHOOK_ERROR,
  CREATE_WEBHOOK_SUCCESS,
  DELETE_AGENT,
  DELETE_AGENT_ERROR,
  DELETE_AGENT_SUCCESS,
  DELETE_DOMAIN,
  DELETE_DOMAIN_ERROR,
  DELETE_DOMAIN_SUCCESS,
  DELETE_ENTITY,
  DELETE_ENTITY_ERROR,
  DELETE_ENTITY_SUCCESS,
  DELETE_INTENT,
  DELETE_INTENT_ERROR,
  DELETE_INTENT_SUCCESS,
  LOAD_AGENT_DOMAINS,
  LOAD_AGENT_DOMAINS_ERROR,
  LOAD_AGENT_DOMAINS_SUCCESS,
  LOAD_AGENT_ENTITIES,
  LOAD_AGENT_ENTITIES_ERROR,
  LOAD_AGENT_ENTITIES_SUCCESS,
  LOAD_AGENT_INTENTS,
  LOAD_AGENT_INTENTS_ERROR,
  LOAD_AGENT_INTENTS_SUCCESS,
  LOAD_AGENTS,
  LOAD_AGENTS_ERROR,
  LOAD_AGENTS_SUCCESS,
  LOAD_CURRENT_AGENT,
  LOAD_CURRENT_AGENT_ERROR,
  LOAD_CURRENT_AGENT_SUCCESS,
  LOAD_CURRENT_AGENT_STATUS,
  LOAD_CURRENT_AGENT_STATUS_SUCCESS,
  LOAD_DOMAINS_INTENTS,
  LOAD_DOMAINS_INTENTS_ERROR,
  LOAD_DOMAINS_INTENTS_SUCCESS,
  LOAD_ENTITY_INTENTS,
  LOAD_ENTITY_INTENTS_ERROR,
  LOAD_ENTITY_INTENTS_SUCCESS,
  RESET_AGENT_DOMAINS,
  RESET_CURRENT_AGENT,
  RESET_DOMAINS_INTENTS,
  RESET_SESSION,
  RESET_SESSION_ERROR,
  RESET_SESSION_SUCCESS,
  RESET_STATUS_FLAGS,
  RESET_MISSING_API,
  SELECT_CURRENT_AGENT,
  SET_IN_WIZARD,
  UPDATE_AGENT,
  UPDATE_AGENT_ERROR,
  UPDATE_AGENT_SUCCESS,
  UPDATE_DOMAIN,
  UPDATE_DOMAIN_ERROR,
  UPDATE_DOMAIN_SUCCESS,
  UPDATE_ENTITY,
  UPDATE_ENTITY_ERROR,
  UPDATE_ENTITY_SUCCESS,
  UPDATE_INTENT,
  UPDATE_INTENT_ERROR,
  UPDATE_INTENT_SUCCESS,
  UPDATE_SCENARIO_ERROR,
  UPDATE_SCENARIO_SUCCESS,
  UPDATE_WEBHOOK_ERROR,
  MISSING_AGENT,
  CHECK_API,
  TRAIN_AGENT,
  UPDATE_SETTINGS,
  UPDATE_SETTINGS_ERROR,
  UPDATE_SETTINGS_SUCCESS,
  LOAD_SETTINGS,
  LOAD_SETTINGS_ERROR,
  LOAD_SETTINGS_SUCCESS,
  CHANGE_SETTINGS_DATA,
  RESET_SETTINGS_DATA,
  REMOVE_SETTINGS_FALLBACK,
} from './constants';

export function loadAgents() {
  return {
    type: LOAD_AGENTS,
    apiCall: true,
  };
}

export function agentsLoaded(data) {
  return {
    type: LOAD_AGENTS_SUCCESS,
    data,
  };
}

export function loadCurrentAgentError(error) {
  return {
    type: LOAD_CURRENT_AGENT_ERROR,
    error,
  };
}

export function loadCurrentAgentSuccess(agent) {
  return {
    type: LOAD_CURRENT_AGENT_SUCCESS,
    agent,
  };
}

export function loadCurrentAgentStatusSuccess(agentStatus) {
  return {
    type: LOAD_CURRENT_AGENT_STATUS_SUCCESS,
    agentStatus,
  };
}


export function loadCurrentAgent(id) {
  return {
    type: LOAD_CURRENT_AGENT,
    apiCall: true,
    id,
  };
}

export function loadCurrentAgentStatus(id) {
  return {
    type: LOAD_CURRENT_AGENT_STATUS,
    apiCall: true,
    id,
  };
}

export function resetCurrentAgent() {
  return {
    type: RESET_CURRENT_AGENT,
  };
}

export function agentsLoadingError(error) {
  return {
    type: LOAD_AGENTS_ERROR,
    error,
  };
}

export function loadAgentDomains(agentId, page, filter) {
  return {
    type: LOAD_AGENT_DOMAINS,
    apiCall: true,
    agentId,
    page,
    filter,
  };
}

export function resetAgentDomains() {
  return {
    type: RESET_AGENT_DOMAINS,
  };
}

export function agentDomainsLoaded(data) {
  return {
    type: LOAD_AGENT_DOMAINS_SUCCESS,
    data,
  };
}

export function agentDomainsLoadingError(error) {
  return {
    type: LOAD_AGENT_DOMAINS_ERROR,
    error,
  };
}

export function loadAgentEntities(agentId, page, filter, forIntentEdit) {
  return {
    type: LOAD_AGENT_ENTITIES,
    apiCall: true,
    agentId,
    page,
    filter,
    forIntentEdit,
  };
}

export function agentEntitiesLoaded(data) {
  return {
    type: LOAD_AGENT_ENTITIES_SUCCESS,
    data,
  };
}

export function agentEntitiesLoadingError(error) {
  return {
    type: LOAD_AGENT_ENTITIES_ERROR,
    error,
  };
}

export function createAgent() {
  return {
    type: CREATE_AGENT,
    apiCall: true,
  };
}

export function agentCreated(agent) {
  return {
    type: CREATE_AGENT_SUCCESS,
    agent,
  };
}

export function agentCreationError(error) {
  return {
    type: CREATE_AGENT_ERROR,
    error,
  };
}

export function createDomain() {
  return {
    type: CREATE_DOMAIN,
    apiCall: true,
  };
}

export function domainCreated(data, id) {
  return {
    type: CREATE_DOMAIN_SUCCESS,
    data,
    id,
  };
}

export function domainCreationError(error) {
  return {
    type: CREATE_DOMAIN_ERROR,
    error,
  };
}

export function createWebhook() {
  return {
    type: CREATE_WEBHOOK,
    apiCall: true,
  };
}

export function webhookCreationError(error) {
  return {
    type: CREATE_WEBHOOK_ERROR,
    error,
  };
}

export function updateWebhookError(error) {
  return {
    type: UPDATE_WEBHOOK_ERROR,
    error,
  };
}

export function createIntent() {
  return {
    type: CREATE_INTENT,
    apiCall: true,
  };
}

export function intentCreated(data, id) {
  return {
    type: CREATE_INTENT_SUCCESS,
    data,
    id,
  };
}

export function intentCreationError(error) {
  return {
    type: CREATE_INTENT_ERROR,
    error,
  };
}

export function scenarioCreated(data, id) {
  return {
    type: CREATE_SCENARIO_SUCCESS,
    data,
    id,
  };
}

export function scenarioCreationError(error) {
  return {
    type: CREATE_SCENARIO_ERROR,
    error,
  };
}

export function createEntity() {
  return {
    type: CREATE_ENTITY,
    apiCall: true,
  };
}

export function entityCreated(data, id) {
  return {
    type: CREATE_ENTITY_SUCCESS,
    data,
    id,
  };
}

export function entityCreationError(error) {
  return {
    type: CREATE_ENTITY_ERROR,
    error,
  };
}

export function converse(payload) {
  return {
    type: CONVERSE,
    apiCall: true,
    payload,
  };
}

export function converseRespond(data) {
  return {
    type: CONVERSE_SUCCESS,
    data,
  };
}

export function converseError() {
  return {
    type: CONVERSE_ERROR,
  };
}

export function missingAgent() {
  return {
    type: MISSING_AGENT,
  };
}

export function resetSession() {
  return {
    type: RESET_SESSION,
    apiCall: true,
  };
}

export function resetSessionSuccess(data) {

  return {
    type: RESET_SESSION_SUCCESS,
    data
  };
}

export function resetSessionError() {
  return {
    type: RESET_SESSION_ERROR,
  };
}

export function loadDomainIntents(domainId, page, filter) {
  return {
    type: LOAD_DOMAINS_INTENTS,
    apiCall: true,
    domainId,
    page,
    filter,
  };
}

export function resetDomainIntents() {
  return {
    type: RESET_DOMAINS_INTENTS,
  };
}

export function domainIntentsLoaded(data) {
  return {
    type: LOAD_DOMAINS_INTENTS_SUCCESS,
    data,
  };
}

export function domainIntentsLoadingError(error) {
  return {
    type: LOAD_DOMAINS_INTENTS_ERROR,
    error,
  };
}

export function actionCancelled(message) {
  return {
    type: ACTION_CANCELLED,
    message,
  };
}

export function deleteDomain(id) {
  return {
    type: DELETE_DOMAIN,
    apiCall: true,
    id,
  };
}

export function deleteDomainSuccess() {
  return {
    type: DELETE_DOMAIN_SUCCESS,
  };
}

export function deleteDomainError(error) {
  return {
    type: DELETE_DOMAIN_ERROR,
    error,
  };
}

export function deleteIntent(intentId, filterId, currentFilter) {
  return {
    type: DELETE_INTENT,
    apiCall: true,
    intentId,
    filterId,
    currentFilter
  };
}

export function deleteIntentSuccess() {
  return {
    type: DELETE_INTENT_SUCCESS,
  };
}

export function deleteIntentError(error) {
  return {
    type: DELETE_INTENT_ERROR,
    error,
  };
}

export function deleteAgent(id) {
  return {
    type: DELETE_AGENT,
    apiCall: true,
    id,
  };
}

export function deleteAgentSuccess() {
  return {
    type: DELETE_AGENT_SUCCESS,
  };
}

export function deleteAgentError(error) {
  return {
    type: DELETE_AGENT_ERROR,
    error,
  };
}

export function deleteEntity(id) {
  return {
    type: DELETE_ENTITY,
    apiCall: true,
    id,
  };
}

export function deleteEntitySuccess() {
  return {
    type: DELETE_ENTITY_SUCCESS,
  };
}

export function deleteEntityError(error) {
  return {
    type: DELETE_ENTITY_ERROR,
    error,
  };
};

export function resetStatusFlags() {
  return {
    type: RESET_STATUS_FLAGS,
  };
}

export function setInWizard(value) {
  return {
    type: SET_IN_WIZARD,
    value,
  };
}

export function updateAgentError(error) {
  return {
    type: UPDATE_AGENT_ERROR,
    error,
  };
}

export function updateAgentSuccess() {
  return {
    type: UPDATE_AGENT_SUCCESS,
  };
}

export function updateAgent() {
  return {
    type: UPDATE_AGENT,
    apiCall: true,
  };
}

export function updateDomainError(error) {
  return {
    type: UPDATE_DOMAIN_ERROR,
    error,
  };
}

export function updateDomainSuccess(domain) {
  return {
    type: UPDATE_DOMAIN_SUCCESS,
    domain,
  };
}

export function updateDomain() {
  return {
    type: UPDATE_DOMAIN,
    apiCall: true,
  };
}

export function updateSettingsError(error) {
  return {
    type: UPDATE_SETTINGS_ERROR,
    error,
  };
}

export function updateSettingsSuccess(settings) {
  return {
    type: UPDATE_SETTINGS_SUCCESS,
    settings,
  };
}

export function updateSettings() {
  return {
    type: UPDATE_SETTINGS,
    apiCall: true,
  };
}

export function updateIntentError(error) {
  return {
    type: UPDATE_INTENT_ERROR,
    error,
  };
}

export function updateIntentSuccess() {
  return {
    type: UPDATE_INTENT_SUCCESS,
  };
}

export function updateIntent() {
  return {
    type: UPDATE_INTENT,
    apiCall: true,
  };
}

export function updateScenarioError(error) {
  return {
    type: UPDATE_SCENARIO_ERROR,
    error,
  };
}

export function updateScenarioSuccess() {
  return {
    type: UPDATE_SCENARIO_SUCCESS,
  };
}

export function updateEntityError(error) {
  return {
    type: UPDATE_ENTITY_ERROR,
    error,
  };
}

export function updateEntitySuccess(entity) {
  return {
    type: UPDATE_ENTITY_SUCCESS,
    entity,
  };
}

export function updateEntity() {
  return {
    type: UPDATE_ENTITY,
    apiCall: true,
  };
}

export function loadAgentIntents(agentId, page, filter) {
  return {
    type: LOAD_AGENT_INTENTS,
    apiCall: true,
    agentId,
    page,
    filter,
  };
}

export function loadAgentIntentsSuccess(data) {
  return {
    type: LOAD_AGENT_INTENTS_SUCCESS,
    data,
  };
}

export function loadAgentIntentsError(error) {
  return {
    type: LOAD_AGENT_INTENTS_ERROR,
    error,
  };
}

export function loadEntityIntents(id) {
  return {
    type: LOAD_ENTITY_INTENTS,
    apiCall: true,
    id,
  };
}

export function loadEntityIntentsSuccess(data) {
  return {
    type: LOAD_ENTITY_INTENTS_SUCCESS,
    data,
  };
}

export function loadEntityIntentsError(error) {
  return {
    type: LOAD_ENTITY_INTENTS_ERROR,
    error,
  };
}

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

export function trainAgent(agentId) {
  return {
    type: TRAIN_AGENT,
    apiCall: true,
    agentId,
  }
}

export function traingAgentError(error){
  return {
    type: TRAIN_AGENT_ERROR,
    error
  }
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

export function loadSettings() {
  return {
    type: LOAD_SETTINGS,
    apiCall: true,
  };
}

export function changeSettingsData(payload) {
  return {
    type: CHANGE_SETTINGS_DATA,
    payload,
  };
}

export function resetSettingsData() {
  return {
    type: RESET_SETTINGS_DATA,
  };
}

export function removeSettingsFallback(index) {
  return {
    type: REMOVE_SETTINGS_FALLBACK,
    index,
  };
}