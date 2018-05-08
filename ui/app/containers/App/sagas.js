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
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(agentsLoadingError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(agentsLoadingError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(agentsLoadingError({ message: 'Unknow API error' }));
      }
    }
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
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(loadCurrentAgentError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(loadCurrentAgentError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(loadCurrentAgentError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* loadCurrentAgent() {
  const watcher = yield takeLatest(LOAD_CURRENT_AGENT, getCurrentAgent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
}

export default [
  loadAgents,
  loadCurrentAgent,
];
