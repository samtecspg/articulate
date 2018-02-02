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
} from '../App/actions';
import { CONVERSE } from '../App/constants';

export function* postMessage(payload) {

  const { api, agent, message } = payload;
  try {
    const response = yield call(api.agent.getAgentIdConverse, {
      id: agent,
      text: message,
      sessionId: 'articulate',
    });
    yield put(converseRespond(response.obj));
  } catch ({ response }) {
    console.error(response.obj.message);
    yield put(converseError());
  }
}

export function* sendMessage() {
  const requestChan = yield actionChannel(CONVERSE);
  while (true) {
    const payload = yield take(requestChan);
    yield call(postMessage, { ...payload.payload, api: payload.api });
  }
}

// Bootstrap sagas
export default [
  sendMessage,
];
