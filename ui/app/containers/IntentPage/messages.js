import { defineMessages } from 'react-intl';

export default defineMessages({
  createIntentTitle: {
    id: 'containers.IntentPage.create_intent.title',
    defaultMessage: 'Creating New Intent',
  },
  defaultPostFormat : {
    id: 'containers.IntentPage.create_intent.defaultPostFormat',
    defaultMessage: '{ "textResponse" : "{{ textResponse }}" }'
  },

  createIntentDescription: {
    id: 'containers.IntentPage.create_intent.description',
    defaultMessage: 'Intents are grouped user sayings with a similar purpose. For example a user may say, ' +
    '"I want to order a cheese pizza" and that may be labeled with an intent of "Order Pizza".',
  },
  editIntentTitle: {
    id: 'containers.IntentPage.create_intent.title',
    defaultMessage: 'Editing the intent',
  },
  editIntentDescription: {
    id: 'containers.IntentPage.create_intent.description',
    defaultMessage: 'Please make the desired changes in your intent and click on the update button',
  },
  agent: {
    id: 'containers.IntentPage.create_intent.agent',
    defaultMessage: 'Agent',
  },
  domain: {
    id: 'containers.IntentPage.create_intent.domain',
    defaultMessage: 'Domain',
  },
  intentName: {
    id: 'containers.IntentPage.create_intent.intentName',
    defaultMessage: 'Intent Name',
  },
  intentNamePlaceholder: {
    id: 'containers.IntentPage.create_intent.intent_name_placeholder',
    defaultMessage: 'Type a name here',
  },
  userSaysTitle: {
    id: 'containers.IntentPage.create_intent.user_says',
    defaultMessage: 'User Says',
  },
  userSaysExample: {
    id: 'containers.IntentPage.create_intent.user_says_example',
    defaultMessage: 'Example: How\'s the weather looking for today?'
  },
  agentResponsesTitle: {
    id: 'containers.IntentPage.create_intent.agent_responses_title',
    defaultMessage: 'Agent Responses',
  },
  agentResponseExample: {
    id: 'containers.IntentPage.create_intent.agent_responses_example',
    defaultMessage: 'The weather in {{slots.location.value}} should be {{response.value}}.'
  },
  userSaysInput: {
    id: 'containers.IntentPage.create_intent.user_says_input',
    defaultMessage: 'Type sample dialogue and press Enter',
  },
  responsesInput: {
    id: 'containers.IntentPage.create_intent.responses_input',
    defaultMessage: 'Type an agent response and press Enter',
  },
  userSaysSearch: {
    id: 'containers.IntentPage.create_intent.user_says_search',
    defaultMessage: 'Search user says',
  },
  slots: {
    id: 'containers.IntentPage.create_intent.slots',
    defaultMessage: 'Slots',
  },
  slotNameTooltip: {
    id: 'containers.IntentPage.create_intent.slot_name_tooltip',
    defaultMessage: 'This is one instance of the intent you named upwards.',
  },
  slotEntityTooltip: {
    id: 'containers.IntentPage.create_intent.slot_entity_tooltip',
    defaultMessage: 'Synonyms will help the agent to recognize this example in several different ways.',
  },
  slotIsRequiredTooltip: {
    id: 'containers.IntentPage.create_intent.slot_is_required_tooltip',
    defaultMessage: 'Flag to indicate if the user should fulfilled this slot before sending intent.',
  },
  slotIsListTooltip: {
    id: 'containers.IntentPage.create_intent.slot_is_list_tooltip',
    defaultMessage: 'Flag to indicate if this slot should be grouped in a list of elements.',
  },
  slotPromptTooltip: {
    id: 'containers.IntentPage.create_intent.slot_prompt_tooltip',
    defaultMessage: 'Flag to indicate if this slot should be grouped in a list of elements.',
  },
  slotNameTitle: {
    id: 'containers.IntentPage.create_intent.slot_name_title',
    defaultMessage: 'Slot Name',
  },
  slotEntityTitle: {
    id: 'containers.IntentPage.create_intent.slot_entity_title',
    defaultMessage: 'Entity',
  },
  slotIsRequiredTitle: {
    id: 'containers.IntentPage.create_intent.slot_is_required_title',
    defaultMessage: 'Required?',
  },
  slotIsListTitle: {
    id: 'containers.IntentPage.create_intent.slot_is_list_title',
    defaultMessage: 'List?',
  },
  slotPromptTitle: {
    id: 'containers.IntentPage.create_intent.slot_prompt_title',
    defaultMessage: 'Text Prompt',
  },
  slotNamePlaceholder: {
    id: 'containers.IntentPage.create_intent.slot_name_placeholder',
    defaultMessage: 'Add Slot',
  },
  slotEntityPlaceholder: {
    id: 'containers.IntentPage.create_intent.slot_entity_placeholder',
    defaultMessage: 'Select Entity',
  },
  slotPromptPlaceholder: {
    id: 'containers.IntentPage.create_intent.slot_name_placeholder',
    defaultMessage: 'Add Text Prompt',
  },
  createButton: {
    id: 'containers.IntentPage.create_intent.create_button',
    defaultMessage: '+ Create',
  },
  editButton: {
    id: 'containers.IntentPage.create_intent.edit_button',
    defaultMessage: '+ Update',
  },
  emptyEntityList: {
    id: 'containers.IntentPage.create_agent.empty_entity_list',
    defaultMessage: 'Please select an agent first',
  },
  noEntitiesInAgent: {
    id: 'containers.IntentPage.create_agent.empty_entity_list',
    defaultMessage: 'No entities created',
  },
  createEntity: {
    id: 'containers.IntentPage.create_agent.create_entity',
    defaultMessage: '+ Create Entity',
  },
  emptySlotList: {
    id: 'containers.IntentPage.create_agent.empty_slot_list',
    defaultMessage: 'You haven\'t created slots',
  },
  webhook: {
    id: 'containers.IntentPage.create_agent.webhook',
    defaultMessage: 'Webhook Url',
  },
  webhookPlaceholder: {
    id: 'containers.IntentPage.create_agent.webhook_placeholder',
    defaultMessage: 'example: http://localhost:4500',
  },
  successMessage: {
    id: 'containers.IntentPage.create_agent.success_message',
    defaultMessage: 'Intent created',
  },
  successMessageEdit: {
    id: 'containers.IntentPage.create_agent.success_message',
    defaultMessage: 'Intent updated',
  },
  missingResponsesMessage: {
    id: 'containers.IntentPage.create_agent.missing_response_message',
    defaultMessage: 'Please add at least one agent response',
  },
  missingWebhookMessage: {
    id: 'containers.IntentPage.create_agent.missing_webhook_message',
    defaultMessage: 'Please add at the webhook url',
  },
  missingPostFormatPayload: {
    id: 'containers.IntentPage.create_agent.missing_postFormat_payload',
    defaultMessage: 'Please add a POST format response for the intent, default one has been added.',
  },
  invalidSlotNameInPrompt: {
    id: 'containers.IntentPage.create_agent.invalid_slot_name_prompt',
    defaultMessage: 'Please verify that every text prompt for required slots are referencing valid slots names',
  },
  invalidSlotNameInResponse: {
    id: 'containers.IntentPage.create_agent.invalid_slot_name_response',
    defaultMessage: 'Please verify that every agent response are referencing valid slots names',
  },
  webhookDescription: {
    id: 'containers.IntentPage.create_agent.webhook_description',
    defaultMessage: 'A webhook will help you to process the parsed text by the agent in order to complete you business logic.',
  },
  webhookVerb: {
    id: 'containers.IntentPage.create_agent.webhook_verb',
    defaultMessage: 'Method',
  },
  webhookUrl: {
    id: 'containers.IntentPage.create_agent.webhook_url',
    defaultMessage: 'URL',
  },
  webhookUrlPlaceholder: {
    id: 'containers.IntentPage.create_agent.webhook_url_placeholder',
    defaultMessage: 'http://localhost:3000',
  },
  webhookPayloadType: {
    id: 'containers.IntentPage.create_agent.webhook_payload_type',
    defaultMessage: 'Body Type',
  },
  webhookPayload: {
    id: 'containers.IntentPage.create_agent.webhook_payload',
    defaultMessage: 'Body',
  },
  missingWebhookUrl: {
    id: 'containers.IntentPage.create_agent.missing_webhook_url',
    defaultMessage: 'Please add a webhook url for your webhook',
  },
  useWebhook: {
    id: 'containers.IntentPage.create_agent.use_webhook',
    defaultMessage: 'Webhook Definition',
  },
  usePostFormat:{
    id: 'containers.IntentPage.create_agent.use_postFormat',
    defaultMessage: 'Response Definition',
  },
  postFormat:{
    id: 'containers.IntentPage.create_agent.postFormat',
    defaultMessage: 'Response definition',
  },
  newSlotButton: {
    id: 'containers.IntentPage.create_agent.new_slot_button',
    defaultMessage: 'New +',
  },
  defaultNewSlotName: {
    id: 'containers.IntentPage.create_agent.default_new_slot_name',
    defaultMessage: 'New slot',
  },
  checkEntitiesOfSlots: {
    id: 'containers.IntentPage.create_agent.default_new_slot_name',
    defaultMessage: 'Please verify that every slot have an entity value',
  }
});
