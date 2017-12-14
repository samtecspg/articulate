import { LOCATION_CHANGE } from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';

import request from '../../utils/request';
import {
  agentsLoaded,
  agentsLoadingError,
  domainCreated,
  domainCreationError,
} from '../App/actions';
import {
  CREATE_DOMAIN,
  LOAD_AGENTS,
} from '../App/constants';
import { makeSelectDomainData } from './selectors';

export function* postDomain() {
  const domainData = yield select(makeSelectDomainData());
  domainData.intentThreshold = domainData.intentThreshold / 100;

  const requestURL = `http://127.0.0.1:8000/domain`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(domainData),
  };

  try {
    const domain = yield call(request, requestURL, requestOptions);
    yield put(domainCreated(domain, domain.id));
  } catch (error) {
    yield put(domainCreationError({
      message: 'An error ocurred creating the domain',
      error,
    }));
  }
}

export function* createDomain() {
  const watcher = yield takeLatest(CREATE_DOMAIN, postDomain);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getAgents() {
  const requestURL = `http://127.0.0.1:8000/agent`;

  try {
    const agents = yield call(request, requestURL);
    yield put(agentsLoaded(agents));
  } catch (error) {
    yield put(agentsLoadingError({
      message: 'An error ocurred loading the list of available agents',
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

// Bootstrap sagas
export default [
  createDomain,
  loadAgents,
];
