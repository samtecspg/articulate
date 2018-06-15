import { defineMessages } from 'react-intl';

export default defineMessages({
  rasaSettingsTitle: {
    id: 'containers.RasaSettingsPage.title',
    defaultMessage: 'Rasa Settings',
  },
  rasaSettingsDescription: {
    id: 'containers.RasaSettingsPage.description',
    defaultMessage: 'These are the default settings for Rasa. Whenever you create a new Agent these settings are going to be the initial settings for it.',
  },
  rasaURL: {
    id: 'containers.RasaSettingsPage.rasa_url',
    defaultMessage: 'Rasa URL',
  },
  rasaURLPlaceholder: {
    id: 'containers.RasaSettingsPage.rasa_url_placeholder',
    defaultMessage: 'Enter the URL of your rasa server',
  },
  domainClassifierPipeline: {
    id: 'containers.RasaSettingsPage.domain_classifier_pipeline_label',
    defaultMessage: 'Domain Classifier Pipeline',
  },
  intentClassifierPipeline: {
    id: 'containers.RasaSettingsPage.intent_classifier_pipeline_label',
    defaultMessage: 'Intent Classifier Pipeline',
  },
  entityClassifierPipeline: {
    id: 'containers.RasaSettingsPage.entity_classifier_pipeline_label',
    defaultMessage: 'Entity Classifier Pipeline',
  },
  spacyEntities: {
    id: 'containers.RasaSettingsPage.spacy_entities_label',
    defaultMessage: 'Spacy Entities',
  },
  updateSettingsButton: {
    id: 'containers.RasaSettingsPage.edit_button',
    defaultMessage: 'Update',
  },
  successMessageEdit: {
    id: 'containers.RasaSettingsPage.success_message_edit',
    defaultMessage: 'Rasa settings updated',
  },
  errorParsingOptions: {
    id: 'containers.RasaSettingsPage.error_parsing_options',
    defaultMessage: 'Please verify the options have the right format',
  },
  domainClassifierPipelineTooltip: {
    id: 'containers.RasaSettingsPage.domain_classifier_tooltip',
    defaultMessage: 'An agent could have multiple domains. To identify the domain of a given user text we use a domain classifier.',
  },
  intentClassifierPipelineTooltip: {
    id: 'containers.RasaSettingsPage.intent_classifier_tooltip',
    defaultMessage: 'This pipeline will be the one in charge of generate the model that would classify intents and entities when more than one intent is specified in a domain.',
  },
  entityClassifierPipelineTooltip: {
    id: 'containers.RasaSettingsPage.entity_classifier_tooltip',
    defaultMessage: 'When the number of intents in the domain is just one, this pipeline is used to train a model that would only work for recognize entities',
  },
  spacyEntitiesTooltip: {
    id: 'containers.RasaSettingsPage.spacy_entities_tooltip',
    defaultMessage: 'Spacy have a series of entities that are recognized by it\'s trained models. With this setting, you are going to select the entities that you want to use from spacy as system entities.',
  },
  entityClassifierPipelineWarningMessage: {
    id: 'containers.RasaSettingsPage.entity_classifier_format_warning',
    defaultMessage: 'Please verify entity classifier pipeline is an array of objects with a name attribute',
  },
  intentClassifierPipelineWarningMessage: {
    id: 'containers.RasaSettingsPage.intent_classifier_format_warning',
    defaultMessage: 'Please verify intent classifier pipeline is an array of objects with a name attribute',
  },
  domainClassifierPipelineWarningMessage: {
    id: 'containers.RasaSettingsPage.domain_classifier_format_warning',
    defaultMessage: 'Please verify domain classifier pipeline is an array of objects with a name attribute',
  },
  spacyEntitiesWarningMessage: {
    id: 'containers.RasaSettingsPage.timezone_not_in_timezones',
    defaultMessage: 'Please verify spacy entities is an array of strings',
  },
});