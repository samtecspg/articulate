import { createSelector } from 'reselect';

const selectGlobalCategory = state => state.global;
const selectRouteCategory = state => state.route;

/* Global */
const makeSelectLocation = () => createSelector(
  selectRouteCategory,
  (routeState) => {
    return routeState.location;
  }
);

const makeSelectMissingAPI = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.missingAPI;
  }
);

const makeSelectLoading = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.loading;
  }
);

const makeSelectError = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.error;
  }
);

const makeSelectSuccess = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.success;
  }
);

const makeSelectConversationBarOpen = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.conversationBarOpen;
  }
);

const makeSelectNotifications = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.notifications;
  }
);

const makeSelectMessages = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.messages;
  }
);

const makeSelectWaitingResponse = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.waitingResponse;
  }
);

const makeSelectDoc = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.doc;
  }
);

/* Agents */
const makeSelectAgents = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.agents;
  }
);

/* Agent */
const makeSelectAgent = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.agent;
  }
);

const makeSelectCurrentAgent = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.currentAgent;
  }
);

const makeSelectAgentWebhook = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.agentWebhook;
  }
);

const makeSelectAgentPostFormat = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.agentPostFormat;
  }
);

const makeSelectAgentSettings = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.agentSettings;
  }
);

/* Keywords */
const makeSelectKeywords = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.keywords;
  }
);

const makeSelectTotalKeywords = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.totalKeywords;
  }
);

/* Sayings */
const makeSelectSayings = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.sayings;
  }
);

const makeSelectTotalSayings = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.totalSayings;
  }
);

const makeSelectCategories = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.categories;
  }
);

const makeSelectFilteredCategories = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.filteredCategories;
  }
);

const makeSelectSelectedCategory = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.selectedCategory;
  }
);

const makeSelectNewSayingActions = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.newSayingActions;
  }
);

/* Actions */
const makeSelectActions = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.actions;
  }
);

const makeSelectCurrentAction = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.currentAction;
  }
);

const makeSelectTotalActions = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.totalActions;
  }
);

const makeSelectAction = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.action;
  }
);

const makeSelectActionWebhook = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.actionWebhook;
  }
);

const makeSelectActionPostFormat = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.actionPostFormat;
  }
);

const makeSelectSayingForAction = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.sayingForAction;
  }
);

/* Settings */
const makeSelectSettings = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
      return globalState.settings;
  }
);

/* Keyword */
const makeSelectKeyword = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.keyword;
  }
);

/* Category */
const makeSelectCategory = () => createSelector(
  selectGlobalCategory,
  (globalState) => {
    return globalState.category;
  }
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
  makeSelectDoc,

  makeSelectAgents,

  makeSelectAgent,
  makeSelectCurrentAgent,
  makeSelectAgentWebhook,
  makeSelectAgentPostFormat,
  makeSelectAgentSettings,

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
};
