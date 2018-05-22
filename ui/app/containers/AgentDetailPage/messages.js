/*
 * AgentPage Messages
 *
 * This contains all the text for the AgentPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  detailTitle: {
    id: 'boilerplate.containers.AgentPage.create_agent.title',
    defaultMessage: 'Detail of Agent: ',
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
  webhookUrl: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_url',
    defaultMessage: 'Webhook Url'
  },
  domainClassifierThreshold: {
    id: 'boilerplate.containers.AgentPage.create_agent.domain_classifier_threshold',
    defaultMessage: 'Domain Recognition Threshold',
  },
  importAgent: {
    id: 'boilerplate.containers.AgentPage.create_agent.import_agent',
    defaultMessage: 'Import agent from backup',
  },
  actionButton: {
    id: 'boilerplate.containers.AgentPage.create_agent.action_button',
    defaultMessage: '+ Create',
  },
  deleteButton: {
    id: 'boilerplate.containers.AgentPage.create_agent.delete_button',
    defaultMessage: 'Delete',
  },
  editButton: {
    id: 'boilerplate.containers.AgentPage.create_agent.delete_button',
    defaultMessage: 'Edit',
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
  expandedTrainingData: {
    id: 'boilerplate.containers.AgentPage.create_agent.expanded_training_data',
    defaultMessage: 'Generate extra training examples',
  },
});
