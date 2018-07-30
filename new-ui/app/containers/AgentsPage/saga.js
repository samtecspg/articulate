import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { loadAgentsError, loadAgentsSuccess } from './actions';
import { LOAD_AGENTS } from './constants';

export function* getAgents() {
  const requestURL = `http://localhost:7500/agent`;

  try {
    const agents = yield call(request, requestURL);
    yield put(loadAgentsSuccess(agents));
  } catch (err) {
    yield put(loadAgentsError(err));
  }
}

export default function* loadAgents() {
    yield takeLatest(LOAD_AGENTS, getAgents);
}