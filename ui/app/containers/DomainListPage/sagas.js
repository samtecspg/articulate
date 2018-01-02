import { LOCATION_CHANGE } from 'react-router-redux';
import {
  call,
  cancel,
  cancelled,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  actionCancelled,
  agentDomainsLoaded,
  agentDomainsLoadingError,
  agentsLoaded,
  agentsLoadingError,
  deleteDomainError,
  deleteDomainSuccess,
  loadAgentDomains as loadAgentDomainsAction,
} from '../../containers/App/actions';
import {
  DELETE_DOMAIN,
  LOAD_AGENT_DOMAINS,
  LOAD_AGENTS,
} from '../../containers/App/constants';
import request from '../../utils/request';
import { makeSelectCurrentAgent } from '../App/selectors';

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

export function* deleteDomain() {
  const action = function* (payload) {
    const requestURL = `http://127.0.0.1:8000/domain/${payload.id}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    };

    try {
      yield call(request, requestURL, requestOptions);
      yield put(deleteDomainSuccess());
      // TODO: remove this call from here and use react-trunk or react-promise
      const currentAgent = yield select(makeSelectCurrentAgent());
      yield put(loadAgentDomainsAction(currentAgent.id));
    } catch (error) {
      yield put(deleteDomainError({
        message: `An error occurred deleting the domain [${payload.id}]`,
        error,
      }));
    }
  };
  const watcher = yield takeLatest(DELETE_DOMAIN, action);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  loadAgents,
  loadAgentDomains,
  deleteDomain,
];
