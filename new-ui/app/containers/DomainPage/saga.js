import Immutable from 'seamless-immutable';

import {
    takeLatest,
    call,
    put,
    select,
} from 'redux-saga/effects';

import {
  loadDomainSuccess,
  loadDomainError,
  createDomainSuccess,
  createDomainError,
  updateDomainSuccess,
  updateDomainError,
} from '../App/actions';

import {
    LOAD_DOMAIN,
    CREATE_DOMAIN,
    UPDATE_DOMAIN
} from '../App/constants';

import {
    makeSelectAgent, makeSelectDomain,
} from '../App/selectors';

export function* getDomain(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.domain.getDomainId, {
        id
    });
    response.obj.actionThreshold = response.obj.actionThreshold * 100;
    yield put(loadDomainSuccess(response.obj));
  } catch (err) {
      yield put(loadDomainError(err));
  }
}

export function* postDomain(payload) {
    const agent = yield select(makeSelectAgent());
    const domain = yield select(makeSelectDomain());
    const newDomain = Immutable.asMutable(domain, { deep: true });
    newDomain.agent = agent.agentName;
    newDomain.actionThreshold = newDomain.actionThreshold / 100;
    const { api } = payload;
    try {
        const response = yield call(api.domain.postDomain, { body: newDomain });
        yield put(createDomainSuccess(response.obj));
    } catch (err) {
        yield put(createDomainError(err));
    }
}

export function* putDomain(payload) {
    const domain = yield select(makeSelectDomain());
    const mutableDomain = Immutable.asMutable(domain, { deep: true });
    const domainId = domain.id;
    const { api } = payload;
    delete mutableDomain.id;
    delete mutableDomain.agent;
    mutableDomain.actionThreshold = mutableDomain.actionThreshold / 100;
    try {
        const response = yield call(api.domain.putDomainId, { id: domainId, body: mutableDomain });
        yield put(updateDomainSuccess(response.obj));
    } catch (err) {
        yield put(updateDomainError(err));
    }
}

export default function* rootSaga() {
    yield takeLatest(LOAD_DOMAIN, getDomain);
    yield takeLatest(CREATE_DOMAIN, postDomain);
    yield takeLatest(UPDATE_DOMAIN, putDomain);
};