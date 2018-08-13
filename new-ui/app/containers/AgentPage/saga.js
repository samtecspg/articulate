import { takeLatest, call, put } from 'redux-saga/effects';
import { loadAgentError, loadAgentSuccess } from '../App/actions';
import { LOAD_AGENT } from '../App/constants';

export function* getAgent(payload) {
  const { api, agentId } = payload;
  try {
    let response = yield call(api.agent.getAgentId, { id: agentId });
    const agent = response.obj;
    agent.domainClassifierThreshold = agent.domainClassifierThreshold * 100;
    response = yield call(api.agent.getAgentIdSettings, { id: agentId });
    const settings = response.obj;
    yield put(loadAgentSuccess({ agent, settings }));
  } catch (err) {
    yield put(loadAgentError(err));
  }
}

export default function* loadAgent() {
    yield takeLatest(LOAD_AGENT, getAgent);
}