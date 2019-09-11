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
  webhookUrl: {
    id: 'app.components.WebhookSettings.webhookUrl',
    defaultMessage: 'URL:',
  },
  webhookUrlPlaceholder: {
    id: 'app.components.WebhookSettings.webhookUrlPlaceholder',
    defaultMessage: 'Example: http://localhost:3000',
  },
  webhookKey: {
    id: 'app.components.WebhookSettings.webhookKey',
    defaultMessage: 'Key:',
  },
  webhookKeyPlaceholder: {
    id: 'app.components.WebhookSettings.webhookKeyPlaceholder',
    defaultMessage: 'This is the identifier to extract data using handlebars, ie: webhook.<yourKey>.response.value',
  },
  webhookUser: {
    id: 'app.components.WebhookSettings.webhookUser',
    defaultMessage: 'User:',
  },
  webhookUserPlaceholder: {
    id: 'app.components.WebhookSettings.webhookUserPlaceholder',
    defaultMessage: 'username',
  },
  webhookPassword: {
    id: 'app.components.WebhookSettings.webhookPassword',
    defaultMessage: 'Password:',
  },
  webhookPasswordPlaceholder: {
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
    defaultMessage:
      'Please specify the payload value. It should be a JSON object.',
  },
  basicAuthTitle: {
    id: 'app.components.WebhookSettings.basicAuthTitle',
    defaultMessage: 'Basic Authentication',
  },
  headersTitle: {
    id: 'app.components.WebhookSettings.headersTitle',
    defaultMessage: 'Headers',
  },
  title: {
    id: 'app.components.WebhookSettings.title',
    defaultMessage: 'Webhook',
  },
  webhookKeyTitle: {
    id: 'app.components.WebhookSettings.webhookKeyTitle',
    defaultMessage: 'Webhook Key'
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
    id: 'app.components.WebhookSettings.headerKeyPlaceholder',
    defaultMessage: 'key',
  },
  headerValuePlaceholder: {
    id: 'app.components.WebhookSettings.headerValuePlaceholder',
    defaultMessage: 'value',
  },
  newHeaderKeyPlaceholder: {
    id: 'app.components.WebhookSettings.newHeaderKeyPlaceholder',
    defaultMessage: 'Enter the key name and press enter',
  },
  bodyTitle: {
    id: 'app.components.WebhookSettings.bodyTitle',
    defaultMessage: 'Body',
  },
  postScript: {
    id: 'app.components.WebhookSettings.postScript',
    defaultMessage: 'Postscript',
  },
});
