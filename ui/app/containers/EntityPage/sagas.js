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
  entityCreated,
  entityCreationError,
} from '../../containers/App/actions';
import { CREATE_ENTITY, } from '../../containers/App/constants';
import { makeSelectEntityData } from '../../containers/EntityPage/selectors';

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

// Bootstrap sagas
export default [
  createEntity,
];
