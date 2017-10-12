import {
  CHANGE_WEBHOOK_DATA
} from './constants';

export function changeWebhookData(payload) {
  return {
    type: CHANGE_WEBHOOK_DATA,
    payload,
  };
}
