import {
    LOAD_AGENTS,
    LOAD_AGENTS_SUCCESS,
    LOAD_AGENTS_ERROR,
    LOAD_AGENT_DOMAINS,
    LOAD_AGENT_DOMAINS_SUCCESS,
    LOAD_AGENT_DOMAINS_ERROR,
    LOAD_AGENT_ENTITIES,
    LOAD_AGENT_ENTITIES_SUCCESS,
    LOAD_AGENT_ENTITIES_ERROR,
    CREATE_AGENT,
    CREATE_AGENT_SUCCESS,
    CREATE_AGENT_ERROR,
    CREATE_DOMAIN,
    CREATE_DOMAIN_SUCCESS,
    CREATE_DOMAIN_ERROR,
    CREATE_INTENT,
    CREATE_INTENT_SUCCESS,
    CREATE_INTENT_ERROR,
    CREATE_SCENARIO_SUCCESS,
    CREATE_SCENARIO_ERROR,
    CREATE_ENTITY,
    CREATE_ENTITY_SUCCESS,
    CREATE_ENTITY_ERROR,
    CONVERSE,
    CONVERSE_SUCCESS,
    CONVERSE_ERROR,
  } from './constants';
  
  export function loadAgents() {
    return {
      type: LOAD_AGENTS,
    };
  }
  
  export function agentsLoaded(data) {
    return {
      type: LOAD_AGENTS_SUCCESS,
      data,
    };
  }
  
  export function agentsLoadingError(error) {
    return {
      type: LOAD_AGENTS_ERROR,
      error,
    };
  }
  
  export function loadAgentDomains(agentId) {
    return {
      type: LOAD_AGENT_DOMAINS,
      agentId
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
      agentId
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
  
  export function agentCreated(data, _id) {
    return {
      type: CREATE_AGENT_SUCCESS,
      data,
      _id,
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
  
  export function domainCreated(data, _id) {
    return {
      type: CREATE_DOMAIN_SUCCESS,
      data,
      _id,
    };
  }
  
  export function domainCreationError(error) {
    return {
      type: CREATE_DOMAIN_ERROR,
      error,
    };
  }
  
  export function createIntent() {
    return {
      type: CREATE_INTENT,
    };
  }
  
  export function intentCreated(data, _id) {
    return {
      type: CREATE_INTENT_SUCCESS,
      data,
      _id,
    };
  }
  
  export function intentCreationError(error) {
    return {
      type: CREATE_INTENT_ERROR,
      error,
    };
  }

  export function scenarioCreated(data, _id) {
    return {
      type: CREATE_SCENARIO_SUCCESS,
      data,
      _id,
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
  
  export function entityCreated(data, _id) {
    return {
      type: CREATE_ENTITY_SUCCESS,
      data,
      _id,
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