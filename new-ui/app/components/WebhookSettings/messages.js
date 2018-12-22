/*
 * WebhookSettings Messages
 *
 * This contains all the text for the WebhookSettings component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  webhookVerbSelect: {
    id: 'app.components.WebhookSettings.webhookVerbSelect',
    defaultMessage: 'Webhook Verb:',
  },
  webhookUrl:{
    id: 'app.components.WebhookSettings.webhookUrl',
    defaultMessage: 'URL:',
  },
  webhookUrlPlaceholder:{
    id: 'app.components.WebhookSettings.webhookUrlPlaceholder',
    defaultMessage: 'Example: http://localhost:3000',
  },
  webhookUser:{
    id: 'app.components.WebhookSettings.webhookUser',
    defaultMessage: 'User:',
  },
  webhookUserPlaceholder:{
    id: 'app.components.WebhookSettings.webhookUserPlaceholder',
    defaultMessage: 'username',
  },
  webhookPassword:{
    id: 'app.components.WebhookSettings.webhookPassword',
    defaultMessage: 'Password:',
  },
  webhookPasswordPlaceholder:{
    id: 'app.components.WebhookSettings.webhookPasswordPlaceholder',
    defaultMessage: 'password',
  },
  webhookPayloadType: {
    id: 'app.components.WebhookSettings.webhookPayloadType',
    defaultMessage: 'Body Type:',
  },
  requiredField: {
    id: 'app.components.WebhookSettings.requiredField',
    defaultMessage: '*Required',
  },
  optionalField: {
    id: 'app.components.WebhookSettings.optionalField',
    defaultMessage: 'Optional',
  },
  payloadError: {
    id: 'app.components.WebhookSettings.payloadError',
    defaultMessage: 'Please specify the payload value. It should be a JSON object.',
  },
  basicAuthTitle: {
    id: 'app.components.WebhookSettings.basicAuthTitle',
    defaultMessage: 'Basic Authentication',
  },
  headersTitle: {
    id: 'app.components.WebhookSettings.headersTitle',
    defaultMessage: 'Headers',
  },
  webhookTitle: {
    id: 'app.components.WebhookSettings.webhookTitle',
    defaultMessage: 'Webhook (Required)',
  },
  headerKey: {
    id: 'app.components.WebhookSettings.headerKey',
    defaultMessage: 'Key',
  },
  headerValue: {
    id: 'app.components.WebhookSettings.headerValue',
    defaultMessage: 'Value',
  },
  headerKeyPlaceholder: {
    id: 'app.components.WebhookSettings.headerKey',
    defaultMessage: 'key',
  },
  headerValuePlaceholder: {
    id: 'app.components.WebhookSettings.headerValue',
    defaultMessage: 'value',
  },
  newHeaderKeyPlaceholder: {
    id: 'app.components.WebhookSettings.newHeaderKeyPlaceholder',
    defaultMessage: 'New key',
  },
  bodyTitle: {
    id: 'app.components.WebhookSettings.bodyTitle',
    defaultMessage: 'Body',
  }
});
