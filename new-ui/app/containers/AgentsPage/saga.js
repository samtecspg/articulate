import { takeLatest, call, put } from 'redux-saga/effects';
import {
  loadAgentsError,
  loadAgentsSuccess,
  deleteAgentError,
  deleteAgentSuccess
} from '../App/actions';

import {
  LOAD_AGENTS,
  DELETE_AGENT
} from '../App/constants';

export function* getAgents(payload) {
  const { api } = payload;

  try {
    const response = yield call(api.agent.getAgent, {});
    yield put(loadAgentsSuccess(response.obj.data));
  } catch (err) {
    yield put(loadAgentsError(err));
  }
}

export function* deleteAgent(payload) {
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentAgentid, { agentId: id });
    yield put(deleteAgentSuccess());
    const response = yield call(api.agent.getAgent, {});
    yield put(loadAgentsSuccess(response.obj));
  } catch (err) {
      yield put(deleteAgentError(err));
  }
}

export default function* loadAgents() {
    yield takeLatest(LOAD_AGENTS, getAgents);
    yield takeLatest(DELETE_AGENT, deleteAgent);
}