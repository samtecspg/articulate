/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

/*
 * Global
 */
export const MISSING_API = 'app/App/MISSING_API';
export const RESET_MISSING_API = 'app/App/RESET_MISSING_API';
export const CHECK_API = 'app/App/CHECK_API';
export const RESET_STATUS_FLAGS = 'app/App/RESET_STATUS_FLAGS';
export const TOGGLE_CONVERSATION_BAR = 'app/App/TOGGLE_CONVERSATION_BAR';
export const TOGGLE_CHAT_BUTTON = 'app/App/TOGGLE_CHAT_BUTTON';
export const CLOSE_NOTIFICATION = 'app/App/CLOSE_NOTIFICATION';
export const SEND_MESSAGE = 'app/App/SEND_MESSAGE';
export const RESPOND_MESSAGE = 'app/App/RESPOND_MESSAGE';
export const STORE_SOURCE_DATA = 'app/App/STORE_SOURCE_DATA';
export const RESET_SESSION = 'app/App/RESET_SESSION';
export const RESET_SESSION_SUCCESS = 'app/App/RESET_SESSION_SUCCESS';
export const LOAD_SESSION = 'app/App/LOAD_SESSION';
export const LOAD_SESSION_SUCCESS = 'app/App/LOAD_SESSION_SUCCESS';
export const LOAD_SESSION_ERROR = 'app/App/LOAD_SESSION_ERROR';
export const DELETE_SESSION = 'app/App/DELETE_SESSION';
export const DELETE_SESSION_SUCCESS = 'app/App/DELETE_SESSION_SUCCESS';
export const DELETE_SESSION_ERROR = 'app/App/DELETE_SESSION_ERROR';
export const SHOW_WARNING = 'app/App/SHOW_WARNING';
export const REFRESH_SERVER_INFO = 'app/App/REFRESH_SERVER_INFO';
export const LOAD_SERVER_INFO = 'app/App/LOAD_SERVER_INFO';
export const LOAD_SERVER_INFO_ERROR = 'app/App/LOAD_SERVER_INFO_ERROR';
export const LOAD_SERVER_INFO_SUCCESS = 'app/App/LOAD_SERVER_INFO_SUCCESS';

/*
 * Connections
 */
export const LOAD_CONNECTIONS = 'app/AgentsPage/LOAD_CONNECTIONS';
export const LOAD_CONNECTIONS_ERROR = 'app/AgentsPage/LOAD_CONNECTIONS_ERROR';
export const LOAD_CONNECTIONS_SUCCESS =
  'app/AgentsPage/LOAD_CONNECTIONS_SUCCESS';
export const LOAD_CHANNELS = 'app/AgentsPage/LOAD_CHANNELS';
export const LOAD_CHANNELS_ERROR = 'app/AgentsPage/LOAD_CHANNELS_ERROR';
export const LOAD_CHANNELS_SUCCESS = 'app/AgentsPage/LOAD_CHANNELS_SUCCESS';

/*
 * Connection
 */
export const CHANGE_CONNECTION_DATA =
  'app/ConnectionPage/CHANGE_CONNECTION_DATA';
export const LOAD_CONNECTION = 'app/ConnectionPage/LOAD_CONNECTION';
export const LOAD_CONNECTION_ERROR = 'app/ConnectionPage/LOAD_CONNECTION_ERROR';
export const LOAD_CONNECTION_SUCCESS =
  'app/ConnectionPage/LOAD_CONNECTION_SUCCESS';
export const RESET_CONNECTION_DATA = 'app/ConnectionPage/RESET_CONNECTION_DATA';
export const CREATE_CONNECTION = 'app/ConnectionPage/CREATE_CONNECTION';
export const CREATE_CONNECTION_ERROR =
  'app/ConnectionPage/CREATE_CONNECTION_ERROR';
export const CREATE_CONNECTION_SUCCESS =
  'app/ConnectionPage/CREATE_CONNECTION_SUCCESS';
export const UPDATE_CONNECTION = 'app/ConnectionPage/UPDATE_CONNECTION';
export const UPDATE_CONNECTION_ERROR =
  'app/ConnectionPage/UPDATE_CONNECTION_ERROR';
export const UPDATE_CONNECTION_SUCCESS =
  'app/ConnectionPage/UPDATE_CONNECTION_SUCCESS';
export const CHANGE_DETAIL_VALUE = 'app/ConnectionPage/CHANGE_DETAIL_VALUE';
export const DELETE_CONNECTION = 'app/ConnectionPage/DELETE_CONNECTION';
export const DELETE_CONNECTION_SUCCESS =
  'app/ConnectionPage/DELETE_CONNECTION_SUCCESS';
export const DELETE_CONNECTION_ERROR =
  'app/ConnectionPage/DELETE_CONNECTION_ERROR';

/*
 * Agents
 */
export const LOAD_AGENTS = 'app/AgentsPage/LOAD_AGENTS';
export const LOAD_AGENTS_SUCCESS = 'app/AgentsPage/LOAD_AGENTS_SUCCESS';
export const LOAD_AGENTS_ERROR = 'app/AgentsPage/LOAD_AGENTS_ERROR';
export const EXPORT_AGENT = 'app/AgentsPage/EXPORT_AGENT';
export const EXPORT_AGENT_SUCCESS = 'app/AgentsPage/EXPORT_AGENT_SUCCESS';
export const EXPORT_AGENT_ERROR = 'app/AgentsPage/EXPORT_AGENT_ERROR';
export const IMPORT_AGENT = 'app/AgentsPage/IMPORT_AGENT';
export const IMPORT_AGENT_SUCCESS = 'app/AgentsPage/IMPORT_AGENT_SUCCESS';
export const IMPORT_AGENT_ERROR = 'app/AgentsPage/IMPORT_AGENT_ERROR';

/*
 * Agent
 */
export const RESET_AGENT_DATA = 'app/AgentPage/RESET_AGENT_DATA';
export const LOAD_AGENT = 'app/AgentPage/LOAD_AGENT';
export const LOAD_AGENT_ERROR = 'app/AgentPage/LOAD_AGENT_ERROR';
export const LOAD_AGENT_SUCCESS = 'app/AgentPage/LOAD_AGENT_SUCCESS';
export const CHANGE_AGENT_DATA = 'app/AgentPage/CHANGE_AGENT_DATA';
export const CHANGE_AGENT_NAME = 'app/AgentPage/CHANGE_AGENT_NAME';
export const CHANGE_WEBHOOK_DATA = 'app/AgentPage/CHANGE_WEBHOOK_DATA';
export const CHANGE_WEBHOOK_PAYLOAD_TYPE =
  'app/AgentPage/CHANGE_WEBHOOK_PAYLOAD_TYPE';
export const CHANGE_POST_FORMAT_DATA = 'app/AgentPage/CHANGE_POST_FORMAT_DATA';
export const CHANGE_AGENT_SETTINGS_DATA =
  'app/AgentPage/CHANGE_AGENT_SETTINGS_DATA';
export const ADD_AGENT_FALLBACK = 'app/AgentPage/ADD_AGENT_FALLBACK';
export const DELETE_AGENT_FALLBACK = 'app/AgentPage/DELETE_AGENT_FALLBACK';
export const ADD_AGENT = 'app/AgentPage/ADD_AGENT';
export const ADD_AGENT_ERROR = 'app/AgentPage/ADD_AGENT_ERROR';
export const ADD_AGENT_SUCCESS = 'app/AgentPage/ADD_AGENT_SUCCESS';
export const UPDATE_AGENT = 'app/AgentPage/UPDATE_AGENT';
export const UPDATE_AGENT_ERROR = 'app/AgentPage/UPDATE_AGENT_ERROR';
export const UPDATE_AGENT_SUCCESS = 'app/AgentPage/UPDATE_AGENT_SUCCESS';
export const DELETE_AGENT = 'app/AgentPage/DELETE_AGENT';
export const DELETE_AGENT_ERROR = 'app/AgentPage/DELETE_AGENT_ERROR';
export const DELETE_AGENT_SUCCESS = 'app/AgentPage/DELETE_AGENT_SUCCESS';
export const TRAIN_AGENT = 'app/AgentPage/TRAIN_AGENT';
export const TRAIN_AGENT_ERROR = 'app/AgentPage/TRAIN_AGENT_ERROR';
export const ADD_HEADER_AGENT_WEBHOOK =
  'app/AgentPage/ADD_HEADER_AGENT_WEBHOOK';
export const DELETE_HEADER_AGENT_WEBHOOK =
  'app/AgentPage/DELETE_HEADER_AGENT_WEBHOOK';
export const CHANGE_HEADER_KEY_AGENT_WEBHOOK =
  'app/AgentPage/CHANGE_HEADER_KEY_AGENT_WEBHOOK';
export const CHANGE_HEADER_VALUE_AGENT_WEBHOOK =
  'app/AgentPage/CHANGE_HEADER_VALUE_AGENT_WEBHOOK';
export const ADD_AGENT_PARAMETER = 'app/AgentPage/ADD_AGENT_PARAMETER';
export const DELETE_AGENT_PARAMETER = 'app/AgentPage/DELETE_AGENT_PARAMETER';
export const CHANGE_AGENT_PARAMETER_NAME =
  'app/AgentPage/CHANGE_AGENT_PARAMETER_NAME';
export const CHANGE_AGENT_PARAMETER_VALUE =
  'app/AgentPage/CHANGE_AGENT_PARAMETER_VALUE';
export const LOAD_AGENT_DOCUMENTS = 'app/AgentPage/LOAD_AGENT_DOCUMENTS';
export const LOAD_AGENT_DOCUMENTS_ERROR =
  'app/AgentPage/LOAD_AGENT_DOCUMENTS_ERROR';
export const LOAD_AGENT_DOCUMENTS_SUCCESS =
  'app/AgentPage/LOAD_AGENT_DOCUMENTS_SUCCESS';
export const SET_AGENT_DEFAULTS = 'app/AgentPage/SET_AGENT_DEFAULTS';
export const LOAD_AGENT_SESSIONS = 'app/AgentPage/LOAD_AGENT_SESSIONS';
export const LOAD_AGENT_SESSIONS_SUCCESS = 'app/AgentPage/LOAD_AGENT_SESSIONS_SUCCESS';
export const LOAD_AGENT_SESSIONS_ERROR = 'app/AgentPage/LOAD_AGENT_SESSIONS_ERROR';

/*
 * Sayings
 */
export const RESET_SAYINGS = 'app/SayingsPage/RESET_SAYINGS';
export const LOAD_SAYINGS = 'app/SayingsPage/LOAD_SAYINGS';
export const LOAD_SAYINGS_ERROR = 'app/SayingsPage/LOAD_SAYINGS_ERROR';
export const LOAD_SAYINGS_SUCCESS = 'app/SayingsPage/LOAD_SAYINGS_SUCCESS';
export const ADD_SAYING = 'app/SayingsPage/ADD_SAYING';
export const ADD_SAYING_ERROR = 'app/SayingsPage/ADD_SAYING_ERROR';
export const DELETE_SAYING = 'app/SayingsPage/DELETE_SAYING';
export const DELETE_SAYING_ERROR = 'app/SayingsPage/DELETE_SAYING_ERROR';
export const TAG_KEYWORD = 'app/SayingsPage/TAG_KEYWORD';
export const UNTAG_KEYWORD = 'app/SayingsPage/UNTAG_KEYWORD';
export const CHANGE_SAYING_CATEGORY = 'app/SayingsPage/CHANGE_SAYING_CATEGORY';
export const UPDATE_SAYING_SUCCESS = 'app/SayingsPage/UPDATE_SAYING_SUCCESS';
export const UPDATE_SAYING_ERROR = 'app/SayingsPage/UPDATE_SAYING_ERROR';
export const ADD_ACTION_SAYING = 'app/SayingsPage/ADD_ACTION_SAYING';
export const DELETE_ACTION_SAYING = 'app/SayingsPage/DELETE_ACTION_SAYING';
export const ADD_ACTION_NEW_SAYING = 'app/SayingsPage/ADD_ACTION_NEW_SAYING';
export const DELETE_ACTION_NEW_SAYING =
  'app/SayingsPage/DELETE_ACTION_NEW_SAYING';
export const SEND_SAYING_TO_ACTION = 'app/SayingsPage/SEND_SAYING_TO_ACTION';
export const CLEAR_SAYING_TO_ACTION = 'app/SayingsPage/CLEAR_SAYING_TO_ACTION';
export const LOAD_CATEGORIES = 'app/SayingsPage/LOAD_CATEGORIES';
export const LOAD_CATEGORIES_ERROR = 'app/SayingsPage/LOAD_CATEGORIES_ERROR';
export const LOAD_CATEGORIES_SUCCESS =
  'app/SayingsPage/LOAD_CATEGORIES_SUCCESS';
export const LOAD_FILTERED_CATEGORIES =
  'app/SayingsPage/LOAD_FILTERED_CATEGORIES';
export const LOAD_FILTERED_CATEGORIES_ERROR =
  'app/SayingsPage/LOAD_FILTERED_CATEGORIES_ERROR';
export const LOAD_FILTERED_CATEGORIES_SUCCESS =
  'app/SayingsPage/LOAD_FILTERED_CATEGORIES_SUCCESS';
export const LOAD_FILTERED_ACTIONS = 'app/SayingsPage/LOAD_FILTERED_ACTIONS';
export const LOAD_FILTERED_ACTIONS_ERROR =
  'app/SayingsPage/LOAD_FILTERED_ACTIONS_ERROR';
export const LOAD_FILTERED_ACTIONS_SUCCESS =
  'app/SayingsPage/LOAD_FILTERED_ACTIONS_SUCCESS';
export const SELECT_CATEGORY = 'app/SayingsPage/SELECT_CATEGORY';
export const CHANGE_SAYINGS_PAGE_SIZE =
  'app/SayingsPage/CHANGE_SAYINGS_PAGE_SIZE';
export const COPY_SAYING = 'app/SayingsPage/COPY_SAYING';
export const COPY_SAYING_ERROR = 'app/SayingsPage/COPY_SAYING_ERROR';
export const COPY_SAYING_SUCCESS = 'app/SayingsPage/COPY_SAYING_SUCCESS';

/*
 * Keywords
 */
export const LOAD_KEYWORDS = 'app/KeywordsPage/LOAD_KEYWORDS';
export const LOAD_KEYWORDS_ERROR = 'app/KeywordsPage/LOAD_KEYWORDS_ERROR';
export const LOAD_KEYWORDS_SUCCESS = 'app/KeywordsPage/LOAD_KEYWORDS_SUCCESS';
export const CHANGE_KEYWORDS_PAGE_SIZE =
  'app/KeywordsPage/CHANGE_KEYWORDS_PAGE_SIZE';

/*
 * Settings
 */
export const LOAD_SETTINGS = 'app/SettingsPage/LOAD_SETTINGS';
export const LOAD_SETTINGS_ERROR = 'app/SettingsPage/LOAD_SETTINGS_ERROR';
export const LOAD_SETTINGS_SUCCESS = 'app/SettingsPage/LOAD_SETTINGS_SUCCESS';
export const UPDATE_SETTINGS = 'app/SettingsPage/UPDATE_SETTINGS';
export const UPDATE_SETTINGS_ERROR = 'app/SettingsPage/UPDATE_SETTINGS_ERROR';
export const UPDATE_SETTINGS_SUCCESS =
  'app/SettingsPage/UPDATE_SETTINGS_SUCCESS';
export const UPDATE_SETTING = 'app/SettingsPage/UPDATE_SETTING';
export const UPDATE_SETTING_ERROR = 'app/SettingsPage/UPDATE_SETTING_ERROR';
export const UPDATE_SETTING_SUCCESS = 'app/SettingsPage/UPDATE_SETTING_SUCCESS';
export const CHANGE_SETTINGS_DATA = 'app/SettingsPage/CHANGE_SETTINGS_DATA';
export const ADD_FALLBACK = 'app/SettingsPage/ADD_FALLBACK';
export const DELETE_FALLBACK = 'app/SettingsPage/DELETE_FALLBACK';

/*
 * Actions
 */
export const CHANGE_ACTIONS_PAGE_SIZE =
  'app/ActionPage/CHANGE_ACTIONS_PAGE_SIZE';
export const RESET_ACTION_DATA = 'app/ActionPage/RESET_ACTION_DATA';
export const RESET_ACTIONS = 'app/ActionPage/RESET_ACTIONS';
export const LOAD_ACTIONS = 'app/ActionPage/LOAD_ACTIONS';
export const LOAD_ACTIONS_ERROR = 'app/ActionPage/LOAD_ACTIONS_ERROR';
export const LOAD_ACTIONS_SUCCESS = 'app/ActionPage/LOAD_ACTIONS_SUCCESS';
export const LOAD_ACTIONS_PAGE = 'app/ActionPage/LOAD_ACTIONS_PAGE';
export const LOAD_ACTIONS_PAGE_ERROR = 'app/ActionPage/LOAD_ACTIONS_PAGE_ERROR';
export const LOAD_ACTIONS_PAGE_SUCCESS =
  'app/ActionPage/LOAD_ACTIONS_PAGE_SUCCESS';
export const LOAD_ACTION = 'app/ActionPage/LOAD_ACTION';
export const LOAD_ACTION_ERROR = 'app/ActionPage/LOAD_ACTION_ERROR';
export const LOAD_ACTION_SUCCESS = 'app/ActionPage/LOAD_ACTION_SUCCESS';
export const CHANGE_ACTION_NAME = 'app/ActionPage/CHANGE_ACTION_NAME';
export const CHANGE_ACTION_DATA = 'app/ActionPage/CHANGE_ACTION_DATA';
export const ADD_ACTION_RESPONSE = 'app/ActionPage/ADD_ACTION_RESPONSE';
export const CHAIN_ACTION_TO_RESPONSE =
  'app/ActionPage/CHAIN_ACTION_TO_RESPONSE';
export const UNCHAIN_ACTION_FROM_RESPONSE =
  'app/ActionPage/UNCHAIN_ACTION_FROM_RESPONSE';
export const UPDATE_NEW_RESPONSE = 'app/ActionPage/UPDATE_NEW_RESPONSE';
export const COPY_RESPONSE = 'app/ActionPage/COPY_RESPONSE';
export const DELETE_ACTION_RESPONSE = 'app/ActionPage/DELETE_ACTION_RESPONSE';
export const CHANGE_ACTION_WEBHOOK_DATA =
  'app/ActionPage/CHANGE_ACTION_WEBHOOK_DATA';
export const CHANGE_ACTION_WEBHOOK_PAYLOAD_TYPE =
  'app/ActionPage/CHANGE_ACTION_WEBHOOK_PAYLOAD_TYPE';
export const CHANGE_ACTION_POST_FORMAT_DATA =
  'app/ActionPage/CHANGE_ACTION_POST_FORMAT_DATA';
export const ADD_ACTION = 'app/ActionPage/ADD_ACTION';
export const ADD_ACTION_ERROR = 'app/ActionPage/ADD_ACTION_ERROR';
export const ADD_ACTION_SUCCESS = 'app/ActionPage/ADD_ACTION_SUCCESS';
export const UPDATE_ACTION = 'app/ActionPage/UPDATE_ACTION';
export const UPDATE_ACTION_ERROR = 'app/ActionPage/UPDATE_ACTION_ERROR';
export const UPDATE_ACTION_SUCCESS = 'app/ActionPage/UPDATE_ACTION_SUCCESS';
export const DELETE_ACTION = 'app/ActionPage/DELETE_ACTION';
export const DELETE_ACTION_ERROR = 'app/ActionPage/DELETE_ACTION_ERROR';
export const DELETE_ACTION_SUCCESS = 'app/ActionPage/DELETE_ACTION_SUCCESS';
export const ADD_HEADER_ACTION_WEBHOOK =
  'app/ActionPage/ADD_HEADER_ACTION_WEBHOOK';
export const DELETE_HEADER_ACTION_WEBHOOK =
  'app/ActionPage/DELETE_HEADER_ACTION_WEBHOOK';
export const CHANGE_HEADER_KEY_ACTION_WEBHOOK =
  'app/ActionPage/CHANGE_HEADER_KEY_ACTION_WEBHOOK';
export const CHANGE_HEADER_VALUE_ACTION_WEBHOOK =
  'app/ActionPage/CHANGE_HEADER_VALUE_ACTION_WEBHOOK';
export const ADD_NEW_SLOT = 'app/ActionPage/ADD_NEW_SLOT';
export const CHANGE_SLOT_NAME = 'app/ActionPage/CHANGE_SLOT_NAME';
export const CHANGE_SLOT_DATA = 'app/ActionPage/CHANGE_SLOT_DATA';
export const ADD_SLOT_TEXT_PROMPT_SLOT =
  'app/ActionPage/ADD_SLOT_TEXT_PROMPT_SLOT';
export const DELETE_SLOT_TEXT_PROMPT_SLOT =
  'app/ActionPage/DELETE_SLOT_TEXT_PROMPT_SLOT';
export const SORT_SLOTS = 'app/ActionPage/SORT_SLOTS';
export const DELETE_SLOT = 'app/ActionPage/DELETE_SLOT';
export const EDIT_ACTION_RESPONSE = 'app/ActionPage/EDIT_ACTION_RESPONSE';
export const ADD_NEW_QUICK_RESPONSE = 'app/ActionPage/ADD_NEW_QUICK_RESPONSE';
export const DELETE_QUICK_RESPONSE = 'app/ActionPage/DELETE_QUICK_RESPONSE';
export const CHANGE_QUICK_RESPONSE = 'app/ActionPage/CHANGE_QUICK_RESPONSE';
export const EDIT_SLOT_TEXT_PROMPT = 'app/ActionPage/EDIT_SLOT_TEXT_PROMPT';

/*
 * Keyword
 */
export const RESET_KEYWORD_DATA = 'app/KeywordsEditPage/RESET_KEYWORD_DATA';
export const LOAD_KEYWORD = 'app/KeywordsEditPage/LOAD_KEYWORD';
export const LOAD_KEYWORD_ERROR = 'app/KeywordsEditPage/LOAD_KEYWORD_ERROR';
export const LOAD_KEYWORD_SUCCESS = 'app/KeywordsEditPage/LOAD_KEYWORD_SUCCESS';
export const CREATE_KEYWORD = 'app/KeywordsEditPage/CREATE_KEYWORD';
export const CREATE_KEYWORD_ERROR = 'app/KeywordsEditPage/CREATE_KEYWORD_ERROR';
export const CREATE_KEYWORD_SUCCESS =
  'app/KeywordsEditPage/CREATE_KEYWORD_SUCCESS';
export const UPDATE_KEYWORD = 'app/KeywordsEditPage/UPDATE_KEYWORD';
export const UPDATE_KEYWORD_ERROR = 'app/KeywordsEditPage/UPDATE_KEYWORD_ERROR';
export const UPDATE_KEYWORD_SUCCESS =
  'app/KeywordsEditPage/UPDATE_KEYWORD_SUCCESS';
export const CHANGE_KEYWORD_DATA = 'app/KeywordsEditPage/CHANGE_KEYWORD_DATA';
export const ADD_KEYWORD_EXAMPLE = 'app/KeywordsEditPage/ADD_KEYWORD_EXAMPLE';
export const DELETE_KEYWORD_EXAMPLE =
  'app/KeywordsEditPage/DELETE_KEYWORD_EXAMPLE';
export const CHANGE_EXAMPLE_SYNONYMS =
  'app/KeywordsEditPage/CHANGE_EXAMPLE_SYNONYMS';
export const CHANGE_EXAMPLE_NAME = 'app/KeywordsEditPage/CHANGE_EXAMPLE_NAME';
export const DELETE_KEYWORD = 'app/KeywordsEditPage/DELETE_KEYWORD';
export const DELETE_KEYWORD_ERROR = 'app/KeywordsEditPage/DELETE_KEYWORD_ERROR';
export const DELETE_KEYWORD_SUCCESS =
  'app/KeywordsEditPage/DELETE_KEYWORD_SUCCESS';
export const ADD_NEW_MODIFIER = 'app/KeywordsEditPage/ADD_NEW_MODIFIER';
export const CHANGE_MODIFIER_NAME = 'app/KeywordsEditPage/CHANGE_MODIFIER_NAME';
export const CHANGE_MODIFIER_DATA = 'app/KeywordsEditPage/CHANGE_MODIFIER_DATA';
export const ADD_MODIFIER_SAYING = 'app/KeywordsEditPage/ADD_MODIFIER_SAYING';
export const ADD_MODIFIER_SAYING_SUCCESS =
  'app/KeywordsEditPage/ADD_MODIFIER_SAYING_SUCCESS';
export const DELETE_MODIFIER_SAYING =
  'app/KeywordsEditPage/DELETE_MODIFIER_SAYING';
export const SORT_MODIFIERS = 'app/KeywordsEditPage/SORT_MODIFIERS';
export const DELETE_MODIFIER = 'app/KeywordsEditPage/DELETE_MODIFIER';
export const TAG_MODIFIER_KEYWORD = 'app/KeywordsEditPage/TAG_MODIFIER_KEYWORD';
export const UNTAG_MODIFIER_KEYWORD =
  'app/KeywordsEditPage/UNTAG_MODIFIER_KEYWORD';
export const CHANGE_MODIFIER_SAYINGS_PAGE_SIZE =
  'app/KeywordsEditPage/CHANGE_MODIFIER_SAYINGS_PAGE_SIZE';

/*
 * Category
 */
export const RESET_CATEGORY_DATA = 'app/CategoryPage/RESET_CATEGORY_DATA';
export const LOAD_CATEGORY = 'app/CategoryPage/LOAD_CATEGORY';
export const LOAD_CATEGORY_ERROR = 'app/CategoryPage/LOAD_CATEGORY_ERROR';
export const LOAD_CATEGORY_SUCCESS = 'app/CategoryPage/LOAD_CATEGORY_SUCCESS';
export const CREATE_CATEGORY = 'app/CategoryPage/CREATE_CATEGORY';
export const CREATE_CATEGORY_ERROR = 'app/CategoryPage/CREATE_CATEGORY_ERROR';
export const CREATE_CATEGORY_SUCCESS =
  'app/CategoryPage/CREATE_CATEGORY_SUCCESS';
export const UPDATE_CATEGORY = 'app/CategoryPage/UPDATE_CATEGORY';
export const UPDATE_CATEGORY_ERROR = 'app/CategoryPage/UPDATE_CATEGORY_ERROR';
export const UPDATE_CATEGORY_SUCCESS =
  'app/CategoryPage/UPDATE_CATEGORY_SUCCESS';
export const CHANGE_CATEGORY_DATA = 'app/CategoryPage/CHANGE_CATEGORY_DATA';
export const DELETE_CATEGORY = 'app/CategoryPage/DELETE_CATEGORY';
export const DELETE_CATEGORY_ERROR = 'app/CategoryPage/DELETE_CATEGORY_ERROR';
export const DELETE_CATEGORY_SUCCESS =
  'app/CategoryPage/DELETE_CATEGORY_SUCCESS';
export const ADD_CATEGORY_PARAMETER = 'app/AgentPage/ADD_CATEGORY_PARAMETER';
export const DELETE_CATEGORY_PARAMETER =
  'app/AgentPage/DELETE_CATEGORY_PARAMETER';
export const CHANGE_CATEGORY_PARAMETER_NAME =
  'app/AgentPage/CHANGE_CATEGORY_PARAMETER_NAME';
export const CHANGE_CATEGORY_PARAMETER_VALUE =
  'app/AgentPage/CHANGE_CATEGORY_PARAMETER_VALUE';
export const LOAD_PREBUILT_CATEGORIES =
  'app/CategoryPage/LOAD_PREBUILT_CATEGORIES';
export const LOAD_PREBUILT_CATEGORIES_ERROR =
  'app/CategoryPage/LOAD_PREBUILT_CATEGORIES_ERROR';
export const LOAD_PREBUILT_CATEGORIES_SUCCESS =
  'app/CategoryPage/LOAD_PREBUILT_CATEGORIES_SUCCESS';
export const IMPORT_CATEGORY = 'app/CategoryPage/IMPORT_CATEGORY';
export const IMPORT_CATEGORY_ERROR = 'app/CategoryPage/IMPORT_CATEGORY_ERROR';
export const IMPORT_CATEGORY_SUCCESS =
  'app/CategoryPage/IMPORT_CATEGORY_SUCCESS';

/*
 * Review
 */
export const CHANGE_REVIEW_PAGE_SIZE = 'app/ReviewPage/CHANGE_REVIEW_PAGE_SIZE';
export const CHANGE_SESSIONS_PAGE_SIZE = 'app/ReviewPage/CHANGE_SESSIONS_PAGE_SIZE';

/*
 * Locale
 */
export const CHANGE_LOCALE = 'app/LanguageToggle/CHANGE_LOCALE';

/*
 * User
 */
export const LOGIN_USER = 'app/user/LOGIN_USER';
export const LOGIN_USER_SUCCESS = 'app/user/LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'app/user/LOGIN_USER_ERROR';

export const LOGOUT_USER = 'app/user/LOGOUT_USER';
export const LOGOUT_USER_SUCCESS = 'app/user/LOGOUT_USER_SUCCESS';
export const LOGOUT_USER_ERROR = 'app/user/LOGOUT_USER_ERROR';

export const SIGN_UP_USER = 'app/user/SIGN_UP_USER';
export const SIGN_UP_USER_SUCCESS = 'app/user/SIGN_UP_USER_SUCCESS';
export const SIGN_UP_USER_ERROR = 'app/user/SIGN_UP_USER_ERROR';

/* Users */ 
export const LOAD_USERS = 'app/user/LOAD_USERS';
export const LOAD_USERS_SUCCESS = 'app/user/LOAD_USERS_SUCCESS';
export const LOAD_USERS_ERROR = 'app/user/LOAD_USERS_ERROR';

export const DELETE_USER = 'app/user/DELETE_USER';
export const DELETE_USER_SUCCESS = 'app/user/DELETE_USER_SUCCESS';
export const DELETE_USER_ERROR = 'app/user/DELETE_USER_ERROR';