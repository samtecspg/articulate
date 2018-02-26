import { LOCATION_CHANGE } from 'react-router-redux';
import {
  call,
  cancel,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  agentsLoaded,
  agentsLoadingError,
  loadCurrentAgentError,
  loadCurrentAgentSuccess,
} from '../../containers/App/actions';
import {
  LOAD_AGENTS,
  LOAD_CURRENT_AGENT,
} from '../../containers/App/constants';

export function* getAgents(payload) {
  const { api } = payload;
  try {
    const response = yield call(api.agent.getAgent);
    yield put(agentsLoaded(response.obj));
  } catch ({ response }) {
    yield put(agentsLoadingError({ message: response.obj.message }));
  }
}

export function* loadAgents() {
 yield takeLatest(LOAD_AGENTS, getAgents);

}

export function* getCurrentAgent(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.agent.getAgentId, { id });
    yield put(loadCurrentAgentSuccess(response.obj));
  } catch ({ response }) {
    yield put(loadCurrentAgentError({ message: response.obj.message }));
  }
}

export function* loadCurrentAgent() {
  const watcher = yield takeLatest(LOAD_CURRENT_AGENT, getCurrentAgent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  //yield cancel(watcher);
}

// Bootstrap sagas
export default [
  loadAgents,
  loadCurrentAgent,
];
