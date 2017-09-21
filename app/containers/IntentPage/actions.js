import {
  CHANGE_INTENT_DATA
} from './constants';

export function changeIntentData(payload) {
  return {
    type: CHANGE_INTENT_DATA,
    payload,
  };
}
