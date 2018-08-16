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

/*
 * Agents
 */
export const LOAD_AGENTS = 'app/AgentsPage/LOAD_AGENTS';
export const LOAD_AGENTS_SUCCESS = 'app/AgentsPage/LOAD_AGENTS_SUCCESS';
export const LOAD_AGENTS_ERROR = 'app/AgentsPage/LOAD_AGENTS_ERROR';
export const ADD_AGENT = 'app/AgentsPage/ADD_AGENT';
export const ADD_AGENT_ERROR = 'app/AgentsPage/ADD_AGENT_ERROR';
export const ADD_AGENT_SUCCESS = 'app/AgentsPage/ADD_AGENT_SUCCESS';

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
export const CHANGE_WEBHOOK_PAYLOAD_TYPE = 'app/AgentPage/CHANGE_WEBHOOK_PAYLOAD_TYPE';
export const CHANGE_POST_FORMAT_DATA = 'app/AgentPage/CHANGE_POST_FORMAT_DATA';
export const CHANGE_AGENT_SETTINGS_DATA = 'app/AgentPage/CHANGE_AGENT_SETTINGS_DATA';
export const ADD_AGENT_FALLBACK = 'app/AgentPage/ADD_AGENT_FALLBACK';
export const DELETE_AGENT_FALLBACK = 'app/AgentPage/DELETE_AGENT_FALLBACK';

/*
 * Sayings
 */
export const LOAD_SAYINGS = 'app/SayingsPage/LOAD_SAYINGS';
export const LOAD_SAYINGS_ERROR = 'app/SayingsPage/LOAD_SAYINGS_ERROR';
export const LOAD_SAYINGS_SUCCESS = 'app/SayingsPage/LOAD_SAYINGS_SUCCESS';
export const ADD_SAYING = 'app/SayingsPage/ADD_SAYING';
export const ADD_SAYING_ERROR = 'app/SayingsPage/ADD_SAYING_ERROR';
export const DELETE_SAYING = 'app/SayingsPage/DELETE_SAYING';
export const DELETE_SAYING_ERROR = 'app/SayingsPage/DELETE_SAYING_ERROR';
export const TAG_KEYWORD = 'app/SayingsPage/TAG_KEYWORD';
export const UNTAG_KEYWORD = 'app/SayingsPage/UNTAG_KEYWORD';
export const UPDATE_SAYING_ERROR = 'app/SayingsPage/UPDATE_SAYING_ERROR';
export const ADD_ACTION = 'app/SayingsPage/ADD_ACTION';
export const DELETE_ACTION = 'app/SayingsPage/DELETE_ACTION';

/*
 * Keywords
 */
export const LOAD_KEYWORDS = 'app/KeywordsPage/LOAD_KEYWORDS';
export const LOAD_KEYWORDS_ERROR = 'app/KeywordsPage/LOAD_KEYWORDS_ERROR';
export const LOAD_KEYWORDS_SUCCESS = 'app/KeywordsPage/LOAD_KEYWORDS_SUCCESS';
export const DELETE_KEYWORD = 'app/KeywordsPage/DELETE_KEYWORD';
export const DELETE_KEYWORD_ERROR = 'app/KeywordsPage/DELETE_KEYWORD_ERROR';

/*
 * Settings
 */
export const LOAD_SETTINGS = 'app/SettingsPage/LOAD_SETTINGS';
export const LOAD_SETTINGS_ERROR = 'app/SettingsPage/LOAD_SETTINGS_ERROR';
export const LOAD_SETTINGS_SUCCESS = 'app/SettingsPage/LOAD_SETTINGS_SUCCESS';
export const UPDATE_SETTINGS = 'app/SettingsPage/UPDATE_SETTINGS';
export const UPDATE_SETTINGS_ERROR = 'app/SettingsPage/UPDATE_SETTINGS_ERROR';
export const UPDATE_SETTINGS_SUCCESS = 'app/SettingsPage/UPDATE_SETTINGS_SUCCESS';
export const CHANGE_SETTINGS_DATA = 'app/SettingsPage/CHANGE_SETTINGS_DATA';
export const ADD_FALLBACK = 'app/AgentPage/ADD_FALLBACK';
export const DELETE_FALLBACK = 'app/AgentPage/DELETE_FALLBACK';
