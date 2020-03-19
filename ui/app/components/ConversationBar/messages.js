/*
 * AgentsPage Messages
 *
 * This contains all the text for the AgentsPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  userMessagePlaceholder: {
    id: 'app.components.ConversationBar.userMessagePlaceholder',
    defaultMessage: 'Chat with Agent',
  },
  seeSource: {
    id: 'app.components.ConversationBar.seeSource',
    defaultMessage: 'See Source',
  },
  clearAll: {
    id: 'app.components.ConversationBar.clearAll',
    defaultMessage: 'Clear All',
  },
  sessionTitle: {
    id: 'app.components.ConversationBar.sessionTitle',
    defaultMessage: 'Session',
  },
  noSession: {
    id: 'app.components.ConversationBar.noSession',
    defaultMessage: 'No session selected',
  },
  newSession: {
    id: 'app.components.ConversationBar.newSession',
    defaultMessage: '+ New session',
  },
  erase: {
    id: 'app.components.ConversationBar.erase',
    defaultMessage: 'Clear current session',
  },
  selectSession: {
    id: 'app.components.ConversationBar.selectSession',
    defaultMessage: 'Error: Please select a session to chat.',
  },
  notificationTitle: {
    id: 'app.components.ConversationBar.notificationTitle',
    defaultMessage: 'Notification',
  },
  errorTitle: {
    id: 'app.components.ConversationBar.errorTitle',
    defaultMessage: 'Error',
  },
  agentFinishedTrainingTemplate: {
    id: 'app.components.ConversationBar.agentFinishedTrainingTemplate',
    defaultMessage:
      'The agent <b>{agentName}</b> has finished training. {emoji}',
  },
  agentTrainingErrorTemplate: {
    id: 'app.components.ConversationBar.agentTrainingErrorTemplate',
    defaultMessage: 'An error ocurred training <b>{agentName}</b>. {emoji}`',
  },
  agentIsOutOfDateTemplate: {
    id: 'app.components.ConversationBar.agentIsOutOfDateTemplate',
    defaultMessage: "<b>{agentName}</b> is out of date. It's time to train.",
  },
  positiveNotificationTemplate: {
    id: 'app.components.ConversationBar.agentWasCreatedTemplate',
    defaultMessage:
      '{instanceType} <b>{instanceName}</b> {action} successfully. {emoji}',
  },
  negativeNotificationTemplate: {
    id: 'app.components.ConversationBar.negativeNotificationTemplate',
    defaultMessage: 'There was an error {action} your {instanceType}. {emoji}',
  },
  errorCopyingSayingTemplate: {
    id: 'app.components.ConversationBar.errorCopyingSayingTemplate',
    defaultMessage:
      'There was an error copying the utterance into your sayings. Please add it manually. {emoji}',
  },
  errorMessageTemplate: {
    id: 'app.components.ConversationBar.errorMessageTemplate',
    defaultMessage: '{error}. {emoji}',
  },
  errorCallingArticulate: {
    id: 'app.components.ConversationBar.errorCallingArticulate',
    defaultMessage:
      "I'm sorry. An error occurred calling Articulate's converse service. This is not an issue with your agent. {emoji}",
  },
  errorSelectOrCreateASession: {
    id: 'app.components.ConversationBar.errorSelectOrCreateASession',
    defaultMessage: 'Select or create a session first. {emoji}',
  },
  errorClickOnAgentFirst: {
    id: 'app.components.ConversationBar.errorClickOnAgentFirst',
    defaultMessage: 'Please click on an agent first. {emoji}',
  },
  errorCleaningSessionData: {
    id: 'app.components.ConversationBar.errorCleaningSessionData',
    defaultMessage:
      "I'm sorry. An error occurred cleaning your session data. {emoji}",
  },
  errorSelectSessionToClear: {
    id: 'app.componenets.ConversationBar.errorSelectSessionToClear',
    defaultMessage: 'Select a session to clear. {emoji}',
  },
  agentTestTrainTemplateTitle: {
    id: 'app.components.ConversationBar.agentTestTrainTemplateTitle',
    defaultMessage: '<b>Notification:</b> the agent <b>{agentName}</b> has finished training.',
  },
  agentTestTrainTemplateBody: {
    id: 'app.components.ConversationBar.agentTestTrainTemplateBody',
    defaultMessage: '<b>Next, would you like to test out this training?</b>',
  },
});
