import { call, put, takeLatest } from 'redux-saga/effects';

import { ROUTE_CONNECTION, ROUTE_AGENT } from '../../../common/constants';

import { toAPIPath } from '../../utils/locationResolver';

import {
  loadConnectionSuccess,
  loadConnectionError,
  loadAgentError,
  loadAgentSuccess,
} from '../App/actions';

import {
  LOAD_CONNECTION,
} from '../App/constants';

export function* getConnection(payload) {
  const { api, id } = payload;
  try {
    let response = yield call(api.get, toAPIPath([ROUTE_CONNECTION, id]));
    yield put(loadConnectionSuccess(response));
    try {
      const agentId = response.agent;
      response = yield call(api.get, toAPIPath([ROUTE_AGENT, agentId]));
      yield put(loadAgentSuccess({ agent: response }));
    } catch (err) {
      yield put(loadAgentError(err));
    }
  } catch (err) {
    yield put(loadConnectionError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_CONNECTION, getConnection);
}
