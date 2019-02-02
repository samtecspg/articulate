import { takeLatest, call, put } from 'redux-saga/effects';
import {
  loadAgentsError,
  loadAgentsSuccess,
  exportAgentError,
  exportAgentSuccess,
  importAgentSuccess,
  importAgentError
} from '../App/actions';

import {
  LOAD_AGENTS,
  EXPORT_AGENT,
  IMPORT_AGENT
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

export function* postAgentImport(payload) {
  const { api, agent } = payload;
  try {
    const response = yield call(api.agent.postAgentImport, { body: agent });
    yield put(importAgentSuccess(response.obj));
    yield call(getAgents, { api });
  } catch (err) {
    yield put(importAgentError(err));
  }
}

export default function* loadAgents() {
  yield takeLatest(LOAD_AGENTS, getAgents);
  yield takeLatest(EXPORT_AGENT, getAgentExport);
  yield takeLatest(IMPORT_AGENT, postAgentImport);
}