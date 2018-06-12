import { defineMessages } from 'react-intl';

export default defineMessages({
  rasaSettingsTitle: {
    id: 'boilerplate.containers.RasaSettingsPage.title',
    defaultMessage: 'Rasa Settings',
  },
  rasaSettingsDescription: {
    id: 'boilerplate.containers.RasaSettingsPage.description',
    defaultMessage: 'This settings help you to configure you environment and some elements of the UI to let you personalize your Articulate instance.',
  },
  rasaURL: {
    id: 'boilerplate.containers.RasaSettingsPage.rasa_url',
    defaultMessage: 'Rasa URL',
  },
  rasaURLPlaceholder: {
    id: 'boilerplate.containers.RasaSettingsPage.rasa_url_placeholder',
    defaultMessage: 'Enter the URL of your rasa server',
  },
  domainClassifierPipeline: {
    id: 'boilerplate.containers.RasaSettingsPage.domain_classifier_pipeline_label',
    defaultMessage: 'Domain Classifier Pipeline',
  },
  intentClassifierPipeline: {
    id: 'boilerplate.containers.RasaSettingsPage.intent_classifier_pipeline_label',
    defaultMessage: 'Intent Classifier Pipeline',
  },
  entityClassifierPipeline: {
    id: 'boilerplate.containers.RasaSettingsPage.entity_classifier_pipeline_label',
    defaultMessage: 'Entity Classifier Pipeline',
  },
  updateSettingsButton: {
    id: 'boilerplate.containers.RasaSettingsPage.edit_button',
    defaultMessage: 'Update',
  },
  successMessageEdit: {
    id: 'boilerplate.containers.RasaSettingsPage.success_message_edit',
    defaultMessage: 'Rasa settings updated',
  },
  timezonesWarningMessage: {
    id: 'boilerplate.containers.RasaSettingsPage.timezones_warning_message',
    defaultMessage: 'Please verify timezones is an array of strings properly formatted',
  },
  errorParsingOptions: {
    id: 'boilerplate.containers.RasaSettingsPage.error_parsing_options',
    defaultMessage: 'Please verify the options have the right format',
  },
  defaultFallback: {
    id: 'boilerplate.containers.RasaSettingsPage.default_fallback_label',
    defaultMessage: 'Default Fallback Responses',
  },
  defaultFallbackPlaceholder: {
    id: 'boilerplate.containers.RasaSettingsPage.default_fallback_input_placeholder',
    defaultMessage: 'example: Sorry I can\'t understand what you are saying',
  },
  domainClassifierPipelineTooltip: {
    id: 'boilerplate.containers.RasaSettingsPage.domain_classifier_tooltip',
    defaultMessage: 'An agent could have multiple domains. To identify the domain of a given user text we use a domain classifier.',
  },
  intentClassifierPipelineTooltip: {
    id: 'boilerplate.containers.RasaSettingsPage.intent_classifier_tooltip',
    defaultMessage: 'This pipeline will be the one in charge of generate the model that would classify intents and entities when more than one intent is specified in a domain.',
  },
  entityClassifierPipelineTooltip: {
    id: 'boilerplate.containers.RasaSettingsPage.entity_classifier_tooltip',
    defaultMessage: 'When the number of intents in the domain is just one, this pipeline is used to train a model that would only work for recognize entities',
  },
  entityClassifierPipelineWarningMessage: {
    id: 'boilerplate.containers.RasaSettingsPage.agent_languages_message',
    defaultMessage: 'Please verify entity classifier pipeline is an array of objects with a name attribute',
  },
  intentClassifierPipelineWarningMessage: {
    id: 'boilerplate.containers.RasaSettingsPage.timezone_not_in_timezones',
    defaultMessage: 'Please verify intent classifier pipeline is an array of objects with a name attribute',
  },
  domainClassifierPipelineWarningMessage: {
    id: 'boilerplate.containers.RasaSettingsPage.timezone_not_in_timezones',
    defaultMessage: 'Please verify domain classifier pipeline is an array of objects with a name attribute',
  },
});