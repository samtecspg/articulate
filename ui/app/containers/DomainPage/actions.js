import { CHANGE_DOMAIN_DATA, RESET_DOMAIN_DATA, } from './constants';

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
