import { defineMessages } from 'react-intl';

export default defineMessages({
  createDomainTitle: {
    id: 'containers.DomainPage.create_domain.title',
    defaultMessage: 'Creating New Domain',
  },
  createDomainDescription: {
    id: 'containers.DomainPage.create_domain.description',
    defaultMessage: 'A domain is a unit the forms part of an agent. With a Domain you can represent a set of expressions that ' +
    'belongs to an specific context in your agent. Good examples of domains are: Sales, Order Tracking, Customer Service.',
  },
  editDomainTitle: {
    id: 'containers.DomainPage.edit_domain.title',
    defaultMessage: 'Edit Domain',
  },
  editDomainDescription: {
    id: 'containers.DomainPage.edit_domain.description',
    defaultMessage: 'A domain is a unit the forms part of an agent. With a Domain you can represent a set of expressions that ' +
    'belongs to an specific context in your agent. Good examples of domains are: Sales, Order Tracking, Customer Service.',
  },
  agent: {
    id: 'containers.DomainPage.create_domain.agent',
    defaultMessage: 'Agent',
  },
  domainName: {
    id: 'containers.DomainPage.create_domain.domain_name',
    defaultMessage: 'Domain Name',
  },
  domainNamePlaceholder: {
    id: 'containers.DomainPage.create_domain.domain_name_placeholder',
    defaultMessage: 'Type a name here',
  },
  intentThreshold: {
    id: 'containers.DomainPage.create_domain.intent_threshold',
    defaultMessage: 'Intent Recognition Threshold',
  },
  intentThresholdDescription: {
    id: 'containers.DomainPage.create_domain.intent_threshold_description',
    defaultMessage: 'This threshold determines how confident your agent has to be that a user\'s request matches an intent inside the domain. Higher values are likely to fallback. Lower values are more likely to mis-classify.'
  },
  createButton: {
    id: 'containers.DomainPage.create_domain.create_button',
    defaultMessage: '+ Create',
  },
  editButton: {
    id: 'containers.DomainPage.create_domain.edit_button',
    defaultMessage: '+ Update',
  },
  successMessage: {
    id: 'containers.DomainPage.create_domain.success_message',
    defaultMessage: 'Domain created',
  },
  successMessageEdit: {
    id: 'containers.DomainPage.create_agent.success_message_edit',
    defaultMessage: 'Domain updated',
  },
  expandedTrainingData: {
    id: 'containers.DomainPage.create_agent.expanded_training_data',
    defaultMessage: 'Generate extra training examples',
  },
  expandedTrainingDataTooltip: {
    id: 'containers.DomainPage.create_agent.expanded_training_data_tooltip',
    defaultMessage: 'Create combinations between your entities and intents. On small agents this can improve classification, as your agent grows this may increase training time.',
  }
});
