import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { 
  CONVERSE,
  CONVERSE_SUCCESS,
  CONVERSE_ERROR, } from 'containers/App/constants';
import {
  converseRespond,
  converseError } from 'containers/App/actions';

import request from 'utils/request';

export function* postMessage(data) {
  const requestURL = `http://127.0.0.1:8000/agent/${data.payload.agent}/converse?text=${data.payload.message}`;
  const requestOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }

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
