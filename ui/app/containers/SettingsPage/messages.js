/*
 * SettingsPage Messages
 *
 * This contains all the text for the SettingsPage component.
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.SettingsPage.title',
    defaultMessage: 'Settings',
  },
  createSubtitle: {
    id: 'app.containers.SettingsPage.createSubtitle',
    defaultMessage: 'System configuration',
  },
  help: {
    id: 'app.containers.SettingsPage.help',
    defaultMessage: 'Help?',
  },
  playHelpAlt : {
    id: 'app.containers.SettingsPage.playHelpAlt',
    defaultMessage: 'Play video off how to add/edit an Agent',
  },
  uiLanguageSelect: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.uiLanguageSelect',
    defaultMessage: 'UI Language:',
  },
  languageSelect: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.languageSelect',
    defaultMessage: 'Default Agent Language:',
  },
  timezoneSelect: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.timezoneSelect',
    defaultMessage: 'Default Agent Timezone:',
  },
  timezoneSelectPlaceholder: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.timezoneSelectPlaceholder',
    defaultMessage: 'Search for a timezone',
  },
  fallbackTextField: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.fallbackTextField',
    defaultMessage: 'Fallback Responses for Default Fallback Action:',
  },
  fallbackTextFieldPlaceholder: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.fallbackTextFieldPlaceholder',
    defaultMessage: 'What your agent should say if he weren\'t able to recognize what user said?',
  },
  fallbackHelperText: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.fallbackHelperText',
    defaultMessage: '*Please add at least one response for the default fallback action',
  },
  requiredField: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.requiredField',
    defaultMessage: '*Required',
  },
  finishButton: {
    id: 'app.containers.SettingsPage.finishButton',
    defaultMessage: 'Save',
  },
  cancelButton: {
    id: 'app.containers.SettingsPage.cancelButton',
    defaultMessage: '< Exit',
  },
  noFallbacks: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.noFallbacks',
    defaultMessage: 'You haven\'t specified any fallback response',
  },
  generalSetting: {
    id: 'app.containers.SettingsPage.component.SettingsDataForm.generalSetting',
    defaultMessage: 'General',
  },
  generalSettingDescription: {
    id: 'app.containers.SettingsPage.component.AgentSettingsForm.generalSettingDescription',
    defaultMessage: 'These are some general settings for define default values in the creation of your agents',
  },
  rasaSetting: {
    id: 'app.containers.SettingsPage.component.SettingsDataForm.rasaSetting',
    defaultMessage: 'Rasa',
  },
  ducklingSetting: {
    id: 'app.containers.SettingsPage.component.SettingsDataForm.ducklingSetting',
    defaultMessage: 'Duckling',
  },
  timezones: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.timezones',
    defaultMessage: 'Timezones:',
  },
  agentLanguages: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.agentLanguages',
    defaultMessage: 'Agent Languages:',
  },
  uiLanguages: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.uiLanguages',
    defaultMessage: 'UI Languages:',
  },
  timezonesError: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.timezonesError',
    defaultMessage: 'Please verify this value. It should be an array of strings. Example: ["Africa/Abidjan", "Africa/Accra"].',
  },
  agentLanguagesError: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.agentLanguagesError',
    defaultMessage: 'Please verify this value. It should be an array of JSON objects. Example: [{"text": "English","value": "en"}].',
  },
  uiLanguagesError: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.uiLanguagesError',
    defaultMessage: 'Please verify this value. It should be an array of JSON objects. Example: [{"text": "English","value": "en"}].',
  },
  defaultaFallbackActionName: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.defaultaFallbackActionName',
    defaultMessage: 'Default Fallback Action Name:',
  },
  defaultaFallbackActionNamePlaceholder: {
    id: 'app.containers.SettingsPage.component.GeneralSettings.defaultaFallbackActionNamePlaceholder',
    defaultMessage: 'Enter the name for the default fallback action that will be created for new agents',
  }
});
