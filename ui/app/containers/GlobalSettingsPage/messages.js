import { defineMessages } from 'react-intl';

export default defineMessages({
  globalSettingsTitle: {
    id: 'boilerplate.containers.GlobalSettingsPage.title',
    defaultMessage: 'Global Settings',
  },
  globalSettingsDescription: {
    id: 'boilerplate.containers.GlobalSettingsPage.description',
    defaultMessage: 'This settings help you to configure you environment and some elements of the UI to let you personalize your Articulate instance.',
  },
  rasaURL: {
    id: 'boilerplate.containers.GlobalSettingsPage.rasa_url',
    defaultMessage: 'Rasa URL',
  },
  rasaURLPlaceholder: {
    id: 'boilerplate.containers.GlobalSettingsPage.rasa_url_placeholder',
    defaultMessage: 'Enter the URL of your rasa server',
  },
  ducklingURL: {
    id: 'boilerplate.containers.GlobalSettingsPage.duckling_url',
    defaultMessage: 'Duckling URL',
  },
  ducklingURLPlaceholder: {
    id: 'boilerplate.containers.GlobalSettingsPage.duckling_url_placeholder',
    defaultMessage: 'Enter the URL of your duckling server',
  },
  uiLanguage: {
    id: 'boilerplate.containers.GlobalSettingsPage.ui_language',
    defaultMessage: 'UI Language',
  },
  defaultTimezone: {
    id: 'boilerplate.containers.GlobalSettingsPage.default_timezone',
    defaultMessage: 'Default Agent Timezone',
  },
  timezones: {
    id: 'boilerplate.containers.GlobalSettingsPage.timezones_label',
    defaultMessage: 'Timezones',
  },
  defaultAgentLanguage: {
    id: 'boilerplate.containers.GlobalSettingsPage.default_agent_language',
    defaultMessage: 'Default Agent Language',
  },
  agentLanguages: {
    id: 'boilerplate.containers.GlobalSettingsPage.agent_languages_label',
    defaultMessage: 'Available Agent Languages',
  },
  updateSettingsButton: {
    id: 'boilerplate.containers.GlobalSettingsPage.edit_button',
    defaultMessage: 'Update',
  },
  successMessageEdit: {
    id: 'boilerplate.containers.GlobalSettingsPage.success_message_edit',
    defaultMessage: 'Global settings updated',
  },
  timezonesWarningMessage: {
    id: 'boilerplate.containers.GlobalSettingsPage.timezones_warning_message',
    defaultMessage: 'Please verify timezones is an array of strings properly formatted',
  },
  agentLanguagesWarningMessage: {
    id: 'boilerplate.containers.GlobalSettingsPage.agent_languages_message',
    defaultMessage: 'Please verify languages is an array of objects with text and value',
  },
  errorParsingOptions: {
    id: 'boilerplate.containers.GlobalSettingsPage.error_parsing_options',
    defaultMessage: 'Please verify the options have the right format',
  },
  timezoneNotInTimezonesWarningMessage: {
    id: 'boilerplate.containers.GlobalSettingsPage.timezone_not_in_timezones',
    defaultMessage: 'The default timezone is not part of the list of timezones',
  },
  defaultFallback: {
    id: 'boilerplate.containers.GlobalSettingsPage.default_fallback_label',
    defaultMessage: 'Default Fallback Responses',
  },
  defaultFallbackPlaceholder: {
    id: 'boilerplate.containers.GlobalSettingsPage.default_fallback_input_placeholder',
    defaultMessage: 'example: Sorry I can\'t understand what you are saying',
  },
});
