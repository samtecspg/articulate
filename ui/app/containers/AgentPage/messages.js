/*
 * AgentPage Messages
 *
 * This contains all the text for the AgentPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  createAgentTitle: {
    id: 'boilerplate.containers.AgentPage.create_agent.title',
    defaultMessage: 'Creating New Agent',
  },
  createDescription: {
    id: 'boilerplate.containers.AgentPage.create_agent.description',
    defaultMessage: 'An agent is capable of understand natural language and transform it into recognizable actions. ' +
    'You can insert agents in you environment to improve the user experience with your app.',
  },
  agentName: {
    id: 'boilerplate.containers.AgentPage.create_agent.agent_name',
    defaultMessage: 'Agent Name',
  },
  agentNamePlaceholder: {
    id: 'boilerplate.containers.AgentPage.create_agent.agent_name_placeholder',
    defaultMessage: 'Type a name here',
  },
  description: {
    id: 'boilerplate.containers.AgentPage.create_agent.agent_description',
    defaultMessage: 'Describe Agent',
  },
  descriptionPlaceholder: {
    id: 'boilerplate.containers.AgentPage.create_agent.agent_description_placeholder',
    defaultMessage: 'What does this Agent do?',
  },
  sampleData: {
    id: 'boilerplate.containers.AgentPage.create_agent.sample_data',
    defaultMessage: '+ Sample Data',
  },
  sampleDataPlaceholder: {
    id: 'boilerplate.containers.AgentPage.create_agent.sample_data_placeholder',
    defaultMessage: 'Add a prebuilt agent that will respond to User intents',
  },
  language: {
    id: 'boilerplate.containers.AgentPage.create_agent.language',
    defaultMessage: 'Language',
  },
  languageWarning: {
    id: 'boilerplate.containers.AgentPage.create_agent.language_warning',
    defaultMessage: 'Cannot be changed once Agent is created',
  },
  timezone: {
    id: 'boilerplate.containers.AgentPage.create_agent.default_timezone',
    defaultMessage: 'Default Time Zone',
  },
  domainClassifierThreshold: {
    id: 'boilerplate.containers.AgentPage.create_agent.domain_classifier_threshold',
    defaultMessage: 'Domain Recognition Threshold',
  },
  domainClassifierThresholdDescription: {
    id: 'boilerplate.containers.AgentPage.create_agent.domain_classifier_threshold_description',
    defaultMessage: 'This threshold determines how confident your agent has to be that a user\'s request matches a domain inside the agent. Requests not meeting the threshold will use the fallback responses below.'
  },
  importAgent: {
    id: 'boilerplate.containers.AgentPage.create_agent.import_agent',
    defaultMessage: 'Import agent from backup',
  },
  createButton: {
    id: 'boilerplate.containers.AgentPage.create_agent.create_button',
    defaultMessage: '+ Create',
  },
  editButton: {
    id: 'boilerplate.containers.AgentPage.create_agent.edit_button',
    defaultMessage: '+ Update',
  },
  successMessage: {
    id: 'boilerplate.containers.AgentPage.create_agent.success_message',
    defaultMessage: 'Agent created',
  },
  successMessageEdit: {
    id: 'boilerplate.containers.AgentPage.create_agent.success_message_edit',
    defaultMessage: 'Agent updated',
  },
  fallbackInput: {
    id: 'boilerplate.containers.AgentPage.create_agent.success_message',
    defaultMessage: 'example: Sorry I can\'t understand what you are saying',
  },
  agentFallbackTitle: {
    id: 'boilerplate.containers.AgentPage.create_agent.success_message',
    defaultMessage: 'Fallback Responses',
  },
  webhook: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook',
    defaultMessage: 'Webhook Definition',
  },
  webhookDescription: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_description',
    defaultMessage: 'A webhook will help you to process the parsed text by the agent in order to complete you business logic.',
  },
  webhookVerb: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_verb',
    defaultMessage: 'Method',
  },
  webhookUrl: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_url',
    defaultMessage: 'URL',
  },
  webhookUrlPlaceholder: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_url_placeholder',
    defaultMessage: 'http://localhost:3000',
  },
  webhookPayloadType: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_payload_type',
    defaultMessage: 'Body Type',
  },
  webhookPayload: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_payload',
    defaultMessage: 'Body',
  },
  missingWebhookUrl: {
    id: 'boilerplate.containers.AgentPage.create_agent.missing_webhook_url',
    defaultMessage: 'Please add a webhook url for your webhook',
  },
  invalidTimezone: {
    id: 'boilerplate.containers.AgentPage.create_agent.invalid_timezone',
    defaultMessage: 'The specified timezone is not valid',
  },
  useWebhook: {
    id: 'boilerplate.containers.AgentPage.create_agent.use_webhook',
    defaultMessage: 'Webhook',
  },
  expandedTrainingData: {
    id: 'boilerplate.containers.AgentPage.create_agent.expanded_training_data',
    defaultMessage: 'Generate extra training examples',
  },
  expandedTrainingDataTooltip: {
    id: 'boilerplate.containers.AgentPage.create_agent.expanded_training_data_tooltip',
    defaultMessage: 'Create combinations between your entities and intents. On small agents this can improve classification, as your agent grows this may increase training time.',
  }
});