import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { CREATE_INTENT, LOAD_DOMAINS, LOAD_AGENTS } from 'containers/App/constants';
import { intentCreated, intentCreationError, domainsLoaded, domainsLoadingError, agentsLoaded, agentsLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { makeSelectIntentData } from 'containers/IntentPage/selectors';

export function* postIntent() {
  const intentData = yield select(makeSelectIntentData());

  const requestURL = `http://127.0.0.1:8000/intent`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(intentData),
  }

  try {
    const intent = yield call(request, requestURL, requestOptions);
    yield put(intentCreated(intent, intent._id));
  } catch (error) {
    yield put(intentCreationError({
      message: 'An error ocurred creating the intent',
      error
    }));
  }
}

export function* createIntent() {
  const watcher = yield takeLatest(CREATE_INTENT, postIntent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getAgents() {
  const requestURL = `http://127.0.0.1:8000/agent?size=999`;

  try {
    const agents = yield call(request, requestURL);
    yield put(agentsLoaded(agents));
  } catch (error) {
    yield put(agentsLoadingError({
      message: 'An error ocurred loading the list of available agents',
      error
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
  const requestURL = `http://127.0.0.1:8000/domain?size=999`;

  try {
    const domains = yield call(request, requestURL);
    yield put(domainsLoaded(domains));
  } catch (error) {
    yield put(domainsLoadingError({
      message: 'An error ocurred loading the list of available domains',
      error
    }));
  }
}

export function* loadDomains() {
  const watcher = yield takeLatest(LOAD_DOMAINS, getDomains);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}



// Bootstrap sagas
export default [
  createIntent,
  loadAgents,
  loadDomains,
];
