import {
  actionChannel,
  call,
  put,
  take,
  takeLatest
} from 'redux-saga/effects';
import {
  converseError,
  converseRespond,
  resetSessionError,
  resetSessionSuccess,
  missingAgent
} from '../App/actions';
import { CONVERSE, RESET_SESSION } from '../App/constants';

export function* postMessage(payload) {

  const { api, agent, message } = payload;
  if (agent){
    try {
      const response = yield call(api.agent.getAgentIdConverse, {
        id: agent,
        text: message,
        sessionId: 'articulateUI',
      });
      yield put(converseRespond(response.obj));
    } catch ({ response }) {
      yield put(converseError());
    }
  }
  else{
    yield put(missingAgent());
  }
}

export function* sendMessage() {
  const requestChan = yield actionChannel(CONVERSE);
  while (true) {
    const payload = yield take(requestChan);
    yield call(postMessage, { ...payload.payload, api: payload.api });
  }
}

export function* deleteSession(payload) {
  try {
    const { api } = payload;
    const response = yield call(api.context.deleteContextSessionid, { sessionId: 'articulateUI', });
    yield put(resetSessionSuccess());
  } catch ({ response }) {
    if (response.status && response.status === 404){
      yield put(resetSessionSuccess());
    }
    else {
      yield put(resetSessionError());
    }
  }
}

export function* resetSession() {
  const requestChan = yield actionChannel(RESET_SESSION);
  while (true) {
    const payload = yield take(requestChan);
    yield call(deleteSession, {api: payload.api});
  }
}

// Bootstrap sagas
export default [
  sendMessage,
  resetSession,
];
