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
  deleteDomainError,
  deleteDomainSuccess
} from '../../containers/App/actions';
import {
  DELETE_DOMAIN,
  LOAD_AGENT_DOMAINS,
} from '../../containers/App/constants';
import { makeSelectCurrentAgent } from '../App/selectors';

export function* getAgentDomains(payload) {
  const { api, agentId } = payload;
  try {
    const response = yield call(api.agent.getAgentIdDomain, { id: agentId.split('~')[0] });// TODO: Remove this notation
    yield put(agentDomainsLoaded(response.obj));
  } catch ({ response, ...rest }) {
    yield put(agentDomainsLoadingError({ message: response.obj.message }));
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

export function* deleteDomain() {
  const action = function* (payload) {
    const { api, id } = payload;
    const currentAgent = yield select(makeSelectCurrentAgent());

    try {
      yield call(api.domain.deleteDomainId, { id });
      yield put(deleteDomainSuccess());
      yield call(getAgentDomains, { api, agentId: currentAgent.id });
    } catch ({ response }) {
      yield put(deleteDomainError({ message: response.obj.message }));
    }
  };
  const watcher = yield takeLatest(DELETE_DOMAIN, action);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  loadAgentDomains,
  deleteDomain,
];
