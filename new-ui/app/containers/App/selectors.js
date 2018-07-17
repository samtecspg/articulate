import { createSelector } from 'reselect';

const selectGlobalCategory = state => state.global;
const selectRouteCategory = state => state.route;

/* Global */
const makeSelectLocation = () => createSelector(
  selectRouteCategory,
  (routeState) => routeState.location,
);

const makeSelectMissingAPI = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.missingAPI,
);

const makeSelectLoading = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.loading,
);

const makeSelectError = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.error,
);

const makeSelectSuccess = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.success,
);

const makeSelectConversationBarOpen = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.conversationBarOpen,
);

const makeSelectNotifications = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.notifications,
);

const makeSelectMessages = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.messages,
);

const makeSelectWaitingResponse = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.waitingResponse,
);

const makeSelectConversationStateObject = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.conversationStateObject,
);

/* Agents */
const makeSelectAgents = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.agents,
);

/* Agent */
const makeSelectAgent = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.agent,
);

const makeSelectCurrentAgent = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.currentAgent,
);

const makeSelectAgentWebhook = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.agentWebhook,
);

const makeSelectAgentPostFormat = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.agentPostFormat,
);

const makeSelectAgentSettings = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.agentSettings,
);

const makeSelectAgentTouched = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.agentTouched,
);

const makeSelectDocuments = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.documents,
);

const makeSelectTotalDocuments = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.totalDocuments,
);

/* Keywords */
const makeSelectKeywords = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.keywords,
);

const makeSelectTotalKeywords = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.totalKeywords,
);

/* Sayings */
const makeSelectSayings = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.sayings,
);

const makeSelectTotalSayings = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.totalSayings,
);

const makeSelectCategories = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.categories,
);

const makeSelectFilteredCategories = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.filteredCategories,
);

const makeSelectSelectedCategory = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.selectedCategory,
);

const makeSelectNewSayingActions = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.newSayingActions,
);

/* Actions */
const makeSelectActions = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.actions,
);

const makeSelectCurrentAction = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.currentAction,
);

const makeSelectTotalActions = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.totalActions,
);

const makeSelectAction = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.action,
);

const makeSelectActionWebhook = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.actionWebhook,
);

const makeSelectActionPostFormat = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.actionPostFormat,
);

const makeSelectSayingForAction = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.sayingForAction,
);

/* Settings */
const makeSelectSettings = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.settings,
);

/* Keyword */
const makeSelectKeyword = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.keyword,
);

/* Category */
const makeSelectCategory = () => createSelector(
  selectGlobalCategory,
  (globalState) => globalState.category,
);

export {
  makeSelectLocation,
  makeSelectMissingAPI,
  makeSelectLoading,
  makeSelectError,
  makeSelectSuccess,
  makeSelectConversationBarOpen,
  makeSelectNotifications,
  makeSelectMessages,
  makeSelectWaitingResponse,
  makeSelectConversationStateObject,
  makeSelectAgents,
  makeSelectAgent,
  makeSelectCurrentAgent,
  makeSelectAgentWebhook,
  makeSelectAgentPostFormat,
  makeSelectAgentSettings,
  makeSelectAgentTouched,
  makeSelectKeywords,
  makeSelectTotalKeywords,
  makeSelectSayings,
  makeSelectTotalSayings,
  makeSelectCategories,
  makeSelectFilteredCategories,
  makeSelectSelectedCategory,
  makeSelectNewSayingActions,
  makeSelectActions,
  makeSelectTotalActions,
  makeSelectAction,
  makeSelectCurrentAction,
  makeSelectActionWebhook,
  makeSelectActionPostFormat,
  makeSelectSayingForAction,
  makeSelectSettings,
  makeSelectKeyword,
  makeSelectCategory,
  makeSelectDocuments,
  makeSelectTotalDocuments,
};
