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
  expandedTrainingData: {
    id: 'boilerplate.containers.AgentPage.create_agent.expanded_training_data',
    defaultMessage: 'Genereate extra training examples',
  },
  expandedTrainingDataTooltip: {
    id: 'boilerplate.containers.AgentPage.create_agent.expanded_training_data_tooltip',
    defaultMessage: 'On small agents this can improve classification, as your agent grows this may increase training time.',
  }
});
