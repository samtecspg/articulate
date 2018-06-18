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
  const { api, agentId, page, filter } = payload;
  let start = 0;
  let limit = -1;
  if (page || page === 0){
    start = page * 10;
    limit = start + 10;
  }
  try {
    const response = yield call(api.agent.getAgentIdDomain, {
      id: agentId.toString().split('~')[0],
      start,
      limit,
      filter
    });// TODO: Remove this notation
    yield put(agentDomainsLoaded(response.obj));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(agentDomainsLoadingError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(agentDomainsLoadingError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(agentDomainsLoadingError({ message: 'Unknow API error' }));
      }
    }
  } finally {
    if (yield cancelled()) {}
  }
}

export function* loadAgentDomains() {
  const watcher = yield takeLatest(LOAD_AGENT_DOMAINS, getAgentDomains);
}

export function* deleteDomain() {
  const action = function* (payload) {
    const { api, id } = payload;
    const currentAgent = yield select(makeSelectCurrentAgent());

    try {
      yield call(api.domain.deleteDomainId, { id });
      yield put(deleteDomainSuccess());
      yield call(getAgentDomains, { api, agentId: currentAgent.id });
    } catch (err) {
      const errObject = { err };
      if (errObject.err && errObject.err.message === 'Failed to fetch'){
        yield put(deleteDomainError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
      }
      else {
        if (errObject.err.response.obj && errObject.err.response.obj.message){
          yield put(deleteDomainError({ message: errObject.err.response.obj.message }));
        }
        else {
          yield put(deleteDomainError({ message: 'Unknow API error' }));
        }
      }
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
