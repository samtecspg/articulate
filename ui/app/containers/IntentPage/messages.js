import { defineMessages } from 'react-intl';

export default defineMessages({
  createIntentTitle: {
    id: 'boilerplate.containers.IntentPage.create_intent.title',
    defaultMessage: 'Creating New Intent',
  },
  createIntentDescription: {
    id: 'boilerplate.containers.IntentPage.create_intent.description',
    defaultMessage: 'Intens are grouped user sayings with a similar purpose. For example a user may say, ' +
    '"I want to order a cheese pizza" and that may be labeled with an intent of "Order Pizza".',
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
  agentResponsesTitle: {
    id: 'boilerplate.containers.IntentPage.create_intent.agent_responses_title',
    defaultMessage: 'Agent Responses',
  },
  userSaysInput: {
    id: 'boilerplate.containers.IntentPage.create_intent.user_says_input',
    defaultMessage: 'example: What is Chicago\'s weather forecast?',
  },
  responsesInput: {
    id: 'boilerplate.containers.IntentPage.create_intent.responses_input',
    defaultMessage: 'example: The weather forecast in {city} for the next five days is',
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
  actionButton: {
    id: 'boilerplate.containers.AgentPage.create_agent.action_button',
    defaultMessage: '+ Create',
  },
  emptyEntityList: {
    id: 'boilerplate.containers.AgentPage.create_agent.empty_entity_list',
    defaultMessage: 'Please select an agent first',
  },
  createEntity: {
    id: 'boilerplate.containers.AgentPage.create_agent.create_entity',
    defaultMessage: '+ Create Entity',
  },
  emptySlotList: {
    id: 'boilerplate.containers.AgentPage.create_agent.empty_slot_list',
    defaultMessage: 'You haven\'t created slots',
  },
  webhook: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook',
    defaultMessage: 'Webhook Url',
  },
  webhookPlaceholder: {
    id: 'boilerplate.containers.AgentPage.create_agent.webhook_placeholder',
    defaultMessage: 'example: http://localhost:4500',
  },
});
