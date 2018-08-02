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
  loadCurrentAgentStatusSuccess,
  loadSettingsSuccess,
  loadSettingsError,
} from '../../containers/App/actions';
import {
  LOAD_AGENTS,
  LOAD_CURRENT_AGENT,
  LOAD_CURRENT_AGENT_STATUS,
  TRAIN_AGENT,
  LOAD_SETTINGS,
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

export function* getCurrentAgentStatus(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.agent.getAgentId, { id });
    yield put(loadCurrentAgentStatusSuccess({
      status: response.obj.status,
      lastTraining: response.obj.lastTraining
    }));
  } catch (err) {
    const errObject = { err };
//     if (errObject.err && errObject.err.message === 'Failed to fetch'){
//       console.error('Can\'t find a connection with the API. Please check your API is alive and configured properly.');
//     }
//     else {
//       if (errObject.err.response.obj && errObject.err.response.obj.message){
//         console.error(errObject.err.response.obj.message);
//       }
//       else {
//         console.error('Unknow API error on getting current agent status');
//       }
//     }
  }
}

export function* loadCurrentAgentStatus() {
  const watcher = yield takeLatest(LOAD_CURRENT_AGENT_STATUS, getCurrentAgentStatus);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
}

export function* getTrainAgent(payload) {
  const { api, agentId } = payload;
  try {
    const response = yield call(api.agent.getAgentIdTrain, { id: agentId });
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      console.log('Can\'t find a connection with the API. Please check your API is alive and configured properly.');
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        console.log(errObject.err.response.obj.message);
      }
      else {
        console.log('Unknow API error on training');
      }
    }
  }
}

export function* trainAgent() {
  const watcher = yield takeLatest(TRAIN_AGENT, getTrainAgent);

  yield take(LOCATION_CHANGE);
}

export function* getSettings(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.settings.getSettings);
    const settings = response.obj;
    yield put(loadSettingsSuccess(settings));
  } catch (err) {
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch'){
      yield put(loadSettingsError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message){
        yield put(loadSettingsError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(loadSettingsError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* loadSettings() {
  const watcher = yield takeLatest(LOAD_SETTINGS, getSettings);

  // Suspend execution until location changes
  /*yield take(LOCATION_CHANGE);
  yield cancel(watcher);*/
}


export default [
  loadAgents,
  loadCurrentAgent,
  loadCurrentAgentStatus,
  trainAgent,
  loadSettings,
];
