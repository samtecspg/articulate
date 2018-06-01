import { defineMessages } from 'react-intl';

export default defineMessages({
  createIntentTitle: {
    id: 'boilerplate.containers.IntentPage.create_intent.title',
    defaultMessage: 'Creating New Intent',
  },
  defaultPostFormat : {
    id: 'boilerplate.containers.IntentPage.create_intent.defaultPostFormat',
    defaultMessage: '{ "textResponse" : "{{ textResponse }}" }'
  },

  createIntentDescription: {
    id: 'boilerplate.containers.IntentPage.create_intent.description',
    defaultMessage: 'Intents are grouped user sayings with a similar purpose. For example a user may say, ' +
    '"I want to order a cheese pizza" and that may be labeled with an intent of "Order Pizza".',
  },
  editIntentTitle: {
    id: 'boilerplate.containers.IntentPage.create_intent.title',
    defaultMessage: 'Editing the intent',
  },
  editIntentDescription: {
    id: 'boilerplate.containers.IntentPage.create_intent.description',
    defaultMessage: 'Please make the desired changes in your intent and click on the update button',
  },
  agent: {
    id: 'boilerplate.containers.IntentPage.create_intent.agent',
    defaultMessage: 'Agent',
  },
  domain: {
    id: 'boilerplate.containers.IntentPage.create_intent.domain',
    defaultMessage: 'Domain',
  },
  intentName: {
    id: 'boilerplate.containers.IntentPage.create_intent.intentName',
    defaultMessage: 'Intent Name',
  },
  intentNamePlaceholder: {
    id: 'boilerplate.containers.IntentPage.create_intent.intent_name_placeholder',
    defaultMessage: 'Type a name here',
  },
  userSaysTitle: {
    id: 'boilerplate.containers.IntentPage.create_intent.user_says',
    defaultMessage: 'User Says',
  },
  userSaysExample: {
    id: 'boilerplate.containers.IntentPage.create_intent.user_says_example',
    defaultMessage: 'Example: How\'s the weather looking for today?'
  },
  agentResponsesTitle: {
    id: 'boilerplate.containers.IntentPage.create_intent.agent_responses_title',
    defaultMessage: 'Agent Responses',
  },
  agentResponseExample: {
    id: 'boilerplate.containers.IntentPage.create_intent.agent_responses_example',
    defaultMessage: 'The weather in {{slots.location.value}} should be {{response.value}}.'
  },
  userSaysInput: {
    id: 'boilerplate.containers.IntentPage.create_intent.user_says_input',
    defaultMessage: 'Type sample dialogue and press Enter',
  },
  responsesInput: {
    id: 'boilerplate.containers.IntentPage.create_intent.responses_input',
    defaultMessage: 'Type an agent response and press Enter',
  },
  userSaysSearch: {
    id: 'boilerplate.containers.IntentPage.create_intent.user_says_search',
    defaultMessage: 'Search user says',
  },
  slots: {
    id: 'boilerplate.containers.IntentPage.create_intent.slots',
    defaultMessage: 'Slots',
  },
  slotNameTooltip: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_name_tooltip',
    defaultMessage: 'This is one instance of the intent you named upwards.',
  },
  slotEntityTooltip: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_entity_tooltip',
    defaultMessage: 'Synonyms will help the agent to recognize this example in several different ways.',
  },
  slotIsRequiredTooltip: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_is_required_tooltip',
    defaultMessage: 'Flag to indicate if the user should fulfilled this slot before sending intent.',
  },
  slotIsListTooltip: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_is_list_tooltip',
    defaultMessage: 'Flag to indicate if this slot should be grouped in a list of elements.',
  },
  slotPromptTooltip: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_prompt_tooltip',
    defaultMessage: 'Flag to indicate if this slot should be grouped in a list of elements.',
  },
  slotNameTitle: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_name_title',
    defaultMessage: 'Slot Name',
  },
  slotEntityTitle: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_entity_title',
    defaultMessage: 'Entity',
  },
  slotIsRequiredTitle: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_is_required_title',
    defaultMessage: 'Required?',
  },
  slotIsListTitle: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_is_list_title',
    defaultMessage: 'List?',
  },
  slotPromptTitle: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_prompt_title',
    defaultMessage: 'Text Prompt',
  },
  slotNamePlaceholder: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_name_placeholder',
    defaultMessage: 'Add Slot',
  },
  slotEntityPlaceholder: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_entity_placeholder',
    defaultMessage: 'Select Entity',
  },
  slotPromptPlaceholder: {
    id: 'boilerplate.containers.IntentPage.create_intent.slot_name_placeholder',
    defaultMessage: 'Add Text Prompt',
  },
  createButton: {
    id: 'boilerplate.containers.IntentPage.create_intent.create_button',
    defaultMessage: '+ Create',
  },
  editButton: {
    id: 'boilerplate.containers.IntentPage.create_intent.edit_button',
    defaultMessage: '+ Update',
  },
  emptyEntityList: {
    id: 'boilerplate.containers.IntentPage.create_agent.empty_entity_list',
    defaultMessage: 'Please select an agent first',
  },
  noEntitiesInAgent: {
    id: 'boilerplate.containers.IntentPage.create_agent.empty_entity_list',
    defaultMessage: 'No entities created',
  },
  createEntity: {
    id: 'boilerplate.containers.IntentPage.create_agent.create_entity',
    defaultMessage: '+ Create Entity',
  },
  emptySlotList: {
    id: 'boilerplate.containers.IntentPage.create_agent.empty_slot_list',
    defaultMessage: 'You haven\'t created slots',
  },
  webhook: {
    id: 'boilerplate.containers.IntentPage.create_agent.webhook',
    defaultMessage: 'Webhook Url',
  },
  webhookPlaceholder: {
    id: 'boilerplate.containers.IntentPage.create_agent.webhook_placeholder',
    defaultMessage: 'example: http://localhost:4500',
  },
  successMessage: {
    id: 'boilerplate.containers.IntentPage.create_agent.success_message',
    defaultMessage: 'Intent created',
  },
  successMessageEdit: {
    id: 'boilerplate.containers.IntentPage.create_agent.success_message',
    defaultMessage: 'Intent updated',
  },
  missingResponsesMessage: {
    id: 'boilerplate.containers.IntentPage.create_agent.missing_response_message',
    defaultMessage: 'Please add at least one agent response',
  },
  missingWebhookMessage: {
    id: 'boilerplate.containers.IntentPage.create_agent.missing_webhook_message',
    defaultMessage: 'Please add at the webhook url',
  },
  missingPostFormatPayload: {
    id: 'boilerplate.containers.IntentPage.create_agent.missing_postFormat_payload',
    defaultMessage: 'Please add a POST format response for the intent, default one has been added.',
  },
  invalidSlotNameInPrompt: {
    id: 'boilerplate.containers.IntentPage.create_agent.invalid_slot_name_prompt',
    defaultMessage: 'Please verify that every text prompt for required slots are referencing valid slots names',
  },
  invalidSlotNameInResponse: {
    id: 'boilerplate.containers.IntentPage.create_agent.invalid_slot_name_response',
    defaultMessage: 'Please verify that every agent response are referencing valid slots names',
  },
  webhookDescription: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_description',
    defaultMessage: 'A webhook will help you to process the parsed text by the agent in order to complete you business logic.',
  },
  webhookVerb: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_verb',
    defaultMessage: 'Method',
  },
  webhookUrl: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_url',
    defaultMessage: 'URL',
  },
  webhookUrlPlaceholder: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_url_placeholder',
    defaultMessage: 'http://localhost:3000',
  },
  webhookPayloadType: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_payload_type',
    defaultMessage: 'Body Type',
  },
  webhookPayload: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_payload',
    defaultMessage: 'Body',
  },
  missingWebhookUrl: {
    id: 'boilerplate.containers.AgentPage.create_agent.missing_webhook_url',
    defaultMessage: 'Please add a webhook url for your webhook',
  },
  useWebhook: {
    id: 'boilerplate.containers.IntentPage.create_agent.use_webhook',
    defaultMessage: 'Webhook Definition',
  },
  usePostFormat:{
    id: 'boilerplate.containers.IntentPage.create_agent.use_postFormat',
    defaultMessage: 'Response Definition',
  },
  postFormat:{
    id: 'boilerplate.containers.IntentPage.create_agent.postFormat',
    defaultMessage: 'Response definition',
  },
  newSlotButton: {
    id: 'boilerplate.containers.IntentPage.create_agent.new_slot_button',
    defaultMessage: 'New +',
  },
  defaultNewSlotName: {
    id: 'boilerplate.containers.IntentPage.create_agent.default_new_slot_name',
    defaultMessage: 'New slot',
  },
  checkEntitiesOfSlots: {
    id: 'boilerplate.containers.IntentPage.create_agent.default_new_slot_name',
    defaultMessage: 'Please verify that every slot have an entity value',
  }
});
