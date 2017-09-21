import {
    LOAD_AGENTS,
    LOAD_AGENTS_SUCCESS,
    LOAD_AGENTS_ERROR,
    LOAD_DOMAINS,
    LOAD_DOMAINS_SUCCESS,
    LOAD_DOMAINS_ERROR,
    CREATE_AGENT,
    CREATE_AGENT_SUCCESS,
    CREATE_AGENT_ERROR,
    CREATE_DOMAIN,
    CREATE_DOMAIN_SUCCESS,
    CREATE_DOMAIN_ERROR,
    CREATE_INTENT,
    CREATE_INTENT_SUCCESS,
    CREATE_INTENT_ERROR,
    CREATE_ENTITY,
    CREATE_ENTITY_SUCCESS,
    CREATE_ENTITY_ERROR,
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
  
  export function loadDomains() {
    return {
      type: LOAD_DOMAINS,
    };
  }
  
  export function domainsLoaded(data) {
    return {
      type: LOAD_DOMAINS_SUCCESS,
      data,
    };
  }
  
  export function domainsLoadingError(error) {
    return {
      type: LOAD_DOMAINS_ERROR,
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
  