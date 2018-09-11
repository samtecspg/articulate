import { createSelector } from 'reselect';

const selectGlobalDomain = state => state.global;
const selectRouteDomain = state => state.route;

/* Global */
const makeSelectLocation = () => createSelector(
  selectRouteDomain,
  (routeState) => {
    return routeState.location;
  }
);

const makeSelectMissingAPI = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.missingAPI;
  }
);

const makeSelectLoading = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.loading;
  }
);

const makeSelectError = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.error;
  }
);

const makeSelectSuccess = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.success;
  }
);

const makeSelectConversationBarOpen = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.conversationBarOpen;
  }
);

const makeSelectNotifications = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.notifications;
  }
);

const makeSelectMessages = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.messages;
  }
);

const makeSelectWaitingResponse = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.waitingResponse;
  }
);

const makeSelectDoc = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.doc;
  }
);

/* Agents */
const makeSelectAgents = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.agents;
  }
);

/* Agent */
const makeSelectAgent = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.agent;
  }
);

const makeSelectCurrentAgent = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.currentAgent;
  }
);

const makeSelectAgentWebhook = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.agentWebhook;
  }
);

const makeSelectAgentPostFormat = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.agentPostFormat;
  }
);

const makeSelectAgentSettings = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.agentSettings;
  }
);

/* Keywords */
const makeSelectKeywords = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.keywords;
  }
);

const makeSelectTotalKeywords = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.totalKeywords;
  }
);

/* Sayings */
const makeSelectSayings = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.sayings;
  }
);

const makeSelectTotalSayings = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.totalSayings;
  }
);

const makeSelectDomains = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.domains;
  }
);

const makeSelectFilteredDomains = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.filteredDomains;
  }
);

const makeSelectSelectedDomain = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.selectedDomain;
  }
);

/* Actions */
const makeSelectActions = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.actions;
  }
);

const makeSelectCurrentAction = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.currentAction;
  }
);

const makeSelectTotalActions = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.totalActions;
  }
);

const makeSelectAction = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.action;
  }
);

const makeSelectActionWebhook = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.actionWebhook;
  }
);

const makeSelectActionPostFormat = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.actionPostFormat;
  }
);

const makeSelectSayingForAction = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.sayingForAction;
  }
);

/* Settings */
const makeSelectSettings = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
      return globalState.settings;
  }
);

/* Keyword */
const makeSelectKeyword = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.keyword;
  }
);

/* Domain */
const makeSelectDomain = () => createSelector(
  selectGlobalDomain,
  (globalState) => {
    return globalState.domain;
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
  makeSelectDomains,
  makeSelectFilteredDomains,
  makeSelectSelectedDomain,

  makeSelectActions,
  makeSelectTotalActions,
  makeSelectAction,
  makeSelectCurrentAction,
  makeSelectActionWebhook,
  makeSelectActionPostFormat,
  makeSelectSayingForAction,

  makeSelectSettings,

  makeSelectKeyword,

  makeSelectDomain,
};
