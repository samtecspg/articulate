import { LOCATION_CHANGE } from 'react-router-redux';
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
} from '../App/actions';
import { CREATE_DOMAIN, } from '../App/constants';
import { makeSelectDomainData } from './selectors';

export function* postDomain(payload) {
  const { api } = payload;
  const domainData = yield select(makeSelectDomainData());
  domainData.intentThreshold = domainData.intentThreshold / 100;
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

// Bootstrap sagas
export default [
  createDomain,
];
