import {
  converseError,
  converseRespond,
} from 'containers/App/actions';
import {
  CONVERSE,
  CONVERSE_ERROR,
  CONVERSE_SUCCESS,
} from 'containers/App/constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  call,
  cancel,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects';

import request from 'utils/request';

export function* postMessage(data) {
  const requestURL = `http://127.0.0.1:8000/agent/${data.payload.agent}/converse?text=${data.payload.message}&sessionId=dcalvom`;
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
  const watcher = yield takeLatest(CONVERSE, postMessage);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  sendMessage,
];
