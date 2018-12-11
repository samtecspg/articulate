/*
 * AgentsPage Messages
 *
 * This contains all the text for the AgentsPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.AgentsPage.title',
    defaultMessage: 'Agent',
  },
  subtitle: {
    id: 'app.containers.AgentsPage.subtitle',
    defaultMessage: 'All Agents',
  },
  createAgent: {
    id: 'app.containers.AgentsPage.createAgent',
    defaultMessage: '+ Create Agent',
  },
  searchAgentPlaceholder: {
    id: 'app.containers.AgentsPage.searchAgentPlaceholder',
    defaultMessage: 'Search Agents',
  },
  searchAgentsAlt: {
    id: 'app.containers.AgentsPage.searchAgentsAlt',
    defaultMessage: 'Search Agents',
  },
  delete: {
    id: 'app.containers.AgentsPage.components.AgentsCards.delete',
    defaultMessage: 'Delete',
  },
  deleteMessage: {
    id: 'app.containers.AgentsPage.components.AgentsCards.deleteMessage',
    defaultMessage: 'You are going to permanently delete this agent.',
  },
  deleteQuestion: {
    id: 'app.containers.AgentsPage.components.AgentsCards.deleteMessage',
    defaultMessage: 'Are you sure?',
  },
  no: {
    id: 'app.containers.AgentsPage.components.AgentsCards.no',
    defaultMessage: 'No',
  },
});
