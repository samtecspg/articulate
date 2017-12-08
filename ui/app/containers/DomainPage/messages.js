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
  actionButton: {
    id: 'boilerplate.containers.AgentPage.create_agent.action_button',
    defaultMessage: '+ Create',
  },
});
