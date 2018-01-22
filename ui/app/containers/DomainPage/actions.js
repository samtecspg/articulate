import {
  CHANGE_DOMAIN_DATA,
  LOAD_DOMAIN,
  LOAD_DOMAIN_ERROR,
  LOAD_DOMAIN_SUCCESS,
  RESET_DOMAIN_DATA
} from './constants';

export function changeDomainData(payload) {
  return {
    type: CHANGE_DOMAIN_DATA,
    payload,
  };
}

export function resetDomainData() {
  return {
    type: RESET_DOMAIN_DATA,
  };
}

export function loadDomainError(error) {
  return {
    type: LOAD_DOMAIN_ERROR,
    error,
  };
}

export function loadDomainSuccess(domain) {
  return {
    type: LOAD_DOMAIN_SUCCESS,
    domain,
  };
}

export function loadDomain(id) {
  return {
    type: LOAD_DOMAIN,
    apiCall: true,
    id,
  };
}
