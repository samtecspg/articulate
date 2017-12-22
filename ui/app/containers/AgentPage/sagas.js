import { LOCATION_CHANGE } from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';

import request from '../../utils/request';
import { makeSelectAgentData } from '../AgentPage/selectors';
import {
  agentCreated,
  agentCreationError,
  loadAgents,
  selectCurrentAgent,
} from '../App/actions';
import { CREATE_AGENT } from '../App/constants';

export function* postAgent() {
  const agentData = yield select(makeSelectAgentData());
  agentData.domainClassifierThreshold /= 100;

  const requestURL = `http://127.0.0.1:8000/agent`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentData),
  };

  try {
    const agent = yield call(request, requestURL, requestOptions);
    yield put(agentCreated(agent, agent.id));
    yield put(loadAgents());
    yield put(selectCurrentAgent(agent));
  } catch (error) {
    yield put(agentCreationError({
      message: 'An error occurred creating the agent',
      error,
    }));
  }
}

export function* createAgent() {
  const watcher = yield takeLatest(CREATE_AGENT, postAgent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  createAgent,
];
