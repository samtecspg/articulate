import { LOCATION_CHANGE } from 'react-router-redux';

import {
  call,
  cancel,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  deleteIntentError,
  deleteIntentSuccess,
  domainIntentsLoaded,
  domainIntentsLoadingError,
  loadAgentIntentsError,
  loadAgentIntentsSuccess,
} from '../../containers/App/actions';
import {
  DELETE_INTENT,
  LOAD_AGENT_DOMAINS,
  LOAD_AGENT_INTENTS,
  LOAD_DOMAINS_INTENTS
} from '../../containers/App/constants';
import { getAgentDomains } from '../../containers/DomainListPage/sagas';

export function* getDomainIntents(payload) {
  const { api, domainId, page, filter } = payload;
  let start = 0;
  let limit = -1;
  if (page || page === 0){
    start = page * 10;
    limit = start + 10;
  }
  try {
    const response = yield call(api.domain.getDomainIdIntent, {
      id: domainId,
      start,
      limit,
      filter
    });
    const intents = response.obj;
    yield put(domainIntentsLoaded(intents));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(domainIntentsLoadingError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(domainIntentsLoadingError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(domainIntentsLoadingError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* loadDomainIntents() {
  const watcher = yield takeLatest(LOAD_DOMAINS_INTENTS, getDomainIntents);
}

export function* deleteIntent() {
  const action = function* (payload) {
    const { api, intentId, filterId, currentFilter } = payload;
    try {
      yield call(api.intent.deleteIntentId, { id: intentId });
      yield put(deleteIntentSuccess());
      if (currentFilter === 'domain') {
        yield call(getDomainIntents, { api, domainId: filterId });
      }
      else {
        yield call(getAgentIntents, { api, agentId: filterId });
      }
    } catch (err) {
      const errObject = { err };
      if (errObject.err && errObject.err.message === 'Failed to fetch'){
        yield put(deleteIntentError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
      }
      else {
        if (errObject.err.response.obj && errObject.err.response.obj.message){
          yield put(deleteIntentError({ message: errObject.err.response.obj.message }));
        }
        else {
          yield put(deleteIntentError({ message: 'Unknow API error' }));
        }
      }
    }
  };
  const watcher = yield takeLatest(DELETE_INTENT, action);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getAgentIntents(payload) {
  const { api, agentId, page, filter } = payload;
  let start = 0;
  let limit = -1;
  if (page || page === 0){
    start = page * 10;
    limit = start + 10;
  }
  try {
    const response = yield call(api.agent.getAgentIdIntent, {
      id: agentId,
      start,
      limit,
      filter
    });
    const intents = response.obj;
    yield put(loadAgentIntentsSuccess(intents));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(loadAgentIntentsError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(loadAgentIntentsError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(loadAgentIntentsError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* loadAgentDomains() {
  const watcher = yield takeLatest(LOAD_AGENT_DOMAINS, getAgentDomains);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadAgentIntents() {
  const watcher = yield takeLatest(LOAD_AGENT_INTENTS, getAgentIntents);

}

// Bootstrap sagas
export default [
  loadDomainIntents,
  deleteIntent,
  loadAgentDomains,
  loadAgentIntents,
];
