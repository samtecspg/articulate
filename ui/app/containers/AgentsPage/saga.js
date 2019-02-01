import { takeLatest, call, put } from 'redux-saga/effects';
import {
  loadAgentsError,
  loadAgentsSuccess,
  exportAgentError,
  exportAgentSuccess
} from '../App/actions';

import {
  LOAD_AGENTS,
  EXPORT_AGENT
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

export function* getAgentExport(payload) {
  const { api, id } = payload;

  try {
    if (id !== 0){
      const response = yield call(api.agent.getAgentAgentidExport, {
        agentId: id
      });
      yield put(exportAgentSuccess(response.obj));
    }
    else {
      yield put(exportAgentSuccess(null));
    }
  } catch (err) {
    yield put(exportAgentError(err));
  }
}

export default function* loadAgents() {
  yield takeLatest(LOAD_AGENTS, getAgents);
  yield takeLatest(EXPORT_AGENT, getAgentExport);
}