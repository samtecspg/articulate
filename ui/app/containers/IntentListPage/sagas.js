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
} from '../../containers/App/actions';
import {
  DELETE_INTENT,
  LOAD_AGENT_DOMAINS,
  LOAD_DOMAINS_INTENTS
} from '../../containers/App/constants';
import { getAgentDomains } from '../../containers/DomainListPage/sagas';

export function* getDomainIntents(payload) {
  const { api, domainId } = payload;
  try {
    const response = yield call(api.domain.getDomainIdIntent, { id: domainId });
    const intents = response.obj;
    yield put(domainIntentsLoaded(intents));
  } catch ({ response }) {
    yield put(domainIntentsLoadingError({ message: response.obj.message }));
  }
}

export function* loadDomainIntents() {
  const watcher = yield takeLatest(LOAD_DOMAINS_INTENTS, getDomainIntents);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* deleteIntent() {
  const action = function* (payload) {
    const { api, intentId, domainId } = payload;
    try {
      yield call(api.intent.deleteIntentId, { id: intentId });
      yield put(deleteIntentSuccess());
      yield call(getDomainIntents, { api, domainId });
    } catch ({ response }) {
      yield put(deleteIntentError({ message: response.obj.message }));
    }
  };
  const watcher = yield takeLatest(DELETE_INTENT, action);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadAgentDomains() {
  const watcher = yield takeLatest(LOAD_AGENT_DOMAINS, getAgentDomains);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  loadDomainIntents,
  deleteIntent,
  loadAgentDomains
];
