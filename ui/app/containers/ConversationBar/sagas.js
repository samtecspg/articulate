import {
  actionChannel,
  call,
  put,
  take,
  takeLatest
} from 'redux-saga/effects';

import request from '../../utils/request';
import {
  converseError,
  converseRespond,
} from '../App/actions';
import { CONVERSE } from '../App/constants';

export function* postMessage(payload) {
  const requestURL = `http://127.0.0.1:8000/agent/${payload.agent}/converse?text=${payload.message}&sessionId=dcalvom`;
  const requestOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = yield call(request, requestURL, requestOptions);
    yield put(converseRespond(response));
  } catch (error) {
    yield put(converseError());
  }
}

export function* sendMessage() {
  const requestChan = yield actionChannel(CONVERSE);
  while (true) {
    const { payload } = yield take(requestChan);
    yield call(postMessage, payload);
  }
}

// Bootstrap sagas
export default [
  sendMessage,
];
