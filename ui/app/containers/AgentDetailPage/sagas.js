import {
  LOCATION_CHANGE,
  push,
} from 'react-router-redux';

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
  resetCurrentAgent,
} from '../../containers/App/actions';
import { DELETE_AGENT } from '../../containers/App/constants';
import { getAgents } from '../../containers/App/sagas';

export function* deleteAgent() {
  const action = function* (payload) {
    const { api, id } = payload;
    try {
      yield call(api.agent.deleteAgentId, { id });
      yield put(deleteAgentSuccess());
      yield call(getAgents, { api });
      yield put(resetCurrentAgent());
      yield put(push('/'));
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
