import { LOCATION_CHANGE, } from 'react-router-redux';

import {
  call,
  cancel,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  deleteAgentError,
  deleteAgentSuccess,
  loadAgents,
  resetCurrentAgent,
} from '../../containers/App/actions';
import { DELETE_AGENT } from '../../containers/App/constants';
import request from '../../utils/request';

export function* deleteAgent() {
  const action = function* (payload) {
    const requestURL = `http://127.0.0.1:8000/agent/${payload.id}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    };

    try {
      yield call(request, requestURL, requestOptions);
      yield put(deleteAgentSuccess());
      // TODO: remove this call from here and use react-trunk or react-promise
      yield put(resetCurrentAgent());
      yield put(loadAgents());
      // TODO: Redirect to root page
    } catch (error) {
      yield put(deleteAgentError({
        message: `An error occurred deleting the agent [${payload.id}]`,
        error,
      }));
    }
  };
  const watcher = yield takeLatest(DELETE_AGENT, action);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  deleteAgent,
];
