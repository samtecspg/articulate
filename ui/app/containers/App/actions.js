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
  LOAD_AGENT,
  LOAD_AGENT_DOMAINS,
  LOAD_AGENT_DOMAINS_ERROR,
  LOAD_AGENT_DOMAINS_SUCCESS,
  LOAD_AGENT_ENTITIES,
  LOAD_AGENT_ENTITIES_ERROR,
  LOAD_AGENT_ENTITIES_SUCCESS,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  LOAD_AGENTS,
  LOAD_AGENTS_ERROR,
  LOAD_AGENTS_SUCCESS,
  LOAD_CURRENT_AGENT,
  LOAD_CURRENT_AGENT_ERROR,
  LOAD_CURRENT_AGENT_SUCCESS,
  LOAD_DOMAINS_INTENTS,
  LOAD_DOMAINS_INTENTS_ERROR,
  LOAD_DOMAINS_INTENTS_SUCCESS,
  RESET_AGENT_DOMAINS,
  RESET_CURRENT_AGENT,
  RESET_DOMAINS_INTENTS,
  SELECT_CURRENT_AGENT,
  ACTION_CANCELLED,
  RESET_STATUS_FLAGS,
} from './constants';

export function loadAgents() {
  return {
    type: LOAD_AGENTS,
  };
}

export function loadAgent(id) {
  return {
    type: LOAD_AGENT,
    id,
  };
}

export function agentsLoaded(data) {
  return {
    type: LOAD_AGENTS_SUCCESS,
    data,
  };
}

export function agentLoaded(data) {
  return {
    type: LOAD_AGENT_SUCCESS,
    data,
  };
}

export function selectCurrentAgent(agent) {
  return {
    type: SELECT_CURRENT_AGENT,
    agent,
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

export function loadCurrentAgent(id) {
  return {
    type: LOAD_CURRENT_AGENT,
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

export function agentLoadingError(error) {
  return {
    type: LOAD_AGENT_ERROR,
    error,
  };
}

export function loadAgentDomains(agentId) {
  return {
    type: LOAD_AGENT_DOMAINS,
    agentId,
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

export function loadAgentEntities(agentId) {
  return {
    type: LOAD_AGENT_ENTITIES,
    agentId,
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
  };
}

export function agentCreated(agent, id) {
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
  };
}

export function webhookCreated(data, id) {
  return {
    type: CREATE_WEBHOOK_SUCCESS,
    data,
    id,
  };
}

export function webhookCreationError(error) {
  return {
    type: CREATE_WEBHOOK_ERROR,
    error,
  };
}

export function createIntent() {
  return {
    type: CREATE_INTENT,
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

export function loadDomainIntents(domainId) {
  return {
    type: LOAD_DOMAINS_INTENTS,
    domainId,
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
    id,
  };
}

export function deleteDomainSuccess() {
  return {
    type: DELETE_DOMAIN_SUCCESS,
  };
}

export function deleteDomainError() {
  return {
    type: DELETE_DOMAIN_ERROR,
  };
}

export function deleteIntent(intentId, domainId) {
  return {
    type: DELETE_INTENT,
    intentId,
    domainId
  };
}

export function deleteIntentSuccess() {
  return {
    type: DELETE_INTENT_SUCCESS,
  };
}

export function deleteIntentError() {
  return {
    type: DELETE_INTENT_ERROR,
  };
}

export function deleteAgent(id) {
  return {
    type: DELETE_AGENT,
    id,
  };
}

export function deleteAgentSuccess() {
  return {
    type: DELETE_AGENT_SUCCESS,
  };
}

export function deleteAgentError() {
  return {
    type: DELETE_AGENT_ERROR,
  };
}

export function deleteEntity(id) {
  return {
    type: DELETE_ENTITY,
    id,
  };
}

export function deleteEntitySuccess() {
  return {
    type: DELETE_ENTITY_SUCCESS,
  };
}

export function deleteEntityError() {
  return {
    type: DELETE_ENTITY_ERROR,
  }
};

export function resetStatusFlags(){
  return {
    type: RESET_STATUS_FLAGS,
  }
}
