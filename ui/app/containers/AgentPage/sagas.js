import {
  LOCATION_CHANGE,
  push
} from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import { getAgents } from '../../containers/App/sagas';
import { makeSelectInWizard } from '../../containers/App/selectors';
import { makeSelectAgentData } from '../AgentPage/selectors';
import {
  agentCreated,
  agentCreationError,
  selectCurrentAgent,
} from '../App/actions';

import { CREATE_AGENT } from '../App/constants';

export function* postAgent(payload) {
  const { api } = payload;
  const agentData = yield select(makeSelectAgentData());
  const inWizard = yield select(makeSelectInWizard());
  agentData.domainClassifierThreshold /= 100;
  try {
    const response = yield call(api.agent.postAgent, { body: agentData });
    const agent = response.obj;
    yield put(agentCreated(agent));
    yield call(getAgents, { api });
    yield put(selectCurrentAgent(agent));
    if (inWizard) {
      yield put(push('/wizard/domain'));
    }
    else {
      yield put(push('/domains'));
    }
  } catch ({ response }) {
    yield put(agentCreationError({ message: response.obj.message }));
  }
}

export function* createAgent() {
  const watcher = yield takeLatest(CREATE_AGENT, postAgent);
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  createAgent,
];
