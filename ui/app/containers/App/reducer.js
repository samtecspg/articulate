import Immutable from 'seamless-immutable';
import {
  ADD_ACTION,
  ADD_ACTION_ERROR,
  ADD_ACTION_NEW_SAYING,
  ADD_ACTION_RESPONSE,
  ADD_ACTION_SAYING,
  ADD_ACTION_SUCCESS,
  ADD_AGENT,
  ADD_AGENT_ERROR,
  ADD_AGENT_FALLBACK,
  ADD_AGENT_SUCCESS,
  ADD_FALLBACK,
  ADD_HEADER_ACTION_WEBHOOK,
  ADD_HEADER_AGENT_WEBHOOK,
  ADD_KEYWORD_EXAMPLE,
  ADD_SAYING,
  ADD_SAYING_ERROR,
  CHAIN_ACTION_TO_RESPONSE,
  CHANGE_ACTION_DATA,
  CHANGE_ACTION_NAME,
  CHANGE_ACTION_POST_FORMAT_DATA,
  CHANGE_ACTION_WEBHOOK_DATA,
  CHANGE_ACTION_WEBHOOK_PAYLOAD_TYPE,
  CHANGE_AGENT_DATA,
  CHANGE_AGENT_NAME,
  CHANGE_AGENT_SETTINGS_DATA,
  ADD_AGENT_PARAMETER,
  DELETE_AGENT_PARAMETER,
  CHANGE_AGENT_PARAMETER_NAME,
  CHANGE_AGENT_PARAMETER_VALUE,
  CHANGE_CATEGORY_DATA,
  CHANGE_EXAMPLE_NAME,
  CHANGE_EXAMPLE_SYNONYMS,
  CHANGE_HEADER_KEY_ACTION_WEBHOOK,
  CHANGE_HEADER_KEY_AGENT_WEBHOOK,
  CHANGE_HEADER_VALUE_ACTION_WEBHOOK,
  CHANGE_HEADER_VALUE_AGENT_WEBHOOK,
  CHANGE_KEYWORD_DATA,
  CHANGE_POST_FORMAT_DATA,
  CHANGE_SETTINGS_DATA,
  CHANGE_WEBHOOK_DATA,
  CHANGE_WEBHOOK_PAYLOAD_TYPE,
  CHECK_API,
  CLEAR_SAYING_TO_ACTION,
  CLOSE_NOTIFICATION,
  COPY_SAYING_ERROR,
  COPY_SAYING_SUCCESS,
  CREATE_CATEGORY,
  CREATE_CATEGORY_ERROR,
  CREATE_CATEGORY_SUCCESS,
  CREATE_KEYWORD,
  CREATE_KEYWORD_ERROR,
  CREATE_KEYWORD_SUCCESS,
  DELETE_ACTION,
  DELETE_ACTION_ERROR,
  DELETE_ACTION_NEW_SAYING,
  DELETE_ACTION_RESPONSE,
  DELETE_ACTION_SAYING,
  DELETE_ACTION_SUCCESS,
  DELETE_AGENT,
  DELETE_AGENT_ERROR,
  DELETE_AGENT_FALLBACK,
  DELETE_AGENT_SUCCESS,
  DELETE_CATEGORY,
  DELETE_CATEGORY_ERROR,
  DELETE_CATEGORY_SUCCESS,
  DELETE_FALLBACK,
  DELETE_HEADER_ACTION_WEBHOOK,
  DELETE_HEADER_AGENT_WEBHOOK,
  DELETE_KEYWORD,
  DELETE_KEYWORD_ERROR,
  DELETE_KEYWORD_EXAMPLE,
  DELETE_KEYWORD_SUCCESS,
  DELETE_SAYING,
  DELETE_SAYING_ERROR,
  LOAD_ACTION,
  LOAD_ACTION_ERROR,
  LOAD_ACTION_SUCCESS,
  LOAD_ACTIONS,
  LOAD_ACTIONS_ERROR,
  LOAD_ACTIONS_SUCCESS,
  LOAD_AGENT,
  LOAD_AGENT_DOCUMENTS_ERROR,
  LOAD_AGENT_DOCUMENTS_SUCCESS,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  LOAD_AGENTS,
  LOAD_AGENTS_ERROR,
  LOAD_AGENTS_SUCCESS,
  LOAD_CATEGORIES,
  LOAD_CATEGORIES_ERROR,
  LOAD_CATEGORIES_SUCCESS,
  LOAD_CATEGORY,
  LOAD_CATEGORY_ERROR,
  LOAD_CATEGORY_SUCCESS,
  LOAD_FILTERED_CATEGORIES,
  LOAD_FILTERED_CATEGORIES_ERROR,
  LOAD_FILTERED_CATEGORIES_SUCCESS,
  LOAD_KEYWORD,
  LOAD_KEYWORD_ERROR,
  LOAD_KEYWORD_SUCCESS,
  LOAD_KEYWORDS,
  LOAD_KEYWORDS_ERROR,
  LOAD_KEYWORDS_SUCCESS,
  LOAD_SAYINGS,
  LOAD_SAYINGS_ERROR,
  LOAD_SAYINGS_SUCCESS,
  LOAD_SETTINGS,
  LOAD_SETTINGS_ERROR,
  LOAD_SETTINGS_SUCCESS,
  MISSING_API,
  RESET_ACTION_DATA,
  RESET_AGENT_DATA,
  RESET_CATEGORY_DATA,
  RESET_KEYWORD_DATA,
  RESET_MISSING_API,
  RESET_SESSION_SUCCESS,
  RESET_STATUS_FLAGS,
  RESPOND_MESSAGE,
  SELECT_CATEGORY,
  SEND_MESSAGE,
  SEND_SAYING_TO_ACTION,
  ADD_NEW_SLOT,
  ADD_SLOT_TEXT_PROMPT_SLOT,
  CHANGE_SLOT_DATA,
  CHANGE_SLOT_NAME,
  DELETE_SLOT,
  DELETE_SLOT_TEXT_PROMPT_SLOT,
  SORT_SLOTS,
  ADD_NEW_MODIFIER,
  ADD_MODIFIER_SAYING,
  CHANGE_MODIFIER_DATA,
  CHANGE_MODIFIER_NAME,
  DELETE_MODIFIER,
  DELETE_MODIFIER_SAYING,
  SORT_MODIFIERS,
  STORE_SOURCE_DATA,
  TAG_KEYWORD,
  TOGGLE_CONVERSATION_BAR,
  TRAIN_AGENT,
  TRAIN_AGENT_ERROR,
  UNCHAIN_ACTION_FROM_RESPONSE,
  UNTAG_KEYWORD,
  UPDATE_ACTION,
  UPDATE_ACTION_ERROR,
  UPDATE_ACTION_SUCCESS,
  UPDATE_AGENT,
  UPDATE_AGENT_ERROR,
  UPDATE_AGENT_SUCCESS,
  UPDATE_CATEGORY,
  UPDATE_CATEGORY_ERROR,
  UPDATE_CATEGORY_SUCCESS,
  ADD_CATEGORY_PARAMETER,
  DELETE_CATEGORY_PARAMETER,
  CHANGE_CATEGORY_PARAMETER_NAME,
  CHANGE_CATEGORY_PARAMETER_VALUE,
  UPDATE_KEYWORD,
  UPDATE_KEYWORD_ERROR,
  UPDATE_KEYWORD_SUCCESS,
  UPDATE_SAYING_ERROR,
  UPDATE_SETTINGS,
  UPDATE_SETTINGS_ERROR,
  UPDATE_SETTINGS_SUCCESS,
  UNTAG_MODIFIER_KEYWORD,
  TAG_MODIFIER_KEYWORD,
} from './constants';

const happyEmojies = ['😀', '😁', '😃', '😄', '😉', '😎', '🙂', '🤩', '😛', '😜', '🙃', '😬', '🤓', '😺', '😸', '💪', '🤙', '👌', '👍', '🤚', '👏', '🙌', '🎖', '🏆', '🏅', '🥇', '🎉', '🎊'];
const errorEmojies = ['😣', '😥', '😮', '😯', '😫', '😓', '😕', '😖', '😦', '😧', '😨', '😩', '🤯', '😱', '😵', '🤕', '💀', '🙀', '😿', '🚫', '❌', '💣', '🚑', '🚒', '🚨'];

// The initial state of the App
const initialState = Immutable({
  conversationBarOpen: false,
  waitingResponse: false,
  notifications: [],
  messages: [],
  category: {
    categoryName: '',
    enabled: true,
    actionThreshold: 50,
    extraTrainingData: false,
    parameters: {},
  },
  categories: [],
  filteredCategories: [],
  agents: false,
  currentAgent: {
    agentName: '',
    description: '',
    language: 'en',
    timezone: 'UTC',
    useWebhook: false,
    usePostFormat: false,
    extraTrainingData: false,
    enableModelsPerCategory: true,
    multiCategory: true,
    fallbackAction: '',
    categoryClassifierThreshold: 50,
    parameters: {},
  },
  agent: {
    agentName: '',
    description: '',
    language: 'en',
    timezone: 'UTC',
    useWebhook: false,
    usePostFormat: false,
    extraTrainingData: false,
    enableModelsPerCategory: true,
    multiCategory: true,
    fallbackAction: '',
    categoryClassifierThreshold: 50,
    parameters: {},
  },
  agentWebhook: {
    agent: '',
    webhookUrl: '',
    webhookVerb: 'GET',
    webhookPayloadType: 'None',
    webhookPayload: '',
    webhookHeaders: [],
    webhookUser: '',
    webhookPassword: '',
  },
  agentPostFormat: {
    agent: '',
    postFormatPayload: '{\n\t"textResponse" : "{{ textResponse }}",\n\t"docId" : "{{ docId }}"\n}',
  },
  agentSettings: {
    rasaURL: '',
    ducklingURL: '',
    ducklingDimension: '[]',
    spacyPretrainedEntities: '[]',
    categoryClassifierPipeline: '[]',
    sayingClassifierPipeline: '[]',
    keywordClassifierPipeline: '[]',
  },
  keyword: {
    type: 'learned',
    regex: '',
    agent: '',
    uiColor: '#e91e63',
    keywordName: '',
    examples: [],
    modifiers: [],
  },
  keywords: [],
  totalKeywords: 0,
  selectedCategory: '',
  sayings: [],
  totalSayings: 0,
  agentOldPayloadJSON: '{\n\t"text": "{{text}}",\n\t"action": {{{JSONstringify action}}},\n\t"slots": {{{JSONstringify slots}}}\n}',
  agentOldPayloadXML: '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n\t<text>{{text}}</text>\n\t<action>{{{toXML action}}}</action>\n\t<slots>{{{toXML slots}}}</slots>\n</data>',
  missingAPI: false,
  sayingForAction: {
    agent: '',
    category: '',
    userSays: '',
    keywords: [],
    actions: [],
  },
  action: {
    agent: '',
    actionName: '',
    useWebhook: false,
    usePostFormat: false,
    slots: [],
    responses: [],
  },
  actionWebhook: {
    webhookUrl: '',
    webhookVerb: 'GET',
    webhookPayloadType: 'None',
    webhookPayload: '',
    webhookHeaders: [],
    webhookUser: '',
    webhookPassword: '',
  },
  actionPostFormat: {
    postFormatPayload: '{\n\t"textResponse" : "{{ textResponse }}",\n\t"docId" : "{{ docId }}"\n}',
  },
  actionOldPayloadJSON: '{\n\t"text": "{{text}}",\n\t"action": {{{JSONstringify action}}},\n\t"slots": {{{JSONstringify slots}}}\n}',
  actionOldPayloadXML: '<?xml version=\'1.0\' encoding=\'UTF-8\'?>\n<data>\n\t<text>{{text}}</text>\n\t<action>{{{toXML action}}}</action>\n\t<slots>{{{toXML slots}}}</slots>\n</data>',
  actions: [],
  newSayingActions: [],
  agentJustEdited: false,
  agentTouched: false,
  actionTouched: false,
  keywordTouched: false,
  categoryTouched: false,
  actionTouched: false,
  newSlot: {
    slotName: 'New Slot',
    uiColor: '#4e4e4e',
    keyword: '',
    keywordId: '0',
    isList: false,
    isRequired: false,
    textPrompts: [],
  },
  newModifier: {
    modifierName: 'New Modifier',
    action: 'SET',
    valueSource: 'keyword',
    staticValue: '',
    sayings: [],
  },
  totalActions: 0,
  currentAction: {
    agent: '',
    category: '',
    actionName: '',
    useWebhook: false,
    usePostFormat: false,
    slots: [],
    responses: [],
  },
  settings: {
    rasaURL: '',
    uiLanguage: '',
    ducklingURL: '',
    defaultTimezone: '',
    defaultAgentLanguage: '',
    timezones: [],
    uiLanguages: [],
    agentLanguages: [],
    ducklingDimension: [],
    spacyPretrainedEntities: [],
    categoryClassifierPipeline: [],
    sayingClassifierPipeline: [],
    keywordClassifierPipeline: [],
    defaultAgentFallbackResponses: [],
  },
  settingsTouched: false,
  loading: false,
  error: false,
  success: false,
  successKeyword: false,
  successCategory: false,
  successAction: false,
  successAgent: false,
  conversationStateObject: {},
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    /* Global */
    case CHECK_API:
      return state;
    case MISSING_API:
      return state
        .set('missingAPI', true);
    case RESET_MISSING_API:
      return state
        .set('missingAPI', false);
    case RESET_STATUS_FLAGS:
      return state.set('loading', false)
        .set('success', false)
        .set('error', false);
    case TOGGLE_CONVERSATION_BAR:
      return state.set('conversationBarOpen', action.value);
    case CLOSE_NOTIFICATION:
      return state.update('notifications', notifications => notifications.filter((item, index) => index !== action.index));
    case SEND_MESSAGE:
      return state.update('messages', messages => messages.concat(action.message))
        .set('waitingResponse', true);
    case RESPOND_MESSAGE:
      return state.update('messages', messages => messages.concat(action.message))
        .set('waitingResponse', false);
    case STORE_SOURCE_DATA:
      return state.set('conversationStateObject', action.conversationStateObject);
    case RESET_SESSION_SUCCESS:
      return state.set('messages', [])
        .set('notifications', []);

    /* Agents */
    case LOAD_AGENTS:
      return state.set('agents', false)
        .set('loading', true)
        .set('error', false);
    case LOAD_AGENTS_ERROR:
      return state.set('agents', false)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_AGENTS_SUCCESS:
      return state.set('agents', action.agents)
        .set('loading', false)
        .set('error', false);
    case DELETE_AGENT:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case DELETE_AGENT_ERROR:
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case DELETE_AGENT_SUCCESS:
      return state.set('agent', initialState.agent)
        .set('currentAgent', initialState.currentAgent)
        .set('agentWebhook', initialState.agentWebhook)
        .set('agentPostFormat', initialState.agentPostFormat)
        .set('agentSettings', initialState.agentSettings)
        .set('loading', false)
        .set('success', true)
        .set('error', false);

    /* Agent */
    case RESET_AGENT_DATA:
      return state.set('agent', initialState.agent)
        .set('currentAgent', initialState.currentAgent)
        .set('agentWebhook', initialState.agentWebhook)
        .set('agentPostFormat', initialState.agentPostFormat)
        .set('agentSettings', initialState.agentSettings)
        .set('agentTouched', false)
        .set('successAgent', false);
    case LOAD_AGENT:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_AGENT_ERROR:
      return state
        .set('agent', initialState.agent)
        .set('currentAgent', initialState.currentAgent)
        .set('loading', false)
        .set('error', action.error)
        .set('agentTouched', false);
    case LOAD_AGENT_SUCCESS:
      const isATrainingUpdate = state.agent.agentName === action.payload.agent.agentName && state.agent.status !== action.payload.agent.status;
      if (isATrainingUpdate) {
        if (action.payload.agent.status === 'Ready') {
          state = state.update('notifications', notifications => notifications.concat({ message: `Notification: The agent <b>${action.payload.agent.agentName}</b> has finished training. ${happyEmojies[Math.floor(Math.random() * happyEmojies.length)]}`, type: 'success' }));
        }
        if (action.payload.agent.status === 'Error') {
          state = state.update('notifications', notifications => notifications.concat({ message: `Error: An error ocurred training <b>${action.payload.agent.agentName}</b>. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
        }
        if (action.payload.agent.status === 'Out of Date') {
          state = state.update('notifications', notifications => notifications.concat({ message: `Notification: <b>${action.payload.agent.agentName}</b> is out of date. It's time to train.`, type: 'success' }));
        }
      }
      let agentWebhook, agentPostFormat;
      if (!action.payload.agent.useWebhook) {
        agentWebhook = initialState.agentWebhook;
        agentWebhook = agentWebhook.set('agent', action.payload.agent.agentName);
      } else {
        agentWebhook = action.payload.webhook;
      }
      if (!action.payload.agent.usePostFormat) {
        agentPostFormat = initialState.agentPostFormat;
        agentPostFormat = agentPostFormat.set('agent', action.payload.agent.agentName);
      } else {
        agentPostFormat = action.payload.postFormat;
      }
      return state
        .set('agent', action.payload.agent)
        .set('currentAgent', action.payload.agent)
        .set('agentSettings', action.payload.agent.settings)
        .set('agentWebhook', agentWebhook)
        .set('agentPostFormat', agentPostFormat)
        .set('loading', false)
        .set('error', false)
        .set('agentTouched', false)
        .set('successAgent', action.payload.socket ? state.successAgent : false);
    case CHANGE_AGENT_NAME:
      return state
        .setIn(['agent', action.payload.field], action.payload.value)
        .setIn(['agentWebhook', 'agent'], action.payload.value)
        .setIn(['agentPostFormat', 'agent'], action.payload.value)
        .set('agentTouched', true);
    case CHANGE_AGENT_DATA:
      return state.setIn(['agent', action.payload.field], action.payload.value)
        .set('agentTouched', true);
    case CHANGE_WEBHOOK_DATA:
      return state.setIn(['agentWebhook', action.payload.field], action.payload.value)
        .set('agentTouched', true);
    case CHANGE_WEBHOOK_PAYLOAD_TYPE:
      if (action.payload.value === 'None') {
        if (state.agentWebhook.webhookPayloadType === 'JSON') {
          state = state.set('agentOldPayloadJSON', state.agentWebhook.webhookPayload);
        }
        if (state.agentWebhook.webhookPayloadType === 'XML') {
          state = state.set('agentOldPayloadXML', state.agentWebhook.webhookPayload);
        }
        return state
          .setIn(['agentWebhook', 'webhookPayload'], '')
          .setIn(['agentWebhook', action.payload.field], action.payload.value)
          .set('agentTouched', true);
      }

      if (action.payload.value === 'JSON' && state.agentWebhook.webhookPayloadType !== 'JSON') {
        if (state.agentWebhook.webhookPayloadType === 'XML') {
          state = state.set('agentOldPayloadXML', state.agentWebhook.webhookPayload);
        }
        state = state.setIn(['agentWebhook', 'webhookPayload'], state.agentOldPayloadJSON);
      }
      if (action.payload.value === 'XML' && state.agentWebhook.webhookPayloadType !== 'XML') {
        if (state.agentWebhook.webhookPayloadType === 'JSON') {
          state = state.set('agentOldPayloadJSON', state.agentWebhook.webhookPayload);
        }
        state = state.setIn(['agentWebhook', 'webhookPayload'], state.agentOldPayloadXML);
      }
      return state
        .setIn(['agentWebhook', action.payload.field], action.payload.value)
        .set('agentTouched', true);

    case CHANGE_POST_FORMAT_DATA:
      return state
        .setIn(['agentPostFormat', action.payload.field], action.payload.value)
        .set('agentTouched', true);
    case CHANGE_AGENT_SETTINGS_DATA:
      return state
        .setIn(['agentSettings', action.payload.field], action.payload.value)
        .set('agentTouched', true);
    case ADD_AGENT_FALLBACK:
      return state.updateIn(['agent', 'fallbackResponses'], fallbackResponses => fallbackResponses.concat(action.newFallback))
        .set('agentTouched', true);
    case DELETE_AGENT_FALLBACK:
      return state.updateIn(['agent', 'fallbackResponses'], fallbackResponses => fallbackResponses.filter((item, index) => index !== action.fallbackIndex))
        .set('agentTouched', true);
    case ADD_AGENT:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case ADD_AGENT_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: There was an error creating your agent. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case ADD_AGENT_SUCCESS:
      state = state.update('notifications', notifications => notifications.concat({ message: `Notification: Congrats your agent <b>${action.agent.agentName}</b> was created! ${happyEmojies[Math.floor(Math.random() * happyEmojies.length)]}`, type: 'success' }));
      return state.set('agent', action.agent)
        .set('currentAgent', action.agent)
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('agentTouched', false)
        .set('successAgent', true);
    case UPDATE_AGENT:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_AGENT_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: There was an error updating your agent. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case UPDATE_AGENT_SUCCESS:
      return state.set('agent', action.agent)
        .set('currentAgent', action.agent)
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('agentTouched', false)
        .set('successAgent', true);
    case TRAIN_AGENT:
      return state.setIn(['agent', 'status'], 'Training')
        .set('error', false);
    case TRAIN_AGENT_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: ${action.error}. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.setIn(['agent', 'status'], 'Error')
        .set('error', action.error);
    case ADD_HEADER_AGENT_WEBHOOK:
      return state.updateIn(['agentWebhook', 'webhookHeaders'], webhookHeaders => webhookHeaders.concat(action.payload));
    case DELETE_HEADER_AGENT_WEBHOOK:
      return state.updateIn(['agentWebhook', 'webhookHeaders'], webhookHeaders => webhookHeaders.filter((item, index) => index !== action.headerIndex));
    case CHANGE_HEADER_KEY_AGENT_WEBHOOK:
      return state.updateIn(['agentWebhook', 'webhookHeaders'], webhookHeaders => webhookHeaders.map((header, index) => {
        if (index === action.headerIndex) {
          return header.set('key', action.value);
        }
        return header;
      }));
    case CHANGE_HEADER_VALUE_AGENT_WEBHOOK:
      return state.updateIn(['agentWebhook', 'webhookHeaders'], webhookHeaders => webhookHeaders.map((header, index) => {
        if (index === action.headerIndex) {
          return header.set('value', action.value);
        }
        return header;
      }));
    case ADD_AGENT_PARAMETER:
      return state.setIn(['agent', 'parameters', action.payload.name], action.payload.value).set('agentTouched', true);
    case DELETE_AGENT_PARAMETER:
      return state.setIn(['agent', 'parameters'], state.agent.parameters.without(action.parameterName)).set('agentTouched', true);
    case CHANGE_AGENT_PARAMETER_NAME:
      let mutableAgentParameters = Immutable.asMutable(state.agent.parameters, { deep: true });
      let jsonMutableAgentParameters = JSON.stringify(mutableAgentParameters);
      jsonMutableAgentParameters = jsonMutableAgentParameters.replace(`"${action.oldParameterName}":`, `"${action.newParameterName}":`);
      mutableAgentParameters = JSON.parse(jsonMutableAgentParameters);
      return state.setIn(['agent', 'parameters'], mutableAgentParameters).set('agentTouched', true);
    case CHANGE_AGENT_PARAMETER_VALUE:
      return state.setIn(['agent', 'parameters', action.parameterName], action.value).set('agentTouched', true);
    case LOAD_AGENT_DOCUMENTS_SUCCESS:
      return state.set('documents', action.documents.documents)
        .set('totalDocuments', action.documents.total)
        .set('loading', false)
        .set('error', false);
    case LOAD_AGENT_DOCUMENTS_ERROR:
      return state.set('documents', [])
        .set('loading', false)
        .set('error', action.error);
    /* Sayings */
    case LOAD_SAYINGS:
      return state.set('sayings', [])
        .set('totalSayings', 0)
        .set('loading', true)
        .set('error', false);
    case LOAD_SAYINGS_ERROR:
      return state.set('sayings', [])
        .set('totalSayings', 0)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_SAYINGS_SUCCESS:
      return state.set('sayings', action.sayings.sayings)
        .set('totalSayings', action.sayings.total)
        .set('loading', false)
        .set('error', false);
    case ADD_SAYING:
      return state.set('loading', true)
        .set('error', false);
    case ADD_SAYING_ERROR:
      return state.set('loading', false)
        .set('error', action.error);
    case DELETE_SAYING:
      return state.set('loading', true)
        .set('error', false);
    case DELETE_SAYING_ERROR:
      return state.set('loading', false)
        .set('error', action.error);
    case TAG_KEYWORD:
      return state.set('loading', true)
        .set('error', false);
    case UNTAG_KEYWORD:
      return state.set('loading', true)
        .set('error', false);
    case ADD_ACTION_SAYING:
      return state.set('loading', true)
        .set('error', false);
    case DELETE_ACTION_SAYING:
      return state.set('loading', true)
        .set('error', false);
    case ADD_ACTION_NEW_SAYING:
      return state.update('newSayingActions', newSayingActions => newSayingActions.concat(action.actionName));
    case DELETE_ACTION_NEW_SAYING:
      return state.update('newSayingActions', newSayingActions => newSayingActions.filter((item) => item !== action.actionName));
    case UPDATE_SAYING_ERROR:
      return state.set('loading', false)
        .set('error', action.error);
    case SEND_SAYING_TO_ACTION:
      return state.set('sayingForAction', action.saying);
    case CLEAR_SAYING_TO_ACTION:
      return state.set('sayingForAction', initialState.sayingForAction);
    case LOAD_CATEGORIES:
      return state.set('categories', [])
        .set('loading', true)
        .set('error', false);
    case LOAD_CATEGORIES_ERROR:
      return state.set('categories', [])
        .set('loading', false)
        .set('error', action.error);
    case LOAD_CATEGORIES_SUCCESS:
      return state.set('categories', action.categories.categories)
        .set('loading', false)
        .set('error', false);
    case LOAD_FILTERED_CATEGORIES:
      return state.set('filteredCategories', [])
        .set('loading', true)
        .set('error', false);
    case LOAD_FILTERED_CATEGORIES_ERROR:
      return state.set('filteredCategories', [])
        .set('loading', false)
        .set('error', action.error);
    case LOAD_FILTERED_CATEGORIES_SUCCESS:
      return state.set('filteredCategories', action.categories.categories)
        .set('loading', false)
        .set('error', false);
    case SELECT_CATEGORY:
      return state.set('selectedCategory', action.categoryName);

    /* Keywords */
    case LOAD_KEYWORDS:
      return state.set('keywords', [])
        .set('totalKeywords', 0)
        .set('loading', true)
        .set('error', false);
    case LOAD_KEYWORDS_ERROR:
      return state.set('keywords', [])
        .set('totalKeywords', 0)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_KEYWORDS_SUCCESS:
      return state.set('keywords', action.keywords.keywords)
        .set('totalKeywords', action.keywords.total)
        .set('loading', false)
        .set('error', false);

    /* Settings */
    case LOAD_SETTINGS:
      return state.set('loading', true)
        .set('error', false);
    case LOAD_SETTINGS_ERROR:
      return state.set('settings', initialState.settings)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_SETTINGS_SUCCESS:
      return state.set('settings', action.settings)
        .set('loading', false)
        .set('error', false);
    case UPDATE_SETTINGS:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_SETTINGS_ERROR:
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case UPDATE_SETTINGS_SUCCESS:
      return state.set('loading', false)
        .set('success', true)
        .set('error', false);
    case CHANGE_SETTINGS_DATA:
      return state
        .setIn(['settings', action.payload.field], action.payload.value)
        .set('settingsTouched', true);
    case ADD_FALLBACK:
      return state.updateIn(['settings', 'defaultAgentFallbackResponses'], defaultAgentFallbackResponses => defaultAgentFallbackResponses.concat(action.newFallback));
    case DELETE_FALLBACK:
      return state.updateIn(['settings', 'defaultAgentFallbackResponses'], defaultAgentFallbackResponses => defaultAgentFallbackResponses.filter((item, index) => index !== action.fallbackIndex));

    /* Actions */
    case RESET_ACTION_DATA:
      return state.set('action', initialState.action)
        .set('actionWebhook', initialState.actionWebhook)
        .set('actionPostFormat', initialState.actionPostFormat);
    case LOAD_ACTIONS:
      return state.set('actions', [])
        .set('totalActions', 0)
        .set('loading', true)
        .set('error', false);
    case LOAD_ACTIONS_ERROR:
      return state.set('actions', [])
        .set('totalActions', 0)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_ACTIONS_SUCCESS:
      return state.set('actions', action.actions.actions)
        .set('totalActions', action.actions.total)
        .set('loading', false)
        .set('error', false);
    case LOAD_ACTION:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_ACTION_ERROR:
      return state
        .set('action', initialState.action)
        .set('currentAction', initialState.currentAction)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_ACTION_SUCCESS:
      let actionWebhook, actionPostFormat;
      if (!action.payload.action.useWebhook) {
        actionWebhook = initialState.actionWebhook;
      } else {
        actionWebhook = action.payload.webhook;
      }
      if (!action.payload.action.usePostFormat) {
        actionPostFormat = initialState.actionPostFormat;
      } else {
        actionPostFormat = action.payload.postFormat;
      }
      return state
        .set('action', action.payload.action)
        .set('currentAction', action.payload.action)
        .set('actionSettings', action.payload.settings)
        .set('actionWebhook', actionWebhook)
        .set('actionPostFormat', actionPostFormat)
        .set('loading', false)
        .set('error', false)
        .set('actionTouched', false)
        .set('successAction', false);
    case CHANGE_ACTION_NAME:
      return state
        .setIn(['action', action.payload.field], action.payload.value)
        .set('actionTouched', true);
    case CHANGE_ACTION_DATA:
      return state.setIn(['action', action.payload.field], action.payload.value)
      .set('actionTouched', true);
    case ADD_ACTION_RESPONSE:
      return state.updateIn(['action', 'responses'], responses => responses.concat({ textResponse: action.newResponse, actions: [] }))
      .set('actionTouched', true);
    case DELETE_ACTION_RESPONSE:
      return state.updateIn(['action', 'responses'], responses => responses.filter((item, index) => index !== action.responseIndex))
      .set('actionTouched', true);
    case CHAIN_ACTION_TO_RESPONSE:
      return state.updateIn(['action', 'responses'], responses => responses.map((tempResponse, index) => {
        if (index === action.responseIndex) {
          return tempResponse.update('actions', actions => actions.concat(action.actionName));
        }
        return tempResponse;
      }))
      .set('actionTouched', true);
    case UNCHAIN_ACTION_FROM_RESPONSE:
      return state.updateIn(['action', 'responses'], responses => responses.map((tempResponse, index) => {
        if (index === action.responseIndex) {
          return tempResponse.update('actions', actions => actions.filter((item, index) => index !== action.actionIndex));
        }
        return tempResponse;
      }))
      .set('actionTouched', true);
    case CHANGE_ACTION_WEBHOOK_DATA:
      return state.setIn(['actionWebhook', action.payload.field], action.payload.value)
      .set('actionTouched', true);
    case CHANGE_ACTION_WEBHOOK_PAYLOAD_TYPE:
      if (action.payload.value === 'None') {
        if (state.actionWebhook.webhookPayloadType === 'JSON') {
          state = state.set('actionOldPayloadJSON', state.actionWebhook.webhookPayload);
        }
        if (state.actionWebhook.webhookPayloadType === 'XML') {
          state = state.set('actionOldPayloadXML', state.actionWebhook.webhookPayload);
        }
        return state
          .setIn(['actionWebhook', 'webhookPayload'], '')
          .setIn(['actionWebhook', action.payload.field], action.payload.value)
          .set('actionTouched', true);
      }

      if (action.payload.value === 'JSON' && state.actionWebhook.webhookPayloadType !== 'JSON') {
        if (state.actionWebhook.webhookPayloadType === 'XML') {
          state = state.set('actionOldPayloadXML', state.actionWebhook.webhookPayload);
        }
        state = state.setIn(['actionWebhook', 'webhookPayload'], state.actionOldPayloadJSON);
      }
      if (action.payload.value === 'XML' && state.actionWebhook.webhookPayloadType !== 'XML') {
        if (state.actionWebhook.webhookPayloadType === 'JSON') {
          state = state.set('actionOldPayloadJSON', state.actionWebhook.webhookPayload);
        }
        state = state.setIn(['actionWebhook', 'webhookPayload'], state.actionOldPayloadXML);
      }
      return state
        .setIn(['actionWebhook', action.payload.field], action.payload.value)
        .set('actionTouched', true);
    case CHANGE_ACTION_POST_FORMAT_DATA:
      return state
        .setIn(['actionPostFormat', action.payload.field], action.payload.value)
        .set('actionTouched', true);
    case ADD_ACTION:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case ADD_ACTION_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: There was an error creating your action. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case ADD_ACTION_SUCCESS:
      if (action.payload.addToNewSayingActions) {
        state = state.update('newSayingActions', newSayingActions => newSayingActions.concat(action.payload.action.actionName));
      }
      state = state.update('notifications', notifications => notifications.concat({ message: `Notification: Action <b>${action.payload.action.actionName}</b> created successfully. ${happyEmojies[Math.floor(Math.random() * happyEmojies.length)]}`, type: 'success' }));
      return state.set('action', action.payload.action)
        .set('currentAction', action.payload.action)
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('actionTouched', false)
        .set('successAction', true);
    case UPDATE_ACTION:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_ACTION_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: There was an error updating your action. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case UPDATE_ACTION_SUCCESS:
      state = state.update('notifications', notifications => notifications.concat({ message: `Notification: Action <b>${action.action.actionName}</b> updated successfully. ${happyEmojies[Math.floor(Math.random() * happyEmojies.length)]}`, type: 'success' }));
      return state.set('action', action.action)
        .set('currentAction', action.action)
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('actionTouched', false)
        .set('successAction', true);
    case DELETE_ACTION:
      state = state.update('newSayingActions', newSayingActions => newSayingActions.filter((item) => item !== action.actionName));
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case DELETE_ACTION_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: ${action.error}. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case DELETE_ACTION_SUCCESS:
      return state.set('action', initialState.action)
        .set('currentAction', initialState.currentAction)
        .set('actionWebhook', initialState.actionWebhook)
        .set('actionPostFormat', initialState.actionPostFormat)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case ADD_HEADER_ACTION_WEBHOOK:
      return state.updateIn(['actionWebhook', 'webhookHeaders'], webhookHeaders => webhookHeaders.concat(action.payload))
      .set('actionTouched', true);
    case DELETE_HEADER_ACTION_WEBHOOK:
      return state.updateIn(['actionWebhook', 'webhookHeaders'], webhookHeaders => webhookHeaders.filter((item, index) => index !== action.headerIndex))
      .set('actionTouched', true);
    case CHANGE_HEADER_KEY_ACTION_WEBHOOK:
      return state.updateIn(['actionWebhook', 'webhookHeaders'], webhookHeaders => webhookHeaders.map((header, index) => {
        if (index === action.headerIndex) {
          return header.set('key', action.value);
        }
        return header;
      }))
      .set('actionTouched', true);
    case CHANGE_HEADER_VALUE_ACTION_WEBHOOK:
      return state.updateIn(['actionWebhook', 'webhookHeaders'], webhookHeaders => webhookHeaders.map((header, index) => {
        if (index === action.headerIndex) {
          return header.set('value', action.value);
        }
        return header;
      }))
      .set('actionTouched', true);
    case ADD_NEW_SLOT:
      return state.updateIn(['action', 'slots'], slots => slots.concat(state.newSlot))
      .set('actionTouched', true);
    case CHANGE_SLOT_NAME:
      return state
        .updateIn(['action', 'slots'], slots =>
          slots.map((slot, index) => {
            if (index === action.payload.slotIndex) {
              const slotName = action.payload.slotName;
              return slot
                .set('slotName', slotName);
            }

            return slot;

          }),
        )
        .set('actionTouched', true);
    case CHANGE_SLOT_DATA:
      return state
        .updateIn(['action', 'slots'], slots =>
          slots.map((slot, index) => {
            if (index === action.payload.slotIndex) {
              return slot
                .set(action.payload.field, action.payload.value);
            }

            return slot;

          }),
        )
        .set('actionTouched', true);
    case ADD_SLOT_TEXT_PROMPT_SLOT:
      return state
        .updateIn(['action', 'slots'], slots =>
          slots.map((slot, index) => {
            if (index === action.payload.slotIndex) {
              return slot
                .update('textPrompts', textPrompts => textPrompts.concat(action.payload.newTextPrompt));
            }

            return slot;

          }),
        )
        .set('actionTouched', true);
    case DELETE_SLOT_TEXT_PROMPT_SLOT:
      return state
        .updateIn(['action', 'slots'], slots =>
          slots.map((slot, index) => {
            if (index === action.payload.slotIndex) {
              return slot
                .update('textPrompts', textPrompts => textPrompts.filter((item, index) => index !== action.payload.textPromptIndex));
            }

            return slot;

          }),
        )
        .set('actionTouched', true);
    case SORT_SLOTS:
      const tempSlots = Immutable.asMutable(state.action.slots, { deep: true });
      tempSlots.splice(action.newIndex, 0, tempSlots.splice(action.oldIndex, 1)[0]);
      return state
        .setIn(['action', 'slots'], Immutable(tempSlots))
        .set('actionTouched', true);
    case DELETE_SLOT:
      const oldSlots = Immutable.asMutable(state.action.slots, { deep: true });
      oldSlots.splice(action.slotIndex, 1);
      return state
        .setIn(['action', 'slots'], Immutable(oldSlots))
        .set('actionTouched', true);

    case ADD_NEW_MODIFIER:
      return state.updateIn(['keyword', 'modifiers'], modifiers => modifiers.concat(state.newModifier));
    case CHANGE_MODIFIER_NAME:
      return state
        .updateIn(['keyword', 'modifiers'], modifiers =>
          modifiers.map((modifier, index) => {
            if (index === action.payload.modifierIndex) {
              const modifierName = action.payload.modifierName;
              return modifier
                .set('modifierName', modifierName);
            }

            return modifier;

          }),
        )
        .set('keywordTouched', true);
    case CHANGE_MODIFIER_DATA:
      return state
        .updateIn(['keyword', 'modifiers'], modifiers =>
          modifiers.map((modifier, index) => {
            if (index === action.payload.modifierIndex) {
              return modifier
                .set(action.payload.field, action.payload.value);
            }

            return modifier;

          }),
        )
        .set('keywordTouched', true);
    case ADD_MODIFIER_SAYING:
      return state
        .updateIn(['keyword', 'modifiers'], modifiers =>
          modifiers.map((modifier, index) => {
            if (index === action.payload.modifierIndex) {
              return modifier
                .update('sayings', sayings => sayings.concat({
                  userSays: action.payload.newSaying,
                  keywords: [],
                }));
            }

            return modifier;

          }),
        )
        .set('keywordTouched', true);
    case DELETE_MODIFIER_SAYING:
      return state
        .updateIn(['keyword', 'modifiers'], modifiers =>
          modifiers.map((modifier, index) => {
            if (index === action.payload.modifierIndex) {
              return modifier
                .update('sayings', sayings => sayings.filter((item, index) => index !== action.payload.sayingIndex));
            }

            return modifier;

          }),
        )
        .set('keywordTouched', true);
    case SORT_MODIFIERS:
      const tempModifiers = Immutable.asMutable(state.keyword.modifiers, { deep: true });
      tempModifiers.splice(action.newIndex, 0, tempModifiers.splice(action.oldIndex, 1)[0]);
      return state
        .setIn(['keyword', 'modifiers'], Immutable(tempModifiers));
    case DELETE_MODIFIER:
      const oldModifiers = Immutable.asMutable(state.keyword.modifiers, { deep: true });
      oldModifiers.splice(action.modifierIndex, 1);
      return state
        .setIn(['keyword', 'modifiers'], Immutable(oldModifiers));
    case TAG_MODIFIER_KEYWORD:
      const keywordToAdd = {
        value: action.value,
        keyword: action.keywordName,
        start: action.start,
        end: action.end,
        keywordId: action.keywordId,
      }
      return state
        .updateIn(['keyword', 'modifiers'], modifiers =>
          modifiers.map((modifier, index) => {
            if (index === action.modifierIndex) {
              return modifier
                .update('sayings', sayings => sayings.map((saying, index) => {
                  if (index === action.sayingIndex){
                    return saying.update('keywords', keywords => keywords.concat(keywordToAdd));
                  }
                  return saying;
                }));
            }
            return modifier;

          }),
        )
        .set('keywordTouched', true);
    case UNTAG_MODIFIER_KEYWORD:
      return state
        .updateIn(['keyword', 'modifiers'], modifiers =>
          modifiers.map((modifier, modifierIndex) => {
            if (modifierIndex === action.modifierIndex) {
              return modifier
                .update('sayings', sayings => sayings.map((saying, sayingIndex) => {
                  if (sayingIndex === action.sayingIndex){
                    return saying.update('keywords', keywords => keywords.filter((keyword) => {
                      return keyword.start !== action.start || keyword.end !== action.end
                    }));
                  }
                  return saying;
                }));
            }
            return modifier;
          }),
        )
        .set('keywordTouched', true);

    /* Keyword */
    case CHANGE_KEYWORD_DATA:
      return state.setIn(['keyword', action.payload.field], action.payload.value)
      .set('keywordTouched', true);
    case CREATE_KEYWORD:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case CREATE_KEYWORD_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: There was an error creating your keyword. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case CREATE_KEYWORD_SUCCESS:
      state = state.update('notifications', notifications => notifications.concat({ message: `Notification: Keyword <b>${action.keyword.keywordName}<b> created successfully. ${happyEmojies[Math.floor(Math.random() * happyEmojies.length)]}`, type: 'success' }));
      return state.set('keyword', action.keyword)
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('successKeyword', true)
        .set('keywordTouched', false);
    case RESET_KEYWORD_DATA:
      return state.set('keyword', initialState.keyword);
    case UPDATE_KEYWORD:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_KEYWORD_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: There was an error updating your keyword. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.set('loading', false)
        .set('successKeyword', false)
        .set('error', action.error);
    case UPDATE_KEYWORD_SUCCESS:
      return state.set('keyword', action.keyword)
        .set('loading', false)
        .set('error', false)
        .set('successKeyword', true)
        .set('keywordTouched', false);
    case ADD_KEYWORD_EXAMPLE:
      return state.updateIn(['keyword', 'examples'], examples => examples.concat(action.newExample))
      .set('keywordTouched', true);
    case DELETE_KEYWORD_EXAMPLE:
      return state.updateIn(['keyword', 'examples'], examples => examples.filter((item, index) => index !== action.exampleIndex))
      .set('keywordTouched', true);
    case CHANGE_EXAMPLE_SYNONYMS:
      return state.updateIn(['keyword', 'examples'], examples => examples.map((example, index) => {
        if (index === action.exampleIndex) {
          return example.set('synonyms', action.synonyms);
        }
        return example;
      }))
      .set('keywordTouched', true);
    case CHANGE_EXAMPLE_NAME:
      return state.updateIn(['keyword', 'examples'], examples => examples.map((example, index) => {
        if (index === action.exampleIndex) {
          return example.set('value', action.name);
        }
        return example;
      }))
      .set('keywordTouched', true);
    case LOAD_KEYWORD:
      return state.set('keyword', initialState.keyword)
        .set('loading', true)
        .set('error', false)
        .set('keywordTouched', false)
        .set('successKeyword', false);
    case LOAD_KEYWORD_ERROR:
      return state.set('keyword', initialState.keyword)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_KEYWORD_SUCCESS:
      return state.set('keyword', action.keyword)
        .set('loading', false)
        .set('error', false)
    case DELETE_KEYWORD:
      return state.set('loading', true)
        .set('error', false);
    case DELETE_KEYWORD_SUCCESS:
      return state.set('keyword', initialState.keyword)
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('keywordTouched', false);;
    case DELETE_KEYWORD_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: ${action.error}. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.set('loading', false)
        .set('error', action.error);

    /* Category */
    case LOAD_CATEGORY:
      return state.set('category', initialState.category)
        .set('loading', true)
        .set('error', false)
        .set('successCategory', false)
        .set('categoryTouched', false);
    case LOAD_CATEGORY_ERROR:
      return state.set('category', initialState.category)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_CATEGORY_SUCCESS:
      return state.set('category', action.category)
        .set('loading', false)
        .set('error', false);
    case CHANGE_CATEGORY_DATA:
      return state.setIn(['category', action.payload.field], action.payload.value)
      .set('categoryTouched', true);
    case CREATE_CATEGORY:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case CREATE_CATEGORY_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: There was an error creating your category. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case CREATE_CATEGORY_SUCCESS:
      state = state.update('notifications', notifications => notifications.concat({ message: `Notification: Category <b>${action.category.categoryName}</b> created successfully. ${happyEmojies[Math.floor(Math.random() * happyEmojies.length)]}`, type: 'success' }));
      return state.set('category', action.category)
        .set('selectedCategory', action.category.id)
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('successCategory', true)
        .set('categoryTouched', false);
    case RESET_CATEGORY_DATA:
      return state.set('category', initialState.category);
    case UPDATE_CATEGORY:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_CATEGORY_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: There was an error updating your category. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error)
        .set('successCategory', false);
    case UPDATE_CATEGORY_SUCCESS:
      return state.set('category', action.category)
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('successCategory', true)
        .set('categoryTouched', false);
    case DELETE_CATEGORY:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case DELETE_CATEGORY_ERROR:
      state = state.update('notifications', notifications => notifications.concat({ message: `Error: ${action.error}. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }));
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case DELETE_CATEGORY_SUCCESS:
      return state.set('category', initialState.category)
        .set('categories', initialState.categories)
        .set('filteredCategories', initialState.filteredCategories)
        .set('selectedCategory', initialState.selectedCategory)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case ADD_CATEGORY_PARAMETER:
      return state.setIn(['category', 'parameters', action.payload.name], action.payload.value)
      .set('categoryTouched', true);
    case DELETE_CATEGORY_PARAMETER:
      return state.setIn(['category', 'parameters'], state.category.parameters.without(action.parameterName))
      .set('categoryTouched', true);
    case CHANGE_CATEGORY_PARAMETER_NAME:
      let mutableCategoryParameters = Immutable.asMutable(state.category.parameters, { deep: true });
      let jsonMutableCategoryParameters = JSON.stringify(mutableCategoryParameters);
      jsonMutableCategoryParameters = jsonMutableCategoryParameters.replace(`"${action.oldParameterName}":`, `"${action.newParameterName}":`);
      mutableCategoryParameters = JSON.parse(jsonMutableCategoryParameters);
      return state.setIn(['category', 'parameters'], mutableCategoryParameters)
      .set('categoryTouched', true);
    case CHANGE_CATEGORY_PARAMETER_VALUE:
      return state.setIn(['category', 'parameters', action.parameterName], action.value)
      .set('categoryTouched', true);

    /* Review */
    case COPY_SAYING_ERROR:
      return state
        .update('notifications', notifications => notifications.concat({ message: `Error: There was an error copying the utterance into your sayings. ${errorEmojies[Math.floor(Math.random() * errorEmojies.length)]}`, type: 'error' }))
        .set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case COPY_SAYING_SUCCESS:
      return state
        .update('notifications', notifications => notifications.concat({ message: `Notification: The saying <b>${action.saying.userSays}</b> was created successfully. ${happyEmojies[Math.floor(Math.random() * happyEmojies.length)]}`, type: 'success' }))
        .set('loading', false)
        .set('success', false);
    default:
      return state;
  }
}

export default appReducer;
