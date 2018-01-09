import { CHANGE_WEBHOOK_DATA, RESET_WEBHOOK_DATA, } from './constants';

export function changeWebhookData(payload) {
  return {
    type: CHANGE_WEBHOOK_DATA,
    payload,
  };
}

export function resetWebhookData(payload) {
  return {
    type: RESET_WEBHOOK_DATA,
  };
}
