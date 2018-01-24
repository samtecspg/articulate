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
  entityCreated,
  entityCreationError,
  updateEntityError,
  updateEntitySuccess
} from '../App/actions';
import {
  CREATE_ENTITY,
  UPDATE_ENTITY
} from '../App/constants';
import {
  loadEntityError,
  loadEntitySuccess
} from './actions';
import { LOAD_ENTITY } from './constants';
import { makeSelectEntityData } from './selectors';

export function* postEntity(payload) {
  const { api } = payload;
  const entityData = yield select(makeSelectEntityData());
  try {
    const response = yield call(api.entity.postEntity, { body: entityData });
    const entity = response.obj;
    yield put(entityCreated(entity, entity.id));
  } catch ({ response }) {
    yield put(entityCreationError({ message: response.obj.message }));
  }
}

export function* createEntity() {
  const watcher = yield takeLatest(CREATE_ENTITY, postEntity);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* putEntity(payload) {
  const { api } = payload;
  const entityData = yield select(makeSelectEntityData());
  const { id, agent,...data } = entityData;
  console.log(`putEntity::${JSON.stringify(entityData)}`); // TODO: REMOVE!!!!

  try {
    const response = yield call(api.entity.putEntityId, { id, body: data });
    const entity = response.obj;
    yield put(updateEntitySuccess(entity));
    yield put(push('/entities'));
  } catch ({ response }) {
    yield put(updateEntityError({ message: response.obj.message }));
  }
}

export function* updateEntity() {
  const watcher = yield takeLatest(UPDATE_ENTITY, putEntity);
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getEntity(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.entity.getEntityId, { id });
    const entity = response.obj;
    yield put(loadEntitySuccess(entity));
  } catch ({ response }) {
    yield put(loadEntityError({ message: response.obj.message }));
  }
}

export function* loadEntity() {
  const watcher = yield takeLatest(LOAD_ENTITY, getEntity);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  createEntity,
  updateEntity,
  loadEntity,
];
