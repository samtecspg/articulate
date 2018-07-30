import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { loadAgentError, loadAgentSuccess } from './actions';
import { LOAD_AGENT } from './constants';

export function* getAgent(payload) {
  const { agentId } = payload;
  const requestURL = `http://localhost:7500/agent/${agentId}`;
  try {
    const agent = yield call(request, requestURL);
    agent.domainClassifierThreshold = agent.domainClassifierThreshold * 100;
    yield put(loadAgentSuccess(agent));
  } catch (err) {
    yield put(loadAgentError(err));
  }
}

export default function* loadAgent() {
    yield takeLatest(LOAD_AGENT, getAgent);
}