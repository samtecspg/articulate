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

  try {
    const response = yield call(api.entity.putEntityId, { id, body: data });
    const entity = response.obj;
    yield put(updateEntitySuccess(entity));
    yield put(push('/entities'));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(updateEntityError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(updateEntityError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(updateEntityError({ message: 'Unknow API error' }));
      }
    }
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
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(loadEntityError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(loadEntityError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(loadEntityError({ message: 'Unknow API error' }));
      }
    }
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
