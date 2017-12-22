import { makeSelectAgentData } from 'containers/AgentPage/selectors';
import {
  agentCreated,
  agentCreationError,
} from 'containers/App/actions';
import { CREATE_AGENT } from 'containers/App/constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';

import request from 'utils/request';

export function* postAgent() {
  const agentData = yield select(makeSelectAgentData());
  agentData.domainClassifierThreshold = agentData.domainClassifierThreshold / 100;

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
  } catch (error) {
    yield put(agentCreationError({
      message: 'An error ocurred creating the agent',
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
