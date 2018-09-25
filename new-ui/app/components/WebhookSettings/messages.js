/*
 * WebhookSettings Messages
 *
 * This contains all the text for the WebhookSettings component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  webhookVerbSelect: {
    id: 'app.components.WebhookSettings.webhookVerbSelect',
    defaultMessage: 'Webhook Verb:'
  },
  webhookUrl:{
    id: 'app.components.WebhookSettings.webhookUrl',
    defaultMessage: 'URL:'
  },
  webhookUrlPlaceholder:{
    id: 'app.components.WebhookSettings.webhookUrlPlaceholder',
    defaultMessage: 'Example: http://localhost:3000'
  },
  webhookPayloadType: {
    id: 'app.components.WebhookSettings.webhookPayloadType',
    defaultMessage: 'Body Type:'
  },
  requiredField: {
    id: 'app.components.WebhookSettings.requiredField',
    defaultMessage: '*Required'
  },
  payloadError: {
    id: 'app.components.WebhookSettings.payloadError',
    defaultMessage: 'Please specify the payload value. It should be a JSON object.'
  },
});
