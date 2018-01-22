import {
  LOCATION_CHANGE,
  push
} from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  domainCreated,
  domainCreationError,
  updateDomainError,
  updateDomainSuccess
} from '../App/actions';
import {
  CREATE_DOMAIN,
  UPDATE_DOMAIN
} from '../App/constants';
import {
  loadDomainError,
  loadDomainSuccess
} from './actions';
import { LOAD_DOMAIN } from './constants';
import { makeSelectDomainData } from './selectors';

export function* postDomain(payload) {
  const { api } = payload;
  const domainData = yield select(makeSelectDomainData());
  domainData.intentThreshold /= 100;
  try {
    const response = yield call(api.domain.postDomain, { body: domainData });
    const domain = response.obj;
    yield put(domainCreated(domain, domain.id));
  } catch ({ response }) {
    yield put(domainCreationError({ message: response.obj.message }));
  }
}

export function* createDomain() {
  const watcher = yield takeLatest(CREATE_DOMAIN, postDomain);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* putDomain(payload) {
  const { api } = payload;
  const domainData = yield select(makeSelectDomainData());
  const { id, agent, ...data } = domainData;
  data.intentThreshold /= 100;

  try {
    const response = yield call(api.domain.putDomainId, { id, body: data });
    const domain = response.obj;
    yield put(updateDomainSuccess(domain));
    yield put(push('/domains'));
  } catch ({ response }) {
    yield put(updateDomainError({ message: response.obj.message }));
  }
}

export function* updateDomain() {
  const watcher = yield takeLatest(UPDATE_DOMAIN, putDomain);
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getDomain(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.domain.getDomainId, { id });
    const domain = response.obj;
    domain.intentThreshold *= 100;
    yield put(loadDomainSuccess(domain));
  } catch ({ response }) {
    yield put(loadDomainError({ message: response.obj.message }));
  }
}

export function* loadDomain() {
  const watcher = yield takeLatest(LOAD_DOMAIN, getDomain);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  createDomain,
  updateDomain,
  loadDomain,
];
