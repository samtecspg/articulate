import { defineMessages } from 'react-intl';

export default defineMessages({
  globalSettingsTitle: {
    id: 'containers.GlobalSettingsPage.title',
    defaultMessage: 'Global Settings',
  },
  globalSettingsDescription: {
    id: 'containers.GlobalSettingsPage.description',
    defaultMessage: 'This settings help you to configure you environment and some elements of the UI to let you personalize your Articulate instance.',
  },
  rasaURL: {
    id: 'containers.GlobalSettingsPage.rasa_url',
    defaultMessage: 'Rasa URL',
  },
  rasaURLPlaceholder: {
    id: 'containers.GlobalSettingsPage.rasa_url_placeholder',
    defaultMessage: 'Enter the URL of your rasa server',
  },
  ducklingURL: {
    id: 'containers.GlobalSettingsPage.duckling_url',
    defaultMessage: 'Duckling URL',
  },
  ducklingURLPlaceholder: {
    id: 'containers.GlobalSettingsPage.duckling_url_placeholder',
    defaultMessage: 'Enter the URL of your duckling server',
  },
  uiLanguage: {
    id: 'containers.GlobalSettingsPage.ui_language',
    defaultMessage: 'UI Language',
  },
  defaultTimezone: {
    id: 'containers.GlobalSettingsPage.default_timezone',
    defaultMessage: 'Default Agent Timezone',
  },
  timezones: {
    id: 'containers.GlobalSettingsPage.timezones_label',
    defaultMessage: 'Timezones',
  },
  defaultAgentLanguage: {
    id: 'containers.GlobalSettingsPage.default_agent_language',
    defaultMessage: 'Default Agent Language',
  },
  agentLanguages: {
    id: 'containers.GlobalSettingsPage.agent_languages_label',
    defaultMessage: 'Available Agent Languages',
  },
  updateSettingsButton: {
    id: 'containers.GlobalSettingsPage.edit_button',
    defaultMessage: 'Update',
  },
  successMessageEdit: {
    id: 'containers.GlobalSettingsPage.success_message_edit',
    defaultMessage: 'Global settings updated',
  },
  timezonesWarningMessage: {
    id: 'containers.GlobalSettingsPage.timezones_warning_message',
    defaultMessage: 'Please verify timezones is an array of strings properly formatted',
  },
  agentLanguagesWarningMessage: {
    id: 'containers.GlobalSettingsPage.agent_languages_message',
    defaultMessage: 'Please verify languages is an array of objects with text and value',
  },
  errorParsingOptions: {
    id: 'containers.GlobalSettingsPage.error_parsing_options',
    defaultMessage: 'Please verify the options have the right format',
  },
  timezoneNotInTimezonesWarningMessage: {
    id: 'containers.GlobalSettingsPage.timezone_not_in_timezones',
    defaultMessage: 'The default timezone is not part of the list of timezones',
  },
  defaultFallback: {
    id: 'containers.GlobalSettingsPage.default_fallback_label',
    defaultMessage: 'Default Fallback Responses',
  },
  defaultFallbackPlaceholder: {
    id: 'containers.GlobalSettingsPage.default_fallback_input_placeholder',
    defaultMessage: 'example: Sorry I can\'t understand what you are saying',
  },
  timezonesTooltip: {
    id: 'containers.GlobalSettingsPage.default_fallback_input_placeholder',
    defaultMessage: 'Some services like duckling use a timezone value to parse dates and times.',
  },
  agentLanguageTooltip: {
    id: 'containers.GlobalSettingsPage.default_fallback_input_placeholder',
    defaultMessage: 'Depending on the languages supported by the pipeline you are using your agent could use one of multiple languages. This will set the default language for new agents.',
  }
});
