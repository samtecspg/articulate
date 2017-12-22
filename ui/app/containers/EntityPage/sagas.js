import {
  agentsLoaded,
  agentsLoadingError,
  entityCreated,
  entityCreationError,
} from 'containers/App/actions';
import {
  CREATE_ENTITY,
  LOAD_AGENTS,
} from 'containers/App/constants';
import { makeSelectEntityData } from 'containers/EntityPage/selectors';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';

import request from 'utils/request';

export function* postEntity() {
  const entityData = yield select(makeSelectEntityData());

  const requestURL = `http://127.0.0.1:8000/entity`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entityData),
  };

  try {
    const entity = yield call(request, requestURL, requestOptions);
    yield put(entityCreated(entity, entity.id));
  } catch (error) {
    yield put(entityCreationError({
      message: 'An error occurred creating the entity',
      error,
    }));
  }
}

export function* createEntity() {
  const watcher = yield takeLatest(CREATE_ENTITY, postEntity);

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
      message: 'An error occurred loading the list of available agents',
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
  createEntity,
  loadAgents,
];
