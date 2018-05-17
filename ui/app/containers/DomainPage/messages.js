import { defineMessages } from 'react-intl';

export default defineMessages({
  createDomainTitle: {
    id: 'boilerplate.containers.DomainPage.create_domain.title',
    defaultMessage: 'Creating New Domain',
  },
  createDomainDescription: {
    id: 'boilerplate.containers.DomainPage.create_domain.description',
    defaultMessage: 'A domain is a unit the forms part of an agent. With a Domain you can represent a set of expressions that ' +
    'belongs to an specific context in your agent. Good examples of domains are: Sales, Order Tracking, Customer Service.',
  },
  editDomainTitle: {
    id: 'boilerplate.containers.DomainPage.edit_domain.title',
    defaultMessage: 'Edit Domain',
  },
  editDomainDescription: {
    id: 'boilerplate.containers.DomainPage.edit_domain.description',
    defaultMessage: 'A domain is a unit the forms part of an agent. With a Domain you can represent a set of expressions that ' +
    'belongs to an specific context in your agent. Good examples of domains are: Sales, Order Tracking, Customer Service.',
  },
  agent: {
    id: 'boilerplate.containers.DomainPage.create_domain.agent',
    defaultMessage: 'Agent',
  },
  domainName: {
    id: 'boilerplate.containers.DomainPage.create_domain.domain_name',
    defaultMessage: 'Domain Name',
  },
  domainNamePlaceholder: {
    id: 'boilerplate.containers.DomainPage.create_domain.domain_name_placeholder',
    defaultMessage: 'Type a name here',
  },
  intentThreshold: {
    id: 'boilerplate.containers.DomainPage.create_domain.intent_threshold',
    defaultMessage: 'Intent Recognition Threshold',
  },
  intentThresholdDescription: {
    id: 'boilerplate.containers.DomainPage.create_domain.intent_threshold_description',
    defaultMessage: 'The intent recognition threshold is a value that determines how confident your agent has to be that a user\'s request matches an intent under this domain. The default value is 50. Setting this value higher will make the agent less likely to select an intent. Do so only if you have many examples specified for intents under this domain.'
  },
  createButton: {
    id: 'boilerplate.containers.DomainPage.create_domain.create_button',
    defaultMessage: '+ Create',
  },
  editButton: {
    id: 'boilerplate.containers.DomainPage.create_domain.edit_button',
    defaultMessage: '+ Update',
  },
  successMessage: {
    id: 'boilerplate.containers.DomainPage.create_domain.success_message',
    defaultMessage: 'Domain created',
  },
  successMessageEdit: {
    id: 'boilerplate.containers.AgentPage.create_agent.success_message_edit',
    defaultMessage: 'Domain updated',
  },
});
