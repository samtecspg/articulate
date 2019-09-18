/*
 * AgentPage Messages
 *
 * This contains all the text for the AgentPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.AgentPage.title',
    defaultMessage: 'Agent',
  },
  instanceName: {
    id: 'app.containers.AgentPage.instanceName',
    defaultMessage: 'agent',
  },
  createSubtitle: {
    id: 'app.containers.AgentPage.createSubtitle',
    defaultMessage: 'Create',
  },
  help: {
    id: 'app.containers.AgentPage.help',
    defaultMessage: 'Help?',
  },
  playHelpAlt: {
    id: 'app.containers.AgentPage.playHelpAlt',
    defaultMessage: 'Play video off how to add/edit an Agent',
  },
  main: {
    id: 'app.containers.AgentPage.component.Form.main',
    defaultMessage: 'Main',
  },
  parameters: {
    id: 'app.containers.AgentPage.component.Form.parameters',
    defaultMessage: 'Parameters',
  },
  settings: {
    id: 'app.containers.AgentPage.component.Form.settings',
    defaultMessage: 'Settings',
  },
  agentTextField: {
    id: 'app.containers.AgentPage.component.AgentDataForm.agentTextField',
    defaultMessage: 'Agent Name:',
  },
  agentTextFieldPlaceholder: {
    id:
      'app.containers.AgentPage.component.AgentDataForm.agentTextFieldPlaceholder',
    defaultMessage: 'Your Agent',
  },
  descriptionTextField: {
    id: 'app.containers.AgentPage.component.AgentDataForm.descriptionTextField',
    defaultMessage: 'Describe Agent:',
  },
  descriptionTextFieldPlaceholder: {
    id:
      'app.containers.AgentPage.component.AgentDataForm.descriptionTextFieldPlaceholder',
    defaultMessage: 'What does your Agent do?',
  },
  languageSelect: {
    id: 'app.containers.AgentPage.component.AgentDataForm.languageSelect',
    defaultMessage: 'Language:',
  },
  timezoneSelect: {
    id: 'app.containers.AgentPage.component.AgentDataForm.timezoneSelect',
    defaultMessage: 'Timezone:',
  },
  timezoneSelectPlaceholder: {
    id:
      'app.containers.AgentPage.component.GeneralSettings.timezoneSelectPlaceholder',
    defaultMessage: 'Search for a timezone',
  },
  sliderCategoryRecognitionThresholdLabel: {
    id:
      'app.containers.AgentPage.component.AgentDataForm.sliderCategoryRecognitionThresholdLabel',
    defaultMessage: 'Category Recognition Threshold:',
  },
  sliderActionRecognitionThresholdLabel: {
    id:
      'app.containers.AgentPage.component.AgentDataForm.sliderActionRecognitionThresholdLabel',
    defaultMessage: 'Action Recognition Threshold:',
  },
  fallbackTextField: {
    id: 'app.containers.AgentPage.component.AgentDataForm.fallbackTextField',
    defaultMessage: 'Fallback Action:',
  },
  fallbackTextFieldPlaceholder: {
    id:
      'app.containers.AgentPage.component.AgentDataForm.fallbackTextFieldPlaceholder',
    defaultMessage:
      'What your agent should say if he weren\'t able to recognize what user said?',
  },
  requiredField: {
    id: 'app.containers.AgentPage.component.AgentDataForm.requiredField',
    defaultMessage: '*Required',
  },
  addParameter: {
    id: 'app.containers.AgentPage.component.AgentParametersForm.addParameter',
    defaultMessage: '+ Add',
  },
  finishButton: {
    id: 'app.containers.AgentPage.finishButton',
    defaultMessage: 'Save',
  },
  noFallbacks: {
    id: 'app.containers.AgentPage.component.AgentDataForm.noFallbacks',
    defaultMessage: 'You haven\'t specified any fallback response',
  },
  webhookSetting: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.webhookSetting',
    defaultMessage: 'Webhook',
  },
  responseSetting: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.responseSetting',
    defaultMessage: 'Response',
  },
  responseSettingDescription: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.responseSettingDescription',
    defaultMessage:
      'Whenever you talk with your agent you may want to have additional data in your response beside the text. Here you can enable this settings to add more data to your /converse endpoint.',
  },
  trainingSetting: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.trainingSetting',
    defaultMessage: 'Training',
  },
  trainingSettingDescription: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.trainingSettingDescription',
    defaultMessage:
      'These settings will modify some elements of the training. Therefore, you can enable or disable them to impact the way the models are generated.',
  },
  trainingSettingMissing: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.trainingSettingMissing',
    defaultMessage:
      'You must select either multiple action recognition or separate models for each category.',
  },
  rasaSetting: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.rasaSetting',
    defaultMessage: 'Rasa',
  },
  ducklingSetting: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.ducklingSetting',
    defaultMessage: 'Duckling',
  },
  loggingSetting: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.loggingSetting',
    defaultMessage: 'Logging',
  },
  discoverySetting: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.discoverySetting',
    defaultMessage: 'Discovery Sheet',
  },
  discoveryURL: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.slackLogginURL',
    defaultMessage: 'Discovery Sheet URL',
  },
  slackLoggingURL: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.slackLogginURL',
    defaultMessage: 'Slack Logging URL',
  },
  slackLoggingURLPlaceholder: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.slackLogginURLPlaceholder',
    defaultMessage: 'Incoming webhook url provided by slack',
  },
  extraTrainingData: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.extraTrainingData',
    defaultMessage: 'Generate extra training examples',
  },
  extraTrainingDataHelp: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.extraTrainingDataHelp',
    defaultMessage:
      'If you enable this option your keyword values and synonyms will be used to generate training data examples by substituing highlighted values in your sayings.',
  },
  enableDiscoverySheet: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.enableDiscoverySheet',
    defaultMessage: 'Enable Discovery Sheet',
  },
  openDiscoverySheet: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.openDiscoverySheet',
    defaultMessage: 'Open Discovery Sheet',
  },
  enableModelsPerCategory: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.enableModelsPerCategory',
    defaultMessage: 'Generate separate models for each category',
  },
  webhookSettingDescription: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.webhookSettingDescription',
    defaultMessage:
      'If you would like to define a global webhook that will be called each time the user talks with your agent, then you may do it here. If you define a webhook for an action, then that webhook will override this configuration.',
  },
  multipleIntentRecognition: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.multipleIntentRecognition',
    defaultMessage:
      'Multiple action recognition using Tensorflow pipeline (This will disable models per categories)',
  },
  multiCategory: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.multiCategory',
    defaultMessage:
      'Use categories for the agent (This will disable multiple action recognition)',
  },
  newAction: {
    id: 'app.containers.AgentPage.component.AgentDataForm.newAction',
    defaultMessage: '+ New Action',
  },
  newAgentParameterNameTextField: {
    id:
      'app.containers.AgentPage.component.AgentParametersForm.newAgentParameterNameTextField',
    defaultMessage: 'Parameter Name:',
  },
  newAgentParameterValueTextField: {
    id:
      'app.containers.AgentPage.component.AgentParametersForm.newAgentParameterValueTextField',
    defaultMessage: 'Parameter Value:',
  },
  newAgentParameterNameTextFieldPlaceholder: {
    id:
      'app.containers.AgentPage.component.AgentParametersForm.newAgentParameterNameTextFieldPlaceholder',
    defaultMessage: 'Type your parameter name',
  },
  newAgentParameterValueTextFieldPlaceholder: {
    id:
      'app.containers.AgentPage.component.AgentParametersForm.newAgentParameterValueTextFieldPlaceholder',
    defaultMessage: 'Type your parameter value',
  },
  accessControlSettings: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.accessControlSettings',
    defaultMessage: 'Access Control',
  },
  accessControlLabel: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.accessControlSettings',
    defaultMessage: 'Access Control',
  },
  AutomaticQuickRepliesSetting: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.automaticQuickRepliesSetting',
    defaultMessage: 'Automatic Quick Replies',
  },
  slotsQuickReplies: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.slotsQuickReplies',
    defaultMessage: 'Generate automatic quick replies for slots',
  },
  slotsQuickRepliesHelp: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.extraTrainingDataHelp',
    defaultMessage:
      'If you enable this option, your agent will automatically generate suggestions for missing required slots.',
  },
  slotsQuickRepliesLabel: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.slotsQuickRepliesLabel',
    defaultMessage: 'Max quick replies generated for slots',
  },
  actionsQuickReplies: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.actionsQuickReplies',
    defaultMessage: 'Generate automatic quick replies for actions',
  },
  actionsQuickRepliesHelp: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.extraTrainingDataHelp',
    defaultMessage:
      'If you enable this option, your agent will automatically generate suggestions after sending the response for an action using current context',
  },
  actionsQuickRepliesLabel: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.actionsQuickRepliesLabel',
    defaultMessage: 'Max quick replies generated for actions',
  },
  automaticQuickRepliesSettingsDescription: {
    id:
      'app.containers.AgentPage.component.AgentSettingsForm.automaticQuickRepliesSettingsDescription',
    defaultMessage:
      'Enabling this options will generate quick replies for missing slots and actions according to keywords possible values and the context of the conversation',
  },
});
