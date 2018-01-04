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
  loadAgentEntities as loadAgentEntitiesAction,
} from '../../containers/App/actions';
import {
  DELETE_ENTITY,
  LOAD_AGENT_ENTITIES,
} from '../../containers/App/constants';
import request from '../../utils/request';
import { makeSelectCurrentAgent } from '../App/selectors';

export function* getAgentEntities(payload) {
  const agentId = payload.agentId.split('~')[0];
  const requestURL = `http://127.0.0.1:8000/agent/${agentId}/entity`;
  try {
    const agentEntities = yield call(request, requestURL);
    yield put(agentEntitiesLoaded(agentEntities));
  } catch (error) {
    yield put(agentEntitiesLoadingError({
      message: 'An error occurred loading the list of available entities in this agent',
      error,
    }));
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
    const requestURL = `http://127.0.0.1:8000/entity/${payload.id}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    };

    try {
      yield call(request, requestURL, requestOptions);
      yield put(deleteEntitySuccess());
      // TODO: remove this call from here and use react-trunk or react-promise
      const currentAgent = yield select(makeSelectCurrentAgent());
      yield put(loadAgentEntitiesAction(currentAgent.id));
    } catch (error) {
      yield put(deleteEntityError({
        message: `An error occurred deleting the entity [${payload.id}]`,
        error,
      }));
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
