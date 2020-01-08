export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';
export const ACTION_INTENT_SPLIT_SYMBOL = '+__+';
export const PROXY_ROUTE_PREFIX = '/api';

// ROUTES
export const ROUTE_ACTION = 'action';
export const ROUTE_AGENT = 'agent';
export const ROUTE_CONNECTION = 'connection';
export const ROUTE_CHANNEL = 'channel';
export const ROUTE_SESSION = 'session';
export const ROUTE_CONTEXT = 'context';
export const ROUTE_DOCUMENT = 'doc';
export const ROUTE_LOG = 'log';
export const ROUTE_CATEGORY = 'category';
export const ROUTE_POST_FORMAT = 'postFormat';
export const ROUTE_KEYWORD = 'keyword';
export const ROUTE_SAYING = 'saying';
export const ROUTE_SETTINGS = 'settings';
export const ROUTE_WEBHOOK = 'webhook';
export const ROUTE_TRAIN = 'train';
export const ROUTE_PARSE = 'parse';
export const ROUTE_IDENTIFY_KEYWORDS = 'identifyKeywords';
export const ROUTE_RECOGNIZE_UPDATED_KEYWORDS = 'recognizeUpdatedKeywords';
export const ROUTE_CONVERSE = 'converse';
export const ROUTE_EXPORT = 'export';
export const ROUTE_IMPORT = 'import';
export const ROUTE_BULK = 'bulk';
export const ROUTE_USER = 'user';
export const ROUTE_ACCESS_CONTROL = 'ac';
export const ROUTE_GROUP = 'group';
export const ROUTE_CURRENT = 'current';
export const ACL_ACTION_READ = 'read';
export const ACL_ACTION_WRITE = 'write';
export const ACL_ACTION_CONVERSE = 'converse';
export const MODEL_AGENT = 'Agent';
export const MODEL_CONNECTION = 'Connection';
export const MODEL_USER_ACCOUNT = 'UserAccount';
export const MODEL_ACCESS_POLICY_GROUP = 'AccessPolicyGroup';
export const ROUTE_SEARCH = 'search';
export const ROUTE_DELETE_BY_QUERY = '_delete_by_query?refresh';

export const GROUP_ACCESS_CONTROL = {
  AGENT_READ: `${MODEL_AGENT}:${ACL_ACTION_READ}`,
  AGENT_WRITE: `${MODEL_AGENT}:${ACL_ACTION_WRITE}`,
  CONNECTION_READ: `${MODEL_CONNECTION}:${ACL_ACTION_READ}`,
  CONNECTION_WRITE: `${MODEL_CONNECTION}:${ACL_ACTION_WRITE}`,
  USER_READ: `${MODEL_USER_ACCOUNT}:${ACL_ACTION_READ}`,
  USER_WRITE: `${MODEL_USER_ACCOUNT}:${ACL_ACTION_WRITE}`,
  ACL_READ: `${MODEL_ACCESS_POLICY_GROUP}:${ACL_ACTION_READ}`,
  ACL_WRITE: `${MODEL_ACCESS_POLICY_GROUP}:${ACL_ACTION_WRITE}`,
};

export const AGENT_ACCESS_POLICIES = {
  [`${MODEL_AGENT}:${ACL_ACTION_READ}`]: false,
  [`${MODEL_AGENT}:${ACL_ACTION_WRITE}`]: false,
  [`${MODEL_AGENT}:${ACL_ACTION_CONVERSE}`]: false,
};
