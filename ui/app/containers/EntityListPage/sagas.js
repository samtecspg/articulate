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
} from '../../containers/App/actions';
import {
  DELETE_ENTITY,
  LOAD_AGENT_ENTITIES,
} from '../../containers/App/constants';
import { makeSelectCurrentAgent } from '../App/selectors';

export function* getAgentEntities(payload) {
  const { api, agentId } = payload;
  try {
    const response = yield call(api.agent.getAgentIdEntity, { id: agentId.split('~')[0] }); // TODO: Remove this notation
    const agentEntities = response.obj;
    yield put(agentEntitiesLoaded(agentEntities));
  } catch ({ response }) {
    yield put(agentEntitiesLoadingError({ message: response.obj.message }));
  } finally {
    if (yield cancelled()) {
      yield put(actionCancelled({
        message: 'Get Agent Entities Cancelled',
      }));
    }
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
    } catch ({ response }) {
      yield put(deleteEntityError({ message: response.obj.message }));
    }
  };
  const watcher = yield takeLatest(DELETE_ENTITY, action);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  loadAgentEntities,
  deleteEntity,
];
