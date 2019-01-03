import _ from 'lodash';

//DEBUG
export const DEBUG_LEVEL_INFO = 'info';
export const DEBUG_LEVEL_DEBUG = 'debug';
export const DEBUG_LEVEL_ERROR = 'error';

//ERRORS
export const ERROR_NOT_FOUND = 'not found';
export const ERROR_VALIDATION = 'Validation failed. See .errors on this Error or the Nohm model instance for details.';
export const ERROR_FIELD_NOT_FOUND = 'Field not found';

//MODELS
export const MODEL_RELATION_USED = 'usedBy';
export const MODEL_ACTION = 'Action';
export const MODEL_AGENT = 'Agent';
export const MODEL_CONTEXT = 'Context';
export const MODEL_FRAME = 'Frame';
export const MODEL_CATEGORY = 'Category';
export const MODEL_DOCUMENT = 'Document';
export const MODEL_KEYWORD = 'Keyword';
export const MODEL_POST_FORMAT = 'PostFormat';
export const MODEL_SAYING = 'Saying';
export const MODEL_SETTINGS = 'Settings';
export const MODEL_WEBHOOK = 'Webhook';
export const MODEL_ALL = [
    MODEL_ACTION,
    MODEL_AGENT,
    MODEL_CONTEXT,
    MODEL_DOCUMENT,
    MODEL_CATEGORY,
    MODEL_KEYWORD,
    MODEL_SAYING,
    MODEL_SETTINGS,
    MODEL_WEBHOOK,
    MODEL_POST_FORMAT
];

//ROUTES
export const ROUTE_ACTION = 'action';
export const ROUTE_AGENT = 'agent';
export const ROUTE_CONTEXT = 'context';
export const ROUTE_DOCUMENT = 'doc';
export const ROUTE_CATEGORY = 'category';
export const ROUTE_POST_FORMAT = 'postFormat';
export const ROUTE_KEYWORD = 'keyword';
export const ROUTE_SAYING = 'saying';
export const ROUTE_SETTINGS = 'settings';
export const ROUTE_WEBHOOK = 'webhook';
export const ROUTE_TRAIN = 'train';
export const ROUTE_PARSE = 'parse';
export const ROUTE_CONVERSE = 'converse';
export const ROUTE_FRAME = 'frame';

// STATUS
export const STATUS_READY = 'Ready';
export const STATUS_TRAINING = 'Training';
export const STATUS_ERROR = 'Error';
export const STATUS_OUT_OF_DATE = 'Out of Date';

//PARAMS ID
export const PARAMS_POSTFIX_ID = 'Id';
export const PARAM_FIELD = 'field';
export const PARAM_VALUE = 'value';
export const PARAM_NAME = 'name';
export const PARAM_SKIP = 'skip';
export const PARAM_LIMIT = 'limit';
export const PARAM_DIRECTION = 'direction';
export const PARAM_SESSION = 'sessionId';
export const PARAM_FRAME = 'frame';
export const PARAM_LOAD_FRAMES = 'loadFrames';
export const PARAM_DEBUG = 'debug';
export const PARAM_TEXT = 'text';
export const PARAM_TIMEZONE = 'timezone';
export const PARAM_BULK = 'bulk';
export const PARAM_SEARCH = 'search';

export const PARAM_ACTION_ID = ROUTE_ACTION + PARAMS_POSTFIX_ID;
export const PARAM_AGENT_ID = ROUTE_AGENT + PARAMS_POSTFIX_ID;
export const PARAM_CATEGORY_ID = ROUTE_CATEGORY + PARAMS_POSTFIX_ID;
export const PARAM_KEYWORD_ID = ROUTE_KEYWORD + PARAMS_POSTFIX_ID;
export const PARAM_SAYING_ID = ROUTE_SAYING + PARAMS_POSTFIX_ID;
export const PARAM_DOCUMENT_ID = ROUTE_DOCUMENT + PARAMS_POSTFIX_ID;
export const PARAM_DOCUMENT_TIME_STAMP = 'time_stamp';
export const PARAM_DOCUMENT_MAXIMUM_SAYING_SCORE = 'maximum_saying_score';
export const PARAM_DOCUMENT_MAXIMUM_CATEGORY_SCORE = 'maximum_category_score';
export const PARAM_DOCUMENT_TOTAL_ELAPSED_TIME = 'total_elapsed_time_ms';
export const PARAM_DOCUMENT_RASA_RESULTS = 'rasa_results';
export const PARAM_DOCUMENT_ACTION_RANKING = 'action_ranking';
export const PARAM_DOCUMENT_AGENT_ID = 'agent_id';
export const PARAM_DOCUMENT_AGENT_MODEL = 'agent_model';
export const PARAM_DOCUMENT_SESSION = 'session';

export const ROUTE_TO_MODEL = {
    [ROUTE_ACTION]: MODEL_ACTION,
    [ROUTE_AGENT]: MODEL_AGENT,
    [ROUTE_CONTEXT]: MODEL_CONTEXT,
    [ROUTE_DOCUMENT]: MODEL_DOCUMENT,
    [ROUTE_CATEGORY]: MODEL_CATEGORY,
    [ROUTE_KEYWORD]: MODEL_KEYWORD,
    [ROUTE_SAYING]: MODEL_SAYING,
    [ROUTE_SETTINGS]: MODEL_SETTINGS,
    [ROUTE_WEBHOOK]: MODEL_WEBHOOK,
    [ROUTE_POST_FORMAT]: MODEL_POST_FORMAT
};
export const MODEL_TO_ROUTE = _.invert(ROUTE_TO_MODEL);

//CONFIG
export const CONFIG_SETTINGS_RASA_URL = 'rasaURL';
export const CONFIG_SETTINGS_DUCKLING_URL = 'ducklingURL';
export const CONFIG_SETTINGS_DUCKLING_DIMENSION = 'ducklingDimension';
export const CONFIG_SETTINGS_SPACY_ENTITIES = 'spacyPretrainedEntities';
export const CONFIG_SETTINGS_CATEGORY_PIPELINE = 'categoryClassifierPipeline';
export const CONFIG_SETTINGS_SAYING_PIPELINE = 'sayingClassifierPipeline';
export const CONFIG_SETTINGS_KEYWORD_PIPELINE = 'keywordClassifierPipeline';
export const CONFIG_SETTINGS_LANGUAGES = 'uiLanguages';
export const CONFIG_SETTINGS_LANGUAGES_DEFAULT = 'uiLanguage';
export const CONFIG_SETTINGS_LANGUAGES_AGENT = 'agentLanguages';
export const CONFIG_SETTINGS_LANGUAGES_AGENT_DEFAULT = 'defaultAgentLanguage';
export const CONFIG_SETTINGS_TIMEZONES = 'timezones';
export const CONFIG_SETTINGS_TIMEZONES_DEFAULT = 'defaultTimezone';
export const CONFIG_SETTINGS_RESPONSES_AGENT_DEFAULT = 'defaultAgentFallbackResponses';
export const CONFIG_SETTINGS_SAYINGS_PAGE_SIZE = 'sayingsPageSize';
export const CONFIG_SETTINGS_KEYWORDS_PAGE_SIZE = 'keywordsPageSize';
export const CONFIG_SETTINGS_REVIEW_PAGE_SIZE = 'reviewPageSize';

export const CONFIG_KEYWORD_TYPE_LEARNED = 'learned';
export const CONFIG_KEYWORD_TYPE_REGEX = 'regex';

export const CONFIG_SETTINGS_RASA_TRAINING = [
    CONFIG_SETTINGS_RASA_URL,
    CONFIG_SETTINGS_DUCKLING_URL,
    CONFIG_SETTINGS_DUCKLING_DIMENSION,
    CONFIG_SETTINGS_SPACY_ENTITIES,
    CONFIG_SETTINGS_CATEGORY_PIPELINE,
    CONFIG_SETTINGS_SAYING_PIPELINE,
    CONFIG_SETTINGS_KEYWORD_PIPELINE,
]

export const CONFIG_SETTINGS_DEFAULT_AGENT = [
    CONFIG_SETTINGS_RASA_URL,
    CONFIG_SETTINGS_DUCKLING_URL,
    CONFIG_SETTINGS_DUCKLING_DIMENSION,
    CONFIG_SETTINGS_SPACY_ENTITIES,
    CONFIG_SETTINGS_CATEGORY_PIPELINE,
    CONFIG_SETTINGS_SAYING_PIPELINE,
    CONFIG_SETTINGS_KEYWORD_PIPELINE,
    CONFIG_SETTINGS_SAYINGS_PAGE_SIZE,
    CONFIG_SETTINGS_KEYWORDS_PAGE_SIZE,
    CONFIG_SETTINGS_REVIEW_PAGE_SIZE
];

export const CONFIG_SETTINGS_ALL = [
    CONFIG_SETTINGS_RASA_URL,
    CONFIG_SETTINGS_DUCKLING_URL,
    CONFIG_SETTINGS_DUCKLING_DIMENSION,
    CONFIG_SETTINGS_SPACY_ENTITIES,
    CONFIG_SETTINGS_CATEGORY_PIPELINE,
    CONFIG_SETTINGS_SAYING_PIPELINE,
    CONFIG_SETTINGS_KEYWORD_PIPELINE,
    CONFIG_SETTINGS_LANGUAGES,
    CONFIG_SETTINGS_LANGUAGES_DEFAULT,
    CONFIG_SETTINGS_LANGUAGES_AGENT,
    CONFIG_SETTINGS_LANGUAGES_AGENT_DEFAULT,
    CONFIG_SETTINGS_TIMEZONES,
    CONFIG_SETTINGS_TIMEZONES_DEFAULT,
    CONFIG_SETTINGS_RESPONSES_AGENT_DEFAULT,
    CONFIG_SETTINGS_SAYINGS_PAGE_SIZE,
    CONFIG_SETTINGS_KEYWORDS_PAGE_SIZE,
    CONFIG_SETTINGS_REVIEW_PAGE_SIZE
];

//RASA Property names

export const RASA_AVAILABLE_PROJECTS = 'available_projects';
export const RASA_CURRENT_TRAINING_PROCESSES = 'current_training_processes';
export const RASA_MAX_TRAINING_PROCESSES = 'max_training_processes';
export const RASA_AVAILABLE_MODELS = 'available_models';
export const RASA_LOADED_MODELS = 'loaded_models';
export const RASA_NLU_DATA = 'rasa_nlu_data';
export const RASA_KEYWORD_SYNONYMS = 'keyword_synonyms';
export const RASA_ENTITY_SYNONYMS = 'keyword_synonyms';
export const RASA_COMMON_EXAMPLES = 'common_examples';
export const RASA_REGEX_FEATURES = 'regex_features';
export const RASA_INTENT_RANKING = 'intent_ranking';
export const RASA_ACTION_RANKING = 'action_ranking';

export const RASA_MODEL_CATEGORY_RECOGNIZER = '_category_recognizer';
export const RASA_MODEL_DEFAULT = 'default_';
export const RASA_MODEL_JUST_ER = 'just_er_';

// Conversation State Object properties

export const CSO_AGENT = 'agent';
export const CSO_CONTEXT = 'context';
export const CSO_TIMEZONE_DEFAULT = 'UTL';

// Keywords
export const KEYWORD_PREFIX_SYS = 'sys.';
export const KEYWORD_PREFIX_SPACY = 'spacy_';
export const KEYWORD_PREFIX_SYS_SPACY = `${KEYWORD_PREFIX_SYS}${KEYWORD_PREFIX_SPACY}`;
export const KEYWORD_PREFIX_DUCKLING = 'duckling_';
export const KEYWORD_PREFIX_SYS_DUCKLING = `${KEYWORD_PREFIX_SYS}${KEYWORD_PREFIX_DUCKLING}`;
export const KEYWORD_PREFIX_REGEX = 'regex_';
export const KEYWORD_PREFIX_SYS_REGEX = `${KEYWORD_PREFIX_SYS}${KEYWORD_PREFIX_REGEX}`;

// Duckling keyword
export const DUCKLING_TIME = `${KEYWORD_PREFIX_DUCKLING}time`;
export const DUCKLING_DISTANCE = `${KEYWORD_PREFIX_DUCKLING}distance`;
export const DUCKLING_DURATION = `${KEYWORD_PREFIX_DUCKLING}duration`;
export const DUCKLING_TEMPERATURE = `${KEYWORD_PREFIX_DUCKLING}temperature`;
export const DUCKLING_VOLUME = `${KEYWORD_PREFIX_DUCKLING}volume`;
export const DUCKLING_QUANTITY = `${KEYWORD_PREFIX_DUCKLING}duration`;
export const DUCKLING_URL = `${KEYWORD_PREFIX_DUCKLING}quantity`;

// Nohm subscribe actions

export const NOHM_SUB_CREATE = 'create';
export const NOHM_SUB_UPDATE = 'update';
export const NOHM_SUB_SAVE = 'save';
export const NOHM_SUB_REMOVE = 'remove';
export const NOHM_SUB_LINK = 'link';
export const NOHM_SUB_UNLINK = 'unlink';
export const NOHM_SUB_ALL = [
    NOHM_SUB_CREATE,
    NOHM_SUB_UPDATE,
    NOHM_SUB_SAVE,
    NOHM_SUB_REMOVE,
    NOHM_SUB_LINK,
    NOHM_SUB_UNLINK
];

// Sort
export const SORT_ASC = 'ASC';
export const SORT_DESC = 'DESC';
