import Immutable from 'seamless-immutable';
import {
  RESET_MISSING_API,
  MISSING_API,
  CHECK_API,
  RESET_STATUS_FLAGS,

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
  ADD_ACTION,
  DELETE_ACTION,

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
} from './constants';

// The initial state of the App
const initialState = Immutable({
  agents: [],
  currentAgent: {
      agentName: '',
      description: '',
      language: 'en',
      timezone: 'UTC',
      useWebhook: false,
      usePostFormat: false,
      extraTrainingData: false,
      enableModelsPerDomain: false,
      multiDomain: false,
      fallbackResponses: [],
      domainClassifierThreshold: 50,
  },
  agent: {
      agentName: '',
      description: '',
      language: 'en',
      timezone: 'UTC',
      useWebhook: false,
      usePostFormat: false,
      extraTrainingData: false,
      enableModelsPerDomain: false,
      multiDomain: false,
      fallbackResponses: [],
      domainClassifierThreshold: 50,
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
    postFormatPayload: '{\n\t"textResponse" : "{{ textResponse }}"\n}'
  },
  agentSettings: {
    rasaURL: '',
    ducklingURL: '',
    ducklingDimension: '[]',
    spacyPretrainedEntities: '[]',
    domainClassifierPipeline: '[]',
    intentClassifierPipeline: '[]',
    entityClassifierPipeline: '[]',
  },
  keyword: {
      id: 2,
      type: 'learned',
      regex: '',
      agent: 'Pizza Agent',
      uiColor: '#e91e63',
      keywordName: 'Toppings',
      examples: [
      {
          value: 'Mushrooms',
          synonyms: [
          'Mushrooms'
          ]
      },
      {
          value: 'Onions',
          synonyms: [
          'Onions'
          ]
      },
      {
          value: 'peppers',
          synonyms: [
          'peppers'
          ]
      },
      {
          value: 'pepperoni',
          synonyms: [
          'pepperoni'
          ]
      },
      {
          value: 'olives',
          synonyms: [
          'olives'
          ]
      },
      {
          value: 'chicken',
          synonyms: [
          'chicken'
          ]
      },
      {
          value: 'meat',
          synonyms: [
          'meat'
          ]
      },
      {
          value: 'ham',
          synonyms: [
          'ham',
          'canadian bacon'
          ]
      }
      ]
  },
  keywords: [],
  totalKeywords: 0,
  sayings: [],
  totalSayings: 0,
  agentOldPayloadJSON: '{\n\t"text": "{{text}}",\n\t"action": {{{JSONstringify action}}},\n\t"slots": {{{JSONstringify slots}}}\n}',
  agentOldPayloadXML: '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n\t<text>{{text}}</text>\n\t<action>{{{toXML action}}}</action>\n\t<slots>{{{toXML slots}}}</slots>\n</data>',
  agentTouched: false,
  missingAPI: false,
  action: {
    id: 129,
    agent: 'Pizza Agent',
    domain: 'Orders',
    actionName: 'Order pizza',
    useWebhook: false,
    usePostFormat: false,
    slots: [
      {
        uiColor: '#f44336',
        keyword: 'Toppings',
        isList: true,
        slotName: 'Toppings',
        isRequired: true,
        textPrompts: [
          'What toppings would you like?'
        ]
      }
    ],
    responses: [
      'Sure we will prepare your pizza with {{andList slots.Toppings.original}}'
    ]
  },
  actionWebhook: {
    agent: '',
    domain: '',
    webhookUrl: '',
    webhookVerb: 'GET',
    webhookPayloadType: 'None',
    webhookPayload: ''
  },
  actionPostFormat: {
    agent: '',
    domain: '',
    postFormatPayload: ''
  },
  actionOldPayloadJSON: "{\n\t'text': '{{text}}',\n\t'action': {{{JSONstringify action}}},\n\t'slots': {{{JSONstringify slots}}}\n}",
  actionOldPayloadXML: "<?xml version='1.0' encoding='UTF-8'?>\n<data>\n\t<text>{{text}}</text>\n\t<action>{{{toXML action}}}</action>\n\t<slots>{{{toXML slots}}}</slots>\n</data>",
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
    domainClassifierPipeline: [],
    intentClassifierPipeline: [],
    entityClassifierPipeline: [],
    defaultAgentFallbackResponses: []
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

    /* Agents */
    case LOAD_AGENTS:
      return state.set('agents', [])
        .set('loading', true)
        .set('error', false);
    case LOAD_AGENTS_ERROR:
      return state.set('agents', [])
        .set('loading', false)
        .set('error', action.error);
    case LOAD_AGENTS_SUCCESS:
      return state.set('agents', action.agents)
        .set('loading', false)
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
        .set('agentSettings', action.payload.settings)
        .set('agentWebhook', agentWebhook)
        .set('agentPostFormat', agentPostFormat)
        .set('loading', false)
        .set('error', false);
    case CHANGE_AGENT_NAME:
      return state
        .setIn(['agent', action.payload.field], action.payload.value)
        .setIn(['agentWebhook', 'agent'], action.payload.value)
        .setIn(['agentPostFormat', 'agent'], action.payload.value)
        .set('agentTouched', true);;
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
      else {
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
      }
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
    case ADD_ACTION:
      return state.set('loading', true)
        .set('error', false);
    case DELETE_ACTION:
      return state.set('loading', true)
        .set('error', false);
    case UPDATE_SAYING_ERROR:
      return state.set('loading', false)
        .set('error', action.error);

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

    default:
      return state;
  }
}

export default appReducer;
