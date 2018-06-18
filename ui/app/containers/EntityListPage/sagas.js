import { LOCATION_CHANGE } from 'react-router-redux';
import {
  call,
  cancel,
  cancelled,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  actionCancelled,
  agentEntitiesLoaded,
  agentEntitiesLoadingError,
  deleteEntityError,
  deleteEntitySuccess,
  loadEntityIntentsError,
  loadEntityIntentsSuccess,
} from '../../containers/App/actions';
import {
  DELETE_ENTITY,
  LOAD_AGENT_ENTITIES,
  LOAD_ENTITY_INTENTS
} from '../../containers/App/constants';
import { makeSelectCurrentAgent } from '../App/selectors';

export function* getAgentEntities(payload) {
  const { api, agentId, page, filter, forIntentEdit } = payload;
  let start = 0;
  let limit = -1;
  if (page || page === 0){
    start = page * 10;
    limit = start + 10;
  }
  try {
    const response = yield call(api.agent.getAgentIdEntity, {
      id: agentId.toString().split('~')[0],
      start,
      limit,
      filter
    });// TODO: Remove this notation
    const agentEntities = response.obj;
    yield put(agentEntitiesLoaded(agentEntities));
    if (!forIntentEdit){
      const entityResponse = yield agentEntities.entities.map(entity => {
        return call(getEntityIntents, { api, id: entity.id });
      });
    }
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(agentEntitiesLoadingError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(agentEntitiesLoadingError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(agentEntitiesLoadingError({ message: 'Unknow API error' }));
      }
    }
  } finally {
    if (yield cancelled()) {}
  }
}

export function* loadAgentEntities() {
  const watcher = yield takeLatest(LOAD_AGENT_ENTITIES, getAgentEntities);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* deleteEntity() {
  const action = function* (payload) {
    const { api, id } = payload;
    const currentAgent = yield select(makeSelectCurrentAgent());
    try {
      yield call(api.entity.deleteEntityId, { id });
      yield put(deleteEntitySuccess());
      yield call(getAgentEntities, { api, agentId: currentAgent.id });
    } catch (err) {
      const errObject = { err };
      if (errObject.err && errObject.err.message === 'Failed to fetch'){
        yield put(deleteEntityError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
      }
      else {
        if (errObject.err.response.obj && errObject.err.response.obj.message){
          yield put(deleteEntityError({ message: errObject.err.response.obj.message }));
        }
        else {
          yield put(deleteEntityError({ message: 'Unknow API error' }));
        }
      }
    }
  };
  const watcher = yield takeLatest(DELETE_ENTITY, action);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getEntityIntents(payload) {
  const { api, id } = payload;
  try {

    const response = yield call(api.entity.getEntityIdIntent, { id });
    const intents = response.obj;
    yield put(loadEntityIntentsSuccess({ id, intents }));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(loadEntityIntentsError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(loadEntityIntentsError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(loadEntityIntentsError({ message: 'Unknow API error' }));
      }
    }
  } finally {
    if (yield cancelled()) { }
  }
}

export function* loadEntityIntents() {
  const watcher = yield takeLatest(LOAD_ENTITY_INTENTS, getEntityIntents);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  loadAgentEntities,
  deleteEntity,
  loadEntityIntents,
];
