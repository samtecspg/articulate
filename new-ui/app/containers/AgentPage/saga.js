import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import Immutable from 'seamless-immutable';

import {
  addAgentError,
  addAgentSuccess,
  updateAgentError,
  updateAgentSuccess,
} from '../App/actions';

import {
  ADD_AGENT,
  UPDATE_AGENT,
} from '../App/constants';

import {
  makeSelectAgent,
  makeSelectAgentPostFormat,
  makeSelectAgentSettings,
  makeSelectAgentWebhook,
  makeSelectCurrentAgent,
} from '../App/selectors';

function* postAgentWebhook(payload) {
  const agent = yield select(makeSelectAgent());
  const agentWebhook = yield select(makeSelectAgentWebhook());
  const { api } = payload;
  try {
    yield call(api.agent.postAgentAgentidWebhook, { agentId: agent.id, body: agentWebhook });
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* postAgentPostFormat(payload) {
  const agent = yield select(makeSelectAgent());
  const agentPostFormat = yield select(makeSelectAgentPostFormat());
  const { api } = payload;
  try {
    yield call(api.agent.postAgentAgentidPostformat, { agentId: agent.id, body: agentPostFormat });
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* putAgentWebhook(payload) {
  const agent = yield select(makeSelectAgent());
  const agentWebhook = yield select(makeSelectAgentWebhook());
  const mutableAgentWebhook = Immutable.asMutable(agentWebhook);
  const { api } = payload;
  delete mutableAgentWebhook.agent;
  if (mutableAgentWebhook.id) { // TODO: Check why webhook have an id
    delete mutableAgentWebhook.id;
  }
  try {
    yield call(api.agent.putAgentAgentidWebhook, { agentId: agent.id, body: mutableAgentWebhook });
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* putAgentPostFormat(payload) {
  const agent = yield select(makeSelectAgent());
  const agentPostFormat = yield select(makeSelectAgentPostFormat());
  const mutablePostFormat = Immutable.asMutable(agentPostFormat);
  const { api } = payload;
  delete mutablePostFormat.agent;
  if (mutablePostFormat.id) { // TODO: Check why post format have an id
    delete mutablePostFormat.id;
  }
  try {
    yield call(api.agent.putAgentAgentidPostformat, { agentId: agent.id, body: mutablePostFormat });
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* deleteAgentWebhook(payload) {
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentAgentidWebhook, { agentId: id });
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* deleteAgentPostFormat(payload) {
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentAgentidPostformat, { agentId: id });
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* putAgentSettings(payload) {
  const agentSettings = yield select(makeSelectAgentSettings());
  const { api, id } = payload;
  try {
    yield call(api.agent.putAgentAgentidSettings, { agentId: id, body: agentSettings });
  } catch (err) {
    throw err;
  }
}

export function* postAgent(payload) {
  let agent = yield select(makeSelectAgent());
  agent = agent.set('categoryClassifierThreshold', agent.categoryClassifierThreshold / 100);
  const { api } = payload;
  try {
    const response = yield call(api.agent.postAgent, { body: agent });
    if (agent.useWebhook) {
      yield call(postAgentWebhook, { id: response.obj.id, api });
    }
    if (agent.usePostFormat) {
      yield call(postAgentPostFormat, { id: response.obj.id, api });
    }
    yield call(putAgentSettings, { id: response.obj.id, api });
    yield put(addAgentSuccess(response.obj));
  } catch (err) {
    yield put(addAgentError(err));
  }
}

export function* putAgent(payload) {
  const agent = yield select(makeSelectAgent());
  const currentAgent = yield select(makeSelectCurrentAgent());
  const mutableAgent = Immutable.asMutable(agent, { deep: true });
  mutableAgent.categoryClassifierThreshold = agent.categoryClassifierThreshold / 100;
  const { api } = payload;
  delete mutableAgent.id;
  delete mutableAgent.settings;
  delete mutableAgent.status;
  delete mutableAgent.lastTraining;
  try {
    yield call(putAgentSettings, { id: currentAgent.id, api });
    const response = yield call(api.agent.putAgentAgentid, { agentId: currentAgent.id, body: mutableAgent });
    if (!currentAgent.useWebhook) {
      if (agent.useWebhook) {
        yield call(postAgentWebhook, { id: currentAgent.id, api });
      }
    } else if (currentAgent.useWebhook) {
      if (!agent.useWebhook) {
        yield call(deleteAgentWebhook, { id: currentAgent.id, api });
      } else {
        yield call(putAgentWebhook, { id: currentAgent.id, api });
      }
    }
    if (!currentAgent.usePostFormat) {
      if (agent.usePostFormat) {
        yield call(postAgentPostFormat, { id: currentAgent.id, api });
      }
    } else if (currentAgent.usePostFormat) {
      if (!agent.usePostFormat) {
        yield call(deleteAgentPostFormat, { id: currentAgent.id, api });
      } else {
        yield call(putAgentPostFormat, { id: currentAgent.id, api });
      }
    }
    yield put(updateAgentSuccess(response.obj));
  } catch (err) {
    yield put(updateAgentError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(ADD_AGENT, postAgent);
  yield takeLatest(UPDATE_AGENT, putAgent);
};
