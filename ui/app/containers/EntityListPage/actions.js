import { CHANGE_CURRENT_AGENT } from './constants';

export function changeDomainData(payload) {
  return {
    type: CHANGE_CURRENT_AGENT,
    payload,
  };
}
