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
  playHelpAlt : {
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
    id: 'app.containers.AgentPage.component.AgentDataForm.agentTextFieldPlaceholder',
    defaultMessage: 'Your Agent',
  },
  descriptionTextField: {
    id: 'app.containers.AgentPage.component.AgentDataForm.descriptionTextField',
    defaultMessage: 'Describe Agent:',
  },
  descriptionTextFieldPlaceholder: {
    id: 'app.containers.AgentPage.component.AgentDataForm.descriptionTextFieldPlaceholder',
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
    id: 'app.containers.AgentPage.component.GeneralSettings.timezoneSelectPlaceholder',
    defaultMessage: 'Search for a timezone',
  },
  sliderCategoryRecognitionThresholdLabel: {
    id: 'app.containers.AgentPage.component.AgentDataForm.sliderCategoryRecognitionThresholdLabel',
    defaultMessage: 'Category Recognition Threshold:',
  },
  sliderActionRecognitionThresholdLabel: {
    id: 'app.containers.AgentPage.component.AgentDataForm.sliderActionRecognitionThresholdLabel',
    defaultMessage: 'Action Recognition Threshold:',
  },
  fallbackTextField: {
    id: 'app.containers.AgentPage.component.AgentDataForm.fallbackTextField',
    defaultMessage: 'Fallback Action:',
  },
  fallbackTextFieldPlaceholder: {
    id: 'app.containers.AgentPage.component.AgentDataForm.fallbackTextFieldPlaceholder',
    defaultMessage: 'What your agent should say if he weren\'t able to recognize what user said?',
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
    id: 'app.containers.AgentPage.component.AgentSettingsForm.responseSettingDescription',
    defaultMessage: 'Whenever you talk with your agent you may want to have additional data in your response beside the text. Here you can enable this settings to add more data to your /converse endpoint.',
  },
  trainingSetting: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.trainingSetting',
    defaultMessage: 'Training',
  },
  trainingSettingDescription: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.trainingSettingDescription',
    defaultMessage: 'These settings will modify some elements of the training. Therefore, you can enable or disable them to impact the way the models are generated.',
  },
  rasaSetting: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.rasaSetting',
    defaultMessage: 'Rasa',
  },
  ducklingSetting: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.ducklingSetting',
    defaultMessage: 'Duckling',
  },
  extraTrainingData: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.extraTrainingData',
    defaultMessage: 'Generate extra training examples',
  },
  enableModelsPerCategory: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.enableModelsPerCategory',
    defaultMessage: 'Generate separate models for each category',
  },
  webhookSettingDescription: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.webhookSettingDescription',
    defaultMessage: 'If you would like to define a global webhook that will be called each time the user talks with your agent, then you may do it here. If you define a webhook for an action, then that webhook will override this configuration.',
  },
  multipleIntentRecognition: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.multipleIntentRecognition',
    defaultMessage: 'Multiple action recognition using Tensorflow pipeline (This will disable models per categories)',
  },
  multiCategory: {
    id: 'app.containers.AgentPage.component.AgentSettingsForm.multiCategory',
    defaultMessage: 'Use categories for the agent (This will disable multiple action recognition)',
  },
  newAction: {
    id: 'app.containers.AgentPage.component.AgentDataForm.newAction',
    defaultMessage: '+ New Action',
  },
  newAgentParameterNameTextField: {
    id: 'app.containers.AgentPage.component.AgentParametersForm.newAgentParameterNameTextField',
    defaultMessage: 'Parameter Name:',
  },
  newAgentParameterValueTextField: {
    id: 'app.containers.AgentPage.component.AgentParametersForm.newAgentParameterValueTextField',
    defaultMessage: 'Parameter Value:',
  },
  newAgentParameterNameTextFieldPlaceholder: {
    id: 'app.containers.AgentPage.component.AgentParametersForm.newAgentParameterNameTextFieldPlaceholder',
    defaultMessage: 'Type your parameter name',
  },
  newAgentParameterValueTextFieldPlaceholder: {
    id: 'app.containers.AgentPage.component.AgentParametersForm.newAgentParameterValueTextFieldPlaceholder',
    defaultMessage: 'Type your parameter value',
  },
});