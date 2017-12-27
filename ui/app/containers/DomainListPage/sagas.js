import { LOCATION_CHANGE } from 'react-router-redux';

import {
  call,
  cancel,
  cancelled,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  agentDomainsLoaded,
  agentDomainsLoadingError,
  agentsLoaded,
  agentsLoadingError,
  actionCancelled,
} from '../../containers/App/actions';
import {
  LOAD_AGENT_DOMAINS,
  LOAD_AGENTS,
} from '../../containers/App/constants';

import request from '../../utils/request';

export function* getAgentDomains(payload) {
  const agentId = payload.agentId.split('~')[0];
  const requestURL = `http://127.0.0.1:8000/agent/${agentId}/domain`;
  try {
    const agentDomains = yield call(request, requestURL);
    yield put(agentDomainsLoaded(agentDomains));
  } catch (error) {
    yield put(agentDomainsLoadingError({
      message: 'An error occurred loading the list of available domains in this agent',
      error,
    }));
  } finally {
    if (yield cancelled()) {
      yield put(actionCancelled({
        message: 'Get Agent Domains Cancelled',
      }));
    }
  }
}

export function* loadAgentDomains() {
  const watcher = yield takeLatest(LOAD_AGENT_DOMAINS, getAgentDomains);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

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

export function* getDomains() {
  const requestURL = 'http://127.0.0.1:8000/domains';

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

// Bootstrap sagas
export default [
  loadAgents,
  loadAgentDomains,
];
