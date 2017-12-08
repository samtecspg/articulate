import { LOCATION_CHANGE } from 'react-router-redux';

import {
  call,
  cancel,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  agentDomainsLoaded,
  agentDomainsLoadingError,
  agentsLoaded,
  agentsLoadingError,
  domainIntentsLoaded,
  domainIntentsLoadingError,
} from '../../containers/App/actions';
import {
  LOAD_AGENT_DOMAINS,
  LOAD_AGENTS,
  LOAD_DOMAINS_INTENTS,
} from '../../containers/App/constants';

import request from '../../utils/request';

// AGENTS
export function* getAgents() {
  const requestURL = 'http://127.0.0.1:8000/agent';

  try {
    const agents = yield call(request, requestURL);
    yield put(agentsLoaded(agents));
  } catch (error) {
    yield put(agentsLoadingError({
      message: 'An error occurred loading the list of available agents',
      error,
    }));
  }
}

export function* loadAgents() {
  const watcher = yield takeLatest(LOAD_AGENTS, getAgents);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// AGENT DOMAINS
export function* getAgentDomains(payload) {
  const agentId = payload.agentId;
  const requestURL = `http://127.0.0.1:8000/agent/${agentId}/domain`;

  try {
    const agentDomains = yield call(request, requestURL);
    yield put(agentDomainsLoaded(agentDomains));
  } catch (error) {
    yield put(agentDomainsLoadingError({
      message: 'An error occurred loading the list of available domains in this agent',
      error,
    }));
  }
}

export function* loadAgentDomains() {
  const watcher = yield takeLatest(LOAD_AGENT_DOMAINS, getAgentDomains);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// DOMAIN INTENTS
export function* getDomainIntents(payload) {
  const domainId = payload.domainId;

  const requestURL = `http://127.0.0.1:8000/domain/${domainId}/intent`;

  try {
    const intents = yield call(request, requestURL);
    yield put(domainIntentsLoaded(intents));
  } catch (error) {
    yield put(domainIntentsLoadingError({
      message: 'An error occurred loading the list of available intents',
      error,
    }));
  }
}

export function* loadDomainIntents() {
  const watcher = yield takeLatest(LOAD_DOMAINS_INTENTS, getDomainIntents);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  loadAgents,
  loadAgentDomains,
  loadDomainIntents,
];
