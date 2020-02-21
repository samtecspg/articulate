import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

const selectGlobal = state => state.global;
const selectRoute = state => state.router;

/* Global */

const makeSelectLocation = () =>
  createSelector(
    selectRoute,
    routeState => routeState.location,
  );

const makeSelectServerStatus = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.serverStatus,
  );

const makeSelectSessionId = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.sessionId,
  );

const makeSelectSessionLoaded = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.sessionLoaded,
  );

const makeSelectMissingAPI = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.missingAPI,
  );

const makeSelectLoading = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.loading,
  );

const makeSelectLoadingImportCategory = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.loadingImportCategory,
  );

const makeSelectLoadingKeywordExamplesUpdate = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.loadingKeywordExamplesUpdate,
  );

const makeSelectError = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.error,
  );

const makeSelectSuccess = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.success,
  );

const makeSelectSuccessKeywordExamplesUpdate = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.successKeywordExamplesUpdate,
  );

const makeSelectConversationBarOpen = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.conversationBarOpen,
  );

const makeSelectShowChatButton = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.showChatButton,
  );

const makeSelectNotifications = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.notifications,
  );

const makeSelectMessages = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.messages,
  );

const makeSelectWaitingResponse = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.waitingResponse,
  );

const makeSelectCSO = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.CSO,
  );

/* Connections */
const makeSelectConnections = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.connections,
  );

const makeSelectChannels = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.channels,
  );

/* Agents */
const makeSelectAgents = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.agents,
  );

const makeSelectAgentExport = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.agentExport,
  );

/* Agent */
const makeSelectAgent = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.agent,
  );

const makeSelectAgentVersions = () =>
  createSelector(
    selectGlobal,
    globalState => makeSelectAgentVersionsSorted(globalState.agentBackups)
  );

const makeSelectAgentVersionsSorted = (versions) => {
  var tempArray = Immutable.asMutable(versions);
  var temp = tempArray && tempArray.length ? tempArray
    .sort((a, b) => (Number(b.creationDate) > Number(a.creationDate)) ? 1 : -1)
    .filter(version => { return !version.backupAgentUsed })
    : []
  return temp
};

const makeSelectCurrentAgent = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.currentAgent,
  );

const makeSelectAgentWebhook = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.agentWebhook,
  );

const makeSelectAgentPostFormat = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.agentPostFormat,
  );

const makeSelectAgentSettings = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.agentSettings,
  );

const makeSelectAgentTouched = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.agentTouched,
  );

const makeSelectSuccessAgent = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.successAgent,
  );

const makeSelectDocuments = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.documents,
  );

const makeSelectTotalDocuments = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.totalDocuments,
  );

const makeSelectDocumentsAnalytics = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.documentsAnalytics,
  );

const makeSelectDocumentsStats = () =>
  createSelector(
    selectGlobal,
    globalState => {
      return {
        'documentsAnalyticsRequestCount': globalState.documentsAnalyticsRequestCount,
        'documentsAnalyticsSessionsCount': globalState.documentsAnalyticsSessionsCount,
        'documentsAnalyticsFallbacksCount': globalState.documentsAnalyticsFallbacksCount,
        'documentsAnalyticsTopActions': globalState.documentsAnalyticsTopActions,
        'documentsAnalyticsRequestsOverTime': globalState.documentsAnalyticsRequestsOverTime
      }
    }
  );

const makeSelectTotalDocumentsAnalytics = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.totalDocumentsAnalytics,
  );

const makeSelectSessions = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.sessions,
  );

const makeSelectTotalSessions = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.totalSessions,
  );

/*Logs*/
const makeSelectLogs = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.logs,
  );

const makeSelectLogsText = () =>
  createSelector(
    selectGlobal,
    globalState => getLogsContent(globalState.logs)
  )

const getLogsContent = (logs) => {
  var result = '';
  logs.map((log, index) => {
    if (log && log._source && log._source.container && log._source.container.name && log._source.message) {
      result = result + log._source.container.name + ' :' + log._source.message;
      if (index !== logs.length - 1) {
        result = result + '\n';
      }
    }
  });
  return result;
};

/* Keywords */
const makeSelectKeywords = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.keywords,
  );

const makeSelectTotalKeywords = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.totalKeywords,
  );

/* Sayings */
const makeSelectSayings = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.sayings,
  );

const makeSelectTotalSayings = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.totalSayings,
  );

const makeSelectCategories = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.categories,
  );

const makeSelectPrebuiltCategories = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.prebuiltCategories,
  );

const makeSelectFilteredCategories = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.filteredCategories,
  );

const makeSelectFilteredActions = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.filteredActions,
  );

const makeSelectSelectedCategory = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.selectedCategory,
  );

const makeSelectNewSayingActions = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.newSayingActions,
  );

/* Actions */
const makeSelectActionsPage = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.actionsPage,
  );

const makeSelectTotalActionsPage = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.totalActionsPage,
  );

const makeSelectActions = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.actions,
  );

const makeSelectCurrentAction = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.currentAction,
  );

const makeSelectTotalActions = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.totalActions,
  );

const makeSelectAction = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.action,
  );

const makeSelectActionWebhook = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.actionWebhook,
  );

const makeSelectActionPostFormat = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.actionPostFormat,
  );

const makeSelectSayingForAction = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.sayingForAction,
  );

const makeSelectActionTouched = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.actionTouched,
  );

const makeSelectSuccessAction = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.successAction,
  );

const makeSelectNewActionResponse = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.newActionResponse,
  );

/* Settings */
const makeSelectSettings = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.settings,
  );

const makeSelectSettingsTouched = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.settingsTouched
  );

/* Keyword */
const makeSelectKeyword = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.keyword,
  );

const makeSelectkeywordExamplesUpdate = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.keywordExamplesUpdate,
  );

const makeSelectKeywordTouched = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.keywordTouched,
  );

const makeSelectSuccessKeyword = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.successKeyword,
  );

/* Connection */
const makeSelectConnection = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.connection,
  );

const makeSelectConnectionTouched = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.connectionTouched,
  );

const makeSelectSuccessConnection = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.successConnection,
  );

/* Category */
const makeSelectCategory = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.category,
  );

const makeSelectCategoryTouched = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.categoryTouched,
  );

const makeSelectSuccessCategory = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.successCategory,
  );

/* Locale */
const makeSelectLocale = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.locale,
  );

/* Cheat sheet */
const makeSelectStarredSayings = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.starredSayings,
  );

const makeSelectStarredSaying = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.starredSaying,
  );

/* Users */
const makeSelectUsers = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.users,
  );

const makeSelectTotalUsers = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.totalUsers,
  );

const makeSelectCurrentUser = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.currentUser,
  );
const makeSelectLoadingCurrentUser = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.loadingCurrentUser,
  );
const makeSelectAccessPolicyGroups = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.accessPolicyGroups,
  );

const makeSelectUser = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.user,
  );

const makeSelectUserDataTouched = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.userDataTouched,
  );
export {
  makeSelectServerStatus,
  makeSelectLocation,
  makeSelectSessionId,
  makeSelectSessionLoaded,
  makeSelectMissingAPI,
  makeSelectLoading,
  makeSelectLoadingImportCategory,
  makeSelectError,
  makeSelectSuccess,
  makeSelectConversationBarOpen,
  makeSelectShowChatButton,
  makeSelectNotifications,
  makeSelectMessages,
  makeSelectWaitingResponse,
  makeSelectCSO,
  makeSelectConnections,
  makeSelectChannels,
  makeSelectAgents,
  makeSelectAgentExport,
  makeSelectAgent,
  makeSelectAgentVersions,
  makeSelectCurrentAgent,
  makeSelectAgentWebhook,
  makeSelectAgentPostFormat,
  makeSelectAgentSettings,
  makeSelectAgentTouched,
  makeSelectSuccessAgent,
  makeSelectKeywords,
  makeSelectTotalKeywords,
  makeSelectSayings,
  makeSelectTotalSayings,
  makeSelectCategories,
  makeSelectPrebuiltCategories,
  makeSelectFilteredCategories,
  makeSelectFilteredActions,
  makeSelectSelectedCategory,
  makeSelectNewSayingActions,
  makeSelectActionsPage,
  makeSelectTotalActionsPage,
  makeSelectActions,
  makeSelectTotalActions,
  makeSelectAction,
  makeSelectCurrentAction,
  makeSelectActionTouched,
  makeSelectSuccessAction,
  makeSelectNewActionResponse,
  makeSelectActionWebhook,
  makeSelectActionPostFormat,
  makeSelectSayingForAction,
  makeSelectSettings,
  makeSelectSettingsTouched,
  makeSelectKeyword,
  makeSelectkeywordExamplesUpdate,
  makeSelectKeywordTouched,
  makeSelectSuccessKeyword,
  makeSelectConnection,
  makeSelectConnectionTouched,
  makeSelectSuccessConnection,
  makeSelectCategory,
  makeSelectCategoryTouched,
  makeSelectSuccessCategory,
  makeSelectDocuments,
  makeSelectTotalDocuments,
  makeSelectDocumentsAnalytics,
  makeSelectDocumentsStats,
  makeSelectTotalDocumentsAnalytics,
  makeSelectLogs,
  makeSelectLogsText,
  makeSelectSessions,
  makeSelectTotalSessions,
  makeSelectLocale,
  makeSelectStarredSayings,
  makeSelectStarredSaying,
  makeSelectUsers,
  makeSelectTotalUsers,
  makeSelectSuccessKeywordExamplesUpdate,
  makeSelectLoadingKeywordExamplesUpdate,
  makeSelectAccessPolicyGroups,
  makeSelectCurrentUser,
  makeSelectLoadingCurrentUser,
  makeSelectUser,
  makeSelectUserDataTouched,
};
