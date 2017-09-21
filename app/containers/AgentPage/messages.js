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
  createAgentDescription: {
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
  agentDescription: {
    id: 'boilerplate.containers.AgentPage.create_agent.agent_description',
    defaultMessage: 'Describe Agent',
  },
  agentDescriptionPlaceholder: {
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
  defaultTimezone: {
    id: 'boilerplate.containers.AgentPage.create_agent.default_timezone',
    defaultMessage: 'Default Time Zone',
  },
  domainClassifierThreshold: {
    id: 'boilerplate.containers.AgentPage.create_agent.domain_classifier_threshold',
    defaultMessage: 'Domain Recognition Threshold',
  },
  importAgent: {
    id: 'boilerplate.containers.AgentPage.create_agent.import_agent',
    defaultMessage: 'Import agent from backup',
  },
});
