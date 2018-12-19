import Immutable from 'seamless-immutable';
import {
  RESET_MISSING_API,
  MISSING_API,
  CHECK_API,
  RESET_STATUS_FLAGS,
  TOGGLE_CONVERSATION_BAR,
  CLOSE_NOTIFICATION,
  SEND_MESSAGE,
  RESPOND_MESSAGE,
  RESET_SESSION_SUCCESS,
  LOAD_DOC,
  LOAD_DOC_ERROR,
  LOAD_DOC_SUCCESS,

  LOAD_AGENTS,
  LOAD_AGENTS_ERROR,
  LOAD_AGENTS_SUCCESS,
  ADD_AGENT,
  ADD_AGENT_ERROR,
  ADD_AGENT_SUCCESS,
  UPDATE_AGENT,
  UPDATE_AGENT_ERROR,
  UPDATE_AGENT_SUCCESS,
  DELETE_AGENT,
  DELETE_AGENT_ERROR,
  DELETE_AGENT_SUCCESS,

  RESET_AGENT_DATA,
  LOAD_AGENT,
  LOAD_AGENT_ERROR,
  LOAD_AGENT_SUCCESS,
  CHANGE_AGENT_DATA,
  CHANGE_AGENT_NAME,
  CHANGE_WEBHOOK_DATA,
  CHANGE_WEBHOOK_PAYLOAD_TYPE,
  CHANGE_POST_FORMAT_DATA,
  CHANGE_AGENT_SETTINGS_DATA,
  ADD_AGENT_FALLBACK,
  DELETE_AGENT_FALLBACK,
  TRAIN_AGENT,
  TRAIN_AGENT_ERROR,

  LOAD_SAYINGS,
  LOAD_SAYINGS_ERROR,
  LOAD_SAYINGS_SUCCESS,
  ADD_SAYING,
  ADD_SAYING_ERROR,
  DELETE_SAYING,
  DELETE_SAYING_ERROR,
  TAG_KEYWORD,
  UNTAG_KEYWORD,
  UPDATE_SAYING_ERROR,
  ADD_ACTION_SAYING,
  DELETE_ACTION_SAYING,
  ADD_ACTION_NEW_SAYING,
  DELETE_ACTION_NEW_SAYING,
  SEND_SAYING_TO_ACTION,
  CLEAR_SAYING_TO_ACTION,
  LOAD_CATEGORIES,
  LOAD_CATEGORIES_ERROR,
  LOAD_CATEGORIES_SUCCESS,
  LOAD_FILTERED_CATEGORIES,
  LOAD_FILTERED_CATEGORIES_ERROR,
  LOAD_FILTERED_CATEGORIES_SUCCESS,
  SELECT_CATEGORY,

  LOAD_KEYWORDS,
  LOAD_KEYWORDS_ERROR,
  LOAD_KEYWORDS_SUCCESS,
  DELETE_KEYWORD,
  DELETE_KEYWORD_ERROR,

  LOAD_SETTINGS,
  LOAD_SETTINGS_ERROR,
  LOAD_SETTINGS_SUCCESS,
  UPDATE_SETTINGS,
  UPDATE_SETTINGS_ERROR,
  UPDATE_SETTINGS_SUCCESS,
  CHANGE_SETTINGS_DATA,
  ADD_FALLBACK,
  DELETE_FALLBACK,

  RESET_ACTION_DATA,
  LOAD_ACTIONS,
  LOAD_ACTIONS_ERROR,
  LOAD_ACTIONS_SUCCESS,
  LOAD_ACTION,
  LOAD_ACTION_ERROR,
  LOAD_ACTION_SUCCESS,
  CHANGE_ACTION_NAME,
  CHANGE_ACTION_DATA,
  ADD_NEW_SLOT,
  ADD_ACTION_RESPONSE,
  DELETE_ACTION_RESPONSE,
  CHANGE_SLOT_NAME,
  CHANGE_SLOT_DATA,
  ADD_SLOT_TEXT_PROMPT_SLOT,
  DELETE_SLOT_TEXT_PROMPT_SLOT,
  CHANGE_ACTION_WEBHOOK_DATA,
  CHANGE_ACTION_WEBHOOK_PAYLOAD_TYPE,
  CHANGE_ACTION_POST_FORMAT_DATA,
  ADD_ACTION,
  ADD_ACTION_ERROR,
  ADD_ACTION_SUCCESS,
  UPDATE_ACTION,
  UPDATE_ACTION_ERROR,
  UPDATE_ACTION_SUCCESS,
  DELETE_ACTION,
  DELETE_ACTION_ERROR,
  DELETE_ACTION_SUCCESS,

  LOAD_KEYWORD,
  LOAD_KEYWORD_ERROR,
  LOAD_KEYWORD_SUCCESS,
  CHANGE_KEYWORD_DATA,
  CREATE_KEYWORD,
  CREATE_KEYWORD_ERROR,
  CREATE_KEYWORD_SUCCESS,
  RESET_KEYWORD_DATA,
  UPDATE_KEYWORD,
  UPDATE_KEYWORD_ERROR,
  UPDATE_KEYWORD_SUCCESS,
  ADD_KEYWORD_EXAMPLE,
  DELETE_KEYWORD_EXAMPLE,
  CHANGE_EXAMPLE_SYNONYMS,
  CHANGE_EXAMPLE_NAME,

  LOAD_CATEGORY,
  LOAD_CATEGORY_ERROR,
  LOAD_CATEGORY_SUCCESS,
  CHANGE_CATEGORY_DATA,
  CREATE_CATEGORY,
  CREATE_CATEGORY_ERROR,
  CREATE_CATEGORY_SUCCESS,
  RESET_CATEGORY_DATA,
  UPDATE_CATEGORY,
  UPDATE_CATEGORY_ERROR,
  UPDATE_CATEGORY_SUCCESS,
  CHAIN_ACTION_TO_RESPONSE,
  UNCHAIN_ACTION_FROM_RESPONSE,
} from './constants';

const happyEmojies = ['😀','😁','😃','😄','😉','😎','🙂','🤩','😛','😜','🙃','😬','🤓','😺','😸','💪','🤙','👌','👍','🤚','👏','🙌','🎖','🏆','🏅','🥇','🎉','🎊'];

// The initial state of the App
const initialState = Immutable({
  conversationBarOpen: false,
  waitingResponse: false,
  notifications: [
    'Notification: Congrats on your very first Agent Samson! 🤗 🥇',
  ],
  messages: [],
  category: {
    categoryName: '',
    enabled: true,
    actionThreshold: 50,
    extraTrainingData: false,
  },
  doc: {},
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
    fallbackResponses: [],
    categoryClassifierThreshold: 50,
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
    fallbackResponses: [],
    categoryClassifierThreshold: 50,
  },
  agentWebhook: {
    agent: '',
    webhookUrl: '',
    webhookVerb: 'GET',
    webhookPayloadType: 'None',
    webhookPayload: '',
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
  },
  keywords: [],
  totalKeywords: 0,
  selectedCategory: '',
  sayings: [],
  totalSayings: 0,
  agentOldPayloadJSON: '{\n\t"text": "{{text}}",\n\t"action": {{{JSONstringify action}}},\n\t"slots": {{{JSONstringify slots}}}\n}',
  agentOldPayloadXML: '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n\t<text>{{text}}</text>\n\t<action>{{{toXML action}}}</action>\n\t<slots>{{{toXML slots}}}</slots>\n</data>',
  agentTouched: false,
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
  },
  actionPostFormat: {
    postFormatPayload: '{\n\t"textResponse" : "{{ textResponse }}",\n\t"docId" : "{{ docId }}"\n}',
  },
  actionOldPayloadJSON: '{\n\t"text": "{{text}}",\n\t"action": {{{JSONstringify action}}},\n\t"slots": {{{JSONstringify slots}}}\n}',
  actionOldPayloadXML: "<?xml version='1.0' encoding='UTF-8'?>\n<data>\n\t<text>{{text}}</text>\n\t<action>{{{toXML action}}}</action>\n\t<slots>{{{toXML slots}}}</slots>\n</data>",
  actions: [],
  newSayingActions: [],
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
    case RESET_SESSION_SUCCESS:
      return state.set('messages', [])
        .set('notifications', []);
    case LOAD_DOC:
      return state.set('doc', initialState.doc)
        .set('loading', true)
        .set('error', false);
    case LOAD_DOC_ERROR:
      return state.set('doc', initialState.doc)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_DOC_SUCCESS:
      return state.set('doc', action.doc)
        .set('loading', false)
        .set('error', false);

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
        .set('agentSettings', initialState.agentSettings);
    case LOAD_AGENT:
      return state
        .set('loading', true)
        .set('error', false);
    case LOAD_AGENT_ERROR:
      return state
        .set('agent', initialState.agent)
        .set('currentAgent', initialState.currentAgent)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_AGENT_SUCCESS:
      let agentWebhook, agentPostFormat;
      if (!action.payload.agent.useWebhook){
        agentWebhook = initialState.agentWebhook;
        agentWebhook = agentWebhook.set('agent', action.payload.agent.agentName);
      }
      else {
        agentWebhook = action.payload.webhook;
      }
      if (!action.payload.agent.usePostFormat){
        agentPostFormat = initialState.agentPostFormat;
        agentPostFormat = agentPostFormat.set('agent', action.payload.agent.agentName);
      }
      else {
        agentPostFormat = action.payload.postFormat;
      }
      return state
        .set('agent', action.payload.agent)
        .set('currentAgent', action.payload.agent)
        .set('agentSettings', action.payload.agent.settings)
        .set('agentWebhook', agentWebhook)
        .set('agentPostFormat', agentPostFormat)
        .set('loading', false)
        .set('error', false);
    case CHANGE_AGENT_NAME:
      return state
        .setIn(['agent', action.payload.field], action.payload.value)
        .setIn(['agentWebhook', 'agent'], action.payload.value)
        .setIn(['agentPostFormat', 'agent'], action.payload.value)
        .set('agentTouched', true);
    case CHANGE_AGENT_DATA:
      return state.setIn(['agent', action.payload.field], action.payload.value);
    case CHANGE_WEBHOOK_DATA:
      return state.setIn(['agentWebhook', action.payload.field], action.payload.value);
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
      return state.updateIn(['agent', 'fallbackResponses'], fallbackResponses => fallbackResponses.concat(action.newFallback));
    case DELETE_AGENT_FALLBACK:
      return state.updateIn(['agent', 'fallbackResponses'], fallbackResponses => fallbackResponses.filter((item, index) => index !== action.fallbackIndex));
    case ADD_AGENT:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case ADD_AGENT_ERROR:
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case ADD_AGENT_SUCCESS:
      return state.set('agent', action.agent)
        .set('currentAgent', action.agent)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case UPDATE_AGENT:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_AGENT_ERROR:
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case UPDATE_AGENT_SUCCESS:
      return state.set('agent', action.agent)
        .set('currentAgent', action.agent)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case TRAIN_AGENT:
      return state.setIn(['agent', 'status'], 'Training')
        .set('error', false);
    case TRAIN_AGENT_ERROR:
      return state.setIn(['agent', 'status'], 'Error')
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
    case DELETE_KEYWORD:
      return state.set('loading', true)
        .set('error', false);
    case DELETE_KEYWORD_ERROR:
      return state.set('loading', false)
        .set('error', action.error);

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
      if (!action.payload.action.useWebhook){
        actionWebhook = initialState.actionWebhook;
      }
      else {
        actionWebhook = action.payload.webhook;
      }
      if (!action.payload.action.usePostFormat){
        actionPostFormat = initialState.actionPostFormat;
      }
      else {
        actionPostFormat = action.payload.postFormat;
      }
      return state
        .set('action', action.payload.action)
        .set('currentAction', action.payload.action)
        .set('actionSettings', action.payload.settings)
        .set('actionWebhook', actionWebhook)
        .set('actionPostFormat', actionPostFormat)
        .set('loading', false)
        .set('error', false);
    case CHANGE_ACTION_NAME:
      return state
        .setIn(['action', action.payload.field], action.payload.value)
        .set('actionTouched', true);
    case CHANGE_ACTION_DATA:
      return state.setIn(['action', action.payload.field], action.payload.value);
    case ADD_NEW_SLOT:
      return state.updateIn(['action', 'slots'], slots => slots.concat(state.newSlot));
    case ADD_ACTION_RESPONSE:
      return state.updateIn(['action', 'responses'], responses => responses.concat({ textResponse: action.newResponse, actions: [] }));
    case DELETE_ACTION_RESPONSE:
      return state.updateIn(['action', 'responses'], responses => responses.filter((item, index) => index !== action.responseIndex));
    case CHAIN_ACTION_TO_RESPONSE:
      return state.updateIn(['action', 'responses'], responses => responses.map((tempResponse, index) => {
        if (index === action.responseIndex){
          return tempResponse.update('actions', actions => actions.concat(action.actionName));
        }
        return tempResponse;
      }));
    case UNCHAIN_ACTION_FROM_RESPONSE:
      return state.updateIn(['action', 'responses'], responses => responses.map((tempResponse, index) => {
        if (index === action.responseIndex){
          return tempResponse.update('actions', actions => actions.filter((item, index) => index !== action.actionIndex));
        }
        return tempResponse;
      }));
    case CHANGE_SLOT_NAME:
      return state
        .updateIn(['action', 'slots'], slots =>
          slots.map((slot, index) => {
            if (index === action.payload.slotIndex){
              const slotName = action.payload.slotName;
              return slot
                .set('slotName', slotName);
            }

            return slot;

          })
        )
        .set('actionTouched', true);
    case CHANGE_SLOT_DATA:
      return state
        .updateIn(['action', 'slots'], slots =>
          slots.map((slot, index) => {
            if (index === action.payload.slotIndex){
              return slot
                .set(action.payload.field, action.payload.value);
            }

            return slot;

          })
        )
        .set('actionTouched', true);
    case ADD_SLOT_TEXT_PROMPT_SLOT:
      return state
        .updateIn(['action', 'slots'], slots =>
          slots.map((slot, index) => {
            if (index === action.payload.slotIndex){
              return slot
                .update('textPrompts', textPrompts => textPrompts.concat(action.payload.newTextPrompt));
            }

            return slot;

          })
        )
        .set('actionTouched', true);
    case DELETE_SLOT_TEXT_PROMPT_SLOT:
      return state
        .updateIn(['action', 'slots'], slots =>
          slots.map((slot, index) => {
            if (index === action.payload.slotIndex){
              return slot
                .update('textPrompts', textPrompts => textPrompts.filter((item, index) => index !== action.payload.textPromptIndex));
            }

            return slot;

          })
        )
        .set('actionTouched', true);
    case CHANGE_ACTION_WEBHOOK_DATA:
      return state.setIn(['actionWebhook', action.payload.field], action.payload.value);
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
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case ADD_ACTION_SUCCESS:
      if (action.payload.addToNewSayingActions){
        state = state.update('newSayingActions', newSayingActions => newSayingActions.concat(action.payload.action.actionName));
      }
      state = state.update('notifications', notifications => notifications.concat(`Notification: Action ${action.payload.action.actionName} created successfully${happyEmojies[Math.floor(Math.random() * happyEmojies.length)]}`));
      return state.set('action', action.payload.action)
        .set('currentAction', action.payload.action)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case UPDATE_ACTION:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_ACTION_ERROR:
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case UPDATE_ACTION_SUCCESS:
      return state.set('action', action.action)
        .set('currentAction', action.action)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case DELETE_ACTION:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case DELETE_ACTION_ERROR:
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

    /* Keyword */
    case CHANGE_KEYWORD_DATA:
      return state.setIn(['keyword', action.payload.field], action.payload.value);
    case CREATE_KEYWORD:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case CREATE_KEYWORD_ERROR:
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case CREATE_KEYWORD_SUCCESS:
      return state.set('keyword', action.keyword)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case RESET_KEYWORD_DATA:
      return state.set('keyword', initialState.keyword);
    case UPDATE_KEYWORD:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_KEYWORD_ERROR:
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case UPDATE_KEYWORD_SUCCESS:
      return state.set('keyword', action.keyword)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case ADD_KEYWORD_EXAMPLE:
      return state.updateIn(['keyword', 'examples'], examples => examples.concat(action.newExample));
    case DELETE_KEYWORD_EXAMPLE:
      return state.updateIn(['keyword', 'examples'], examples => examples.filter((item, index) => index !== action.exampleIndex));
    case CHANGE_EXAMPLE_SYNONYMS:
      return state.updateIn(['keyword', 'examples'], examples => examples.map((example, index) => {
        if(index === action.exampleIndex){
          return example.set('synonyms', action.synonyms);
        }
        return example;
      }));
    case CHANGE_EXAMPLE_NAME:
      return state.updateIn(['keyword', 'examples'], examples => examples.map((example, index) => {
        if(index === action.exampleIndex){
          return example.set('value', action.name);
        }
        return example;
      }));
    case LOAD_KEYWORD:
      return state.set('keyword', initialState.keyword)
        .set('loading', true)
        .set('error', false);
    case LOAD_KEYWORD_ERROR:
      return state.set('keyword', initialState.keyword)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_KEYWORD_SUCCESS:
      return state.set('keyword', action.keyword)
        .set('loading', false)
        .set('error', false);

    /* Category */
    case LOAD_CATEGORY:
      return state.set('category', initialState.category)
        .set('loading', true)
        .set('error', false);
    case LOAD_CATEGORY_ERROR:
      return state.set('category', initialState.category)
        .set('loading', false)
        .set('error', action.error);
    case LOAD_CATEGORY_SUCCESS:
      return state.set('category', action.category)
        .set('loading', false)
        .set('error', false);
    case CHANGE_CATEGORY_DATA:
      return state.setIn(['category', action.payload.field], action.payload.value);
    case CREATE_CATEGORY:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case CREATE_CATEGORY_ERROR:
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case CREATE_CATEGORY_SUCCESS:
      state = state.update('notifications', notifications => notifications.concat(`Notification: Category ${action.category.categoryName} created successfully${happyEmojies[Math.floor(Math.random() * happyEmojies.length)]}`));
      return state.set('category', action.category)
        .set('selectedCategory', action.category.id)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case RESET_CATEGORY_DATA:
      return state.set('category', initialState.category);
    case UPDATE_CATEGORY:
      return state.set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_CATEGORY_ERROR:
      return state.set('loading', false)
        .set('success', false)
        .set('error', action.error);
    case UPDATE_CATEGORY_SUCCESS:
      return state.set('category', action.category)
        .set('loading', false)
        .set('success', true)
        .set('error', false);

    default:
      return state;
  }
}

export default appReducer;
