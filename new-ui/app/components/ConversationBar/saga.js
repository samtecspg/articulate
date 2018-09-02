import { takeLatest, call, put } from 'redux-saga/effects';
import { loadAgentsError, loadAgentsSuccess } from '../App/actions';
import { LOAD_AGENTS } from '../App/constants';

export function* getAgents(payload) {
  const { api } = payload;

  try {
    const response = yield call(api.agent.getAgent, {});
    yield put(loadAgentsSuccess(response.obj));
  } catch (err) {
    yield put(loadAgentsError(err));
  }
}

export default function* loadAgents() {
    yield takeLatest(LOAD_AGENTS, getAgents);
}