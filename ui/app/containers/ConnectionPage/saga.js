import { push } from 'react-router-redux';
import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';

import {
  ROUTE_CONNECTION
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  createConnectionError,
  createConnectionSuccess,
  deleteConnectionError,
  loadConnectionError,
  loadConnectionSuccess,
  updateConnectionError,
  updateConnectionSuccess,
} from '../App/actions';

import {
  CREATE_CONNECTION,
  DELETE_CONNECTION,
  LOAD_CONNECTION,
  LOAD_CONNECTIONS,
  UPDATE_CONNECTION,
  LOAD_AGENTS,
  LOAD_CHANNELS,
} from '../App/constants';

import {
  makeSelectConnection,
} from '../App/selectors';

import { getAgents, getChannels, getConnections } from '../AgentsPage/saga';

export function* getConnection(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.get, toAPIPath([ROUTE_CONNECTION, id]));
    yield put(loadConnectionSuccess(response));
  }
  catch (err) {
    yield put(loadConnectionError(err));
  }
}

export function* postConnection(payload) {
  const connection = yield select(makeSelectConnection());
  const { api } = payload;
  try {
    const response = yield call(api.post, toAPIPath([ROUTE_CONNECTION]), connection);
    yield put(createConnectionSuccess(response));
  }
  catch (err) {
    yield put(createConnectionError(err));
  }
}

/*
export function* putConnection(payload) {
  const agent = yield select(makeSelectAgent());
  const connection = yield select(makeSelectConnection());
  const mutableConnection = Immutable.asMutable(connection, { deep: true });
  const connectionId = connection.id;
  const { api } = payload;
  delete mutableConnection.id;
  delete mutableConnection.agent;
  try {
    const response = yield call(api.put, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CONNECTION, connectionId]), mutableConnection);
    yield put(updateConnectionSuccess(response));
  }
  catch (err) {
    yield put(updateConnectionError(err));
  }
}*/

export function* deleteConnection(payload) {
  const { api, id } = payload;
  try {
    yield call(api.delete, toAPIPath([ROUTE_CONNECTION, id]));
    yield call(getConnections, {
      api,
      filter: '',
      page: 1,
    });
    yield put(push(`/`));
  }
  catch (err) {
    const error = { ...err };
    yield put(deleteConnectionError(error.response.data.message));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_CONNECTION, getConnection);
  yield takeLatest(CREATE_CONNECTION, postConnection);
  //yield takeLatest(UPDATE_CONNECTION, putConnection);
  yield takeLatest(DELETE_CONNECTION, deleteConnection);
  yield takeLatest(LOAD_CONNECTIONS, getConnections);
  yield takeLatest(LOAD_AGENTS, getAgents);
  yield takeLatest(LOAD_CHANNELS, getChannels);
};
