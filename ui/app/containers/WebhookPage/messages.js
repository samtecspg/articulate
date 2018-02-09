import { defineMessages } from 'react-intl';

export default defineMessages({
  createWebhookTitle: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.title',
    defaultMessage: 'Creating New Webhook',
  },
  createWebhookDescription: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.description',
    defaultMessage: 'A webhook is an HTTP callback that will help you to fulfill your agent. It receives a payload by ' +
    'the NLU platform and generates a response that is going to be passed to the user.',
  },
  agent: {
    id: 'boilerplate.containers.DomainPage.create_domain.agent',
    defaultMessage: 'Agent',
  },
  url: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.url',
    defaultMessage: 'URL',
  },
  urlPlaceholder: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.url_placeholder',
    defaultMessage: 'Enter Webhook URL',
  },
  urlTooltip: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.url_tooltip',
    defaultMessage: 'The public accesable url to your webhook',
  },
  simpleAuthentication: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.simple_authentication',
    defaultMessage: 'Simple Authentication',
  },
  simpleAuthenticationTooltip: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.simple_authentication_tooltip',
    defaultMessage: 'If your webhook security is based in simple authentication please provide the username and password',
  },
  usernamePlaceholder: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.username_placeholder',
    defaultMessage: 'Username',
  },
  passwordPlaceholder: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.password_placeholder',
    defaultMessage: 'Password',
  },
  headers: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.headers',
    defaultMessage: 'Headers',
  },
  headersTooltip: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.headers_tooltip',
    defaultMessage: 'You can specify any header that is going to be send in the HTTP request to your webhook',
  },
  addHeader: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.add_header',
    defaultMessage: '+ add header',
  },
  saveButton: {
    id: 'boilerplate.containers.WebhookPage.create_webhook.save_button',
    defaultMessage: 'Enable Webhook',
  },
  successMessage: {
    id: 'boilerplate.containers.IntentPage.create_agent.success_message',
    defaultMessage: 'Webhook url saved into the agent',
  },
});
