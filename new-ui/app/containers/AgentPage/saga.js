import {
  push,
} from 'react-router-redux';

import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';

import {
  loadAgentError,
  loadAgentSuccess,
  addAgentSuccess,
  addAgentError,
} from '../App/actions';

import {
  LOAD_AGENT,
  ADD_AGENT,
} from '../App/constants';

import {
  makeSelectAgent,
  makeSelectAgentWebhook,
  makeSelectAgentPostFormat,
  makeSelectAgentSettings,
} from '../App/selectors';

export function* getAgent(payload) {
  const { api, agentId } = payload;
  try {
    let response = yield call(api.agent.getAgentId, { id: agentId });
    const agent = response.obj;
    agent.domainClassifierThreshold = agent.domainClassifierThreshold * 100;
    response = yield call(api.agent.getAgentIdSettings, { id: agentId });
    const settings = response.obj;
    yield put(loadAgentSuccess({ agent, settings }));
  } catch (err) {
    yield put(loadAgentError(err));
  }
}

function* postAgentWebhook(payload) {
  const agentWebhook = yield select(makeSelectAgentWebhook());
  const { api } = payload;
  try {
      yield call(api.agent.postAgentIdWebhook, { body: agentWebhook });
  } catch (err) {
      yield put(addAgentError(err));
  }
}

function* postAgentPostFormat(payload) {
  const agentPostFormat = yield select(makeSelectAgentPostFormat());
  const { api } = payload;
  try {
      yield call(api.agent.postAgentIdPostformat, { body: agentPostFormat });
  } catch (err) {
      yield put(addAgentError(err));
  }
}

function* putAgentSettings(payload) {
  const agentSettings = yield select(makeSelectAgentSettings());
  const { api, id } = payload;
  try {
      yield call(api.agent.putAgentIdSettings, { id, body: agentSettings });
  } catch (err) {
      console.log(err);
      yield put(addAgentError(err));
  }
}

export function* postAgent(payload) {
  const agent = yield select(makeSelectAgent());
  const { api } = payload;
  try {
      const response = yield call(api.agent.postAgent, { body: agent });
      if (agent.useWebhook){
        yield call(postAgentWebhook, { api });
      }
      if (agent.usePostFormat){
        yield call(postAgentPostFormat, { api });
      }
      yield call(putAgentSettings, { id: response.obj.id, api });
      yield put(addAgentSuccess(response.obj));
  } catch (err) {
      yield put(addAgentError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_AGENT, getAgent);
  yield takeLatest(ADD_AGENT, postAgent);
};