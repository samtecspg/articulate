import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { CREATE_DOMAIN, LOAD_AGENTS } from 'containers/App/constants';
import { domainCreated, domainCreationError, agentsLoaded, agentsLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { makeSelectDomainData } from 'containers/DomainPage/selectors';

export function* postDomain() {
  const domainData = yield select(makeSelectDomainData());
  domainData.intentThreshold = domain.intentThreshold/100;

  const requestURL = `http://127.0.0.1:8000/domain`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(domainData),
  }

  try {
    const domain = yield call(request, requestURL, requestOptions);
    yield put(domainCreated(domain, domain._id));
  } catch (error) {
    yield put(domainCreationError({
      message: 'An error ocurred creating the domain',
      error
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


// Bootstrap sagas
export default [
  createDomain,
  loadAgents
];
