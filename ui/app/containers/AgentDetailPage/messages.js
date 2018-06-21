import { defineMessages } from 'react-intl';

export default defineMessages({
  detailTitle: {
    id: 'containers.AgentDetailPage.create_agent.title',
    defaultMessage: 'Detail of Agent: ',
  },
  createDescription: {
    id: 'containers.AgentDetailPage.create_agent.description',
    defaultMessage: 'An agent is capable of understand natural language and transform it into recognizable actions. ' +
    'You can insert agents in you environment to improve the user experience with your app.',
  },
  agentName: {
    id: 'containers.AgentDetailPage.create_agent.agent_name',
    defaultMessage: 'Agent Name',
  },
  agentNamePlaceholder: {
    id: 'containers.AgentDetailPage.create_agent.agent_name_placeholder',
    defaultMessage: 'Type a name here',
  },
  description: {
    id: 'containers.AgentDetailPage.create_agent.agent_description',
    defaultMessage: 'Describe Agent',
  },
  descriptionPlaceholder: {
    id: 'containers.AgentDetailPage.create_agent.agent_description_placeholder',
    defaultMessage: 'What does this Agent do?',
  },
  sampleData: {
    id: 'containers.AgentDetailPage.create_agent.sample_data',
    defaultMessage: '+ Sample Data',
  },
  sampleDataPlaceholder: {
    id: 'containers.AgentDetailPage.create_agent.sample_data_placeholder',
    defaultMessage: 'Add a prebuilt agent that will respond to User intents',
  },
  language: {
    id: 'containers.AgentDetailPage.create_agent.language',
    defaultMessage: 'Language',
  },
  languageWarning: {
    id: 'containers.AgentDetailPage.create_agent.language_warning',
    defaultMessage: 'Cannot be changed once Agent is created',
  },
  timezone: {
    id: 'containers.AgentDetailPage.create_agent.default_timezone',
    defaultMessage: 'Default Time Zone',
  },
  webhookUrl: {
    id: 'containers.AgentDetailPage.create_agent.webhook_url',
    defaultMessage: 'Webhook Url'
  },
  domainClassifierThreshold: {
    id: 'containers.AgentDetailPage.create_agent.domain_classifier_threshold',
    defaultMessage: 'Domain Recognition Threshold',
  },
  domainClassifierThresholdDescription: {
    id: 'containers.AgentDetailPage.create_agent.domain_classifier_threshold_description',
    defaultMessage: 'This threshold determines how confident your agent has to be that a user\'s request matches a domain inside the agent. Requests not meeting the threshold will use the fallback responses below.'
  },
  importAgent: {
    id: 'containers.AgentDetailPage.create_agent.import_agent',
    defaultMessage: 'Import agent from backup',
  },
  actionButton: {
    id: 'containers.AgentDetailPage.create_agent.action_button',
    defaultMessage: '+ Create',
  },
  deleteButton: {
    id: 'containers.AgentDetailPage.create_agent.delete_button',
    defaultMessage: 'Delete',
  },
  editButton: {
    id: 'containers.AgentDetailPage.create_agent.delete_button',
    defaultMessage: 'Edit',
  },
  agentFallbackTitle: {
    id: 'containers.AgentDetailPage.create_agent.success_message',
    defaultMessage: 'Fallback Responses',
  },
  webhook: {
    id: 'containers.AgentDetailPage.create_agent.webhook',
    defaultMessage: 'Webhook Definition',
  },
  webhookDescription: {
    id: 'containers.AgentDetailPage.create_agent.webhook_description',
    defaultMessage: 'A webhook will help you to process the parsed text by the agent in order to complete you business logic.',
  },
  webhookVerb: {
    id: 'containers.AgentDetailPage.create_agent.webhook_verb',
    defaultMessage: 'Method',
  },
  webhookUrl: {
    id: 'containers.AgentDetailPage.create_agent.webhook_url',
    defaultMessage: 'URL',
  },
  webhookUrlPlaceholder: {
    id: 'containers.AgentDetailPage.create_agent.webhook_url_placeholder',
    defaultMessage: 'http://localhost:3000',
  },
  webhookPayloadType: {
    id: 'containers.AgentDetailPage.create_agent.webhook_payload_type',
    defaultMessage: 'Body Type',
  },
  webhookPayload: {
    id: 'containers.AgentDetailPage.create_agent.webhook_payload',
    defaultMessage: 'Body',
  },
  expandedTrainingData: {
    id: 'containers.AgentDetailPage.create_agent.expanded_training_data',
    defaultMessage: 'Generate extra training examples',
  },
  postFormat: {
    id: 'containers.AgentDetailPage.create_agent.webhook',
    defaultMessage: 'Enable',
  },
  rasaSettingsTitle: {
    id: 'containers.AgentPage.rasa_settings_title',
    defaultMessage: 'Agent Rasa Settings',
  },
  rasaSettingsDescription: {
    id: 'containers.AgentPage.rasa_settings_description',
    defaultMessage: 'If you modify these values the global settings for Rasa will be overriden.',
  },
  rasaURL: {
    id: 'containers.AgentPage.rasa_url',
    defaultMessage: 'Rasa URL',
  },
  rasaURLPlaceholder: {
    id: 'containers.AgentPage.rasa_url_placeholder',
    defaultMessage: 'Enter the URL of your rasa server',
  },
  domainClassifierPipeline: {
    id: 'containers.AgentPage.domain_classifier_pipeline_label',
    defaultMessage: 'Domain Classifier Pipeline',
  },
  intentClassifierPipeline: {
    id: 'containers.AgentPage.intent_classifier_pipeline_label',
    defaultMessage: 'Intent Classifier Pipeline',
  },
  entityClassifierPipeline: {
    id: 'containers.AgentPage.entity_classifier_pipeline_label',
    defaultMessage: 'Entity Classifier Pipeline',
  },
  spacyEntities: {
    id: 'containers.AgentPage.spacy_entities_label',
    defaultMessage: 'Spacy Entities',
  },
  domainClassifierPipelineTooltip: {
    id: 'containers.AgentPage.domain_classifier_tooltip',
    defaultMessage: 'An agent could have multiple domains. To identify the domain of a given user text we use a domain classifier.',
  },
  intentClassifierPipelineTooltip: {
    id: 'containers.AgentPage.intent_classifier_tooltip',
    defaultMessage: 'This pipeline will be the one in charge of generate the model that would classify intents and entities when more than one intent is specified in a domain.',
  },
  entityClassifierPipelineTooltip: {
    id: 'containers.AgentPage.entity_classifier_tooltip',
    defaultMessage: 'When the number of intents in the domain is just one, this pipeline is used to train a model that would only work for recognize entities',
  },
  spacyEntitiesTooltip: {
    id: 'containers.AgentPage.spacy_entities_tooltip',
    defaultMessage: 'Spacy have a series of entities that are recognized by it\'s trained models. With this setting, you are going to select the entities that you want to use from spacy as system entities.',
  },
  entityClassifierPipelineWarningMessage: {
    id: 'containers.AgentPage.entity_classifier_format_warning',
    defaultMessage: 'Please verify entity classifier pipeline is an array of objects with a name attribute',
  },
  intentClassifierPipelineWarningMessage: {
    id: 'containers.AgentPage.intent_classifier_format_warning',
    defaultMessage: 'Please verify intent classifier pipeline is an array of objects with a name attribute',
  },
  domainClassifierPipelineWarningMessage: {
    id: 'containers.AgentPage.domain_classifier_format_warning',
    defaultMessage: 'Please verify domain classifier pipeline is an array of objects with a name attribute',
  },
  spacyEntitiesWarningMessage: {
    id: 'containers.AgentPage.timezone_not_in_timezones',
    defaultMessage: 'Please verify spacy entities is an array of strings',
  },
  ducklingSettingsTitle: {
    id: 'containers.AgentPage.duckling_settings_title',
    defaultMessage: 'Agent Duckling Settings',
  },
  ducklingSettingsDescription: {
    id: 'containers.AgentPage.duckling_settings_description',
    defaultMessage: 'If you modify these values the global settings for Duckling will be overriden.',
  },
  ducklingURL: {
    id: 'containers.AgentPage.duckling_url',
    defaultMessage: 'Duckling URL',
  },
  ducklingURLPlaceholder: {
    id: 'containers.AgentPage.duckling_url_placeholder',
    defaultMessage: 'Enter the URL of your duckling server',
  },
  ducklingDimension: {
    id: 'containers.AgentPage.domain_classifier_pipeline_label',
    defaultMessage: 'Duckling Dimensions',
  },
  ducklingDimensionTooltip: {
    id: 'containers.AgentPage.domain_classifier_tooltip',
    defaultMessage: 'Duckling have multiple dimensions. With this setting you can control which dimensions you would like to be parsed in user text.',
  },
  ducklingDimensionWarningMessage: {
    id: 'containers.AgentPage.domain_classifier_format_warning',
    defaultMessage: 'Please verify duckling dimensions is an array of strings',
  },
  missingAgentName: {
    id: 'containers.AgentPage.domain_classifier_format_warning',
    defaultMessage: 'Please add an agent name',
  },
  missingAgentDescription: {
    id: 'containers.AgentPage.domain_classifier_format_warning',
    defaultMessage: 'Please add an agent description',
  },
  usePostformat:{
    id: 'containers.AgentPage.create_agent.use_postFormat',
    defaultMessage: 'Enable',
  },
  useWebhook: {
    id: 'containers.AgentPage.create_agent.use_webhook',
    defaultMessage: 'Enable',
  },
  enableModelsPerDomain: {
    id: 'containers.AgentPage.create_agent.enable_models_per_domain',
    defaultMessage: 'Generate separate models for each domain',
  },
  agentTrainingSettingsTitle: {
    id: 'containers.AgentPage.agent_training_settings_title',
    defaultMessage: 'Agent Training Settings',
  },
  agentTrainingSettingsDescription: {
    id: 'containers.AgentPage.agent_training_settings_description',
    defaultMessage: 'These settings will modify some elements of the training. Therefore, you can enable or disable them to impact the way the models are generated.',
  },
  webhookSettingsTitle: {
    id: 'containers.AgentPage.webhook_settings_title',
    defaultMessage: 'Agent Webhook Settings',
  },
  webhookSettingsDescription: {
    id: 'containers.AgentPage.webhook_settings_description',
    defaultMessage: 'If you want to define a global webhook that will called each time the user talks with your agent then you can do it here.',
  },
  responseDefinitionTitle: {
    id: 'containers.AgentPage.response_definition_settings_title',
    defaultMessage: 'Agent Response Settings',
  },
  responseDefinitionDescription: {
    id: 'containers.AgentPage.response_definition_settings_description',
    defaultMessage: 'Whenever you talk with your agent you may want to have additional data in your response beside the text. Here you can enable this settings to add more data to your /converse endpoint.',
  },
});
