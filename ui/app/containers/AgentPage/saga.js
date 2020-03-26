import { push } from 'react-router-redux';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import {
  ROUTE_AGENT,
  ROUTE_POST_FORMAT,
  ROUTE_SETTINGS,
  ROUTE_WEBHOOK,
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import { getActions } from '../ActionPage/saga';
import {
  addAgentError,
  addAgentSuccess,
  deleteAgentError,
  deleteAgentSuccess,
  loadAgentsSuccess,
  updateAgentError,
  updateAgentSuccess,
} from '../App/actions';
import {
  ADD_AGENT,
  DELETE_AGENT,
  LOAD_ACTIONS,
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
  const agentId = payload.id
  const agentWebhook = yield select(makeSelectAgentWebhook());
  const mutableAgentWebhook = Immutable.asMutable(agentWebhook);
  delete mutableAgentWebhook.agent;
  const { api } = payload;
  try {
    yield call(
      api.post,
      toAPIPath([ROUTE_AGENT, agentId, ROUTE_WEBHOOK]),
      mutableAgentWebhook,
    );
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* postAgentPostFormat(payload) {
  const agentId = payload.id
  const agentPostFormat = yield select(makeSelectAgentPostFormat());
  const mutablePostFormat = Immutable.asMutable(agentPostFormat);
  delete mutablePostFormat.agent;
  const { api } = payload;
  try {
    yield call(
      api.post,
      toAPIPath([ROUTE_AGENT, agentId, ROUTE_POST_FORMAT]),
      mutablePostFormat,
    );
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* putAgentWebhook(payload) {
  const agentId = payload.id
  const agentWebhook = yield select(makeSelectAgentWebhook());
  const mutableAgentWebhook = Immutable.asMutable(agentWebhook);
  const { api } = payload;
  delete mutableAgentWebhook.agent;
  if (mutableAgentWebhook.id) {
    delete mutableAgentWebhook.id;
  }
  try {
    yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, agentId, ROUTE_WEBHOOK]),
      mutableAgentWebhook,
    );
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* putAgentPostFormat(payload) {
  const agentId = payload.id
  const agentPostFormat = yield select(makeSelectAgentPostFormat());
  const mutablePostFormat = Immutable.asMutable(agentPostFormat);
  const { api } = payload;
  delete mutablePostFormat.agent;
  if (mutablePostFormat.id) {
    delete mutablePostFormat.id;
  }
  try {
    yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, agentId, ROUTE_POST_FORMAT]),
      mutablePostFormat,
    );
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* deleteAgentWebhook(payload) {
  const { api, id } = payload;
  try {
    yield call(api.delete, toAPIPath([ROUTE_AGENT, id, ROUTE_WEBHOOK]));
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* deleteAgentPostFormat(payload) {
  const { api, id } = payload;
  try {
    yield call(api.delete, toAPIPath([ROUTE_AGENT, id, ROUTE_POST_FORMAT]));
  } catch (err) {
    yield put(addAgentError(err));
  }
}

function* putAgentSettings(payload) {
  const agentSettings = yield select(makeSelectAgentSettings());
  const { api, id } = payload;
  try {
    yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, id, ROUTE_SETTINGS]),
      agentSettings,
    );
  } catch (err) {
    throw err;
  }
}

export function* postAgent(payload) {
  let agent = yield select(makeSelectAgent());
  agent = agent.set(
    'categoryClassifierThreshold',
    agent.categoryClassifierThreshold / 100,
  );
  const { api } = payload;
  try {
    const response = yield call(api.post, toAPIPath([ROUTE_AGENT]), agent);
    if (agent.useWebhook) {
      yield call(postAgentWebhook, { id: response.id, api });
    }
    if (agent.usePostFormat) {
      yield call(postAgentPostFormat, { id: response.id, api });
    }
    yield call(putAgentSettings, { id: response.id, api });
    response.categoryClassifierThreshold = parseInt(
      response.categoryClassifierThreshold * 100,
    );
    yield put(addAgentSuccess(response));
  } catch (err) {
    yield put(addAgentError(err));
  }
}

export function* putAgent(payload) {
  const agent = yield select(makeSelectAgent());
  const currentAgent = yield select(makeSelectCurrentAgent());
  const mutableAgent = Immutable.asMutable(agent, { deep: true });
  mutableAgent.categoryClassifierThreshold =
    agent.categoryClassifierThreshold / 100;
  const { api } = payload;
  delete mutableAgent.id;
  delete mutableAgent.settings;
  delete mutableAgent.status;
  delete mutableAgent.lastTraining;
  try {
    yield call(putAgentSettings, { id: currentAgent.id, api });
    const response = yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, currentAgent.id]),
      mutableAgent,
    );
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
    response.categoryClassifierThreshold = parseInt(
      response.categoryClassifierThreshold * 100,
    );
    yield put(updateAgentSuccess(response));
  } catch (err) {
    yield put(updateAgentError(err));
  }
}

export function* deleteAgent(payload) {
  const { api, id } = payload;
  try {
    yield call(api.delete, toAPIPath([ROUTE_AGENT, id]));
    yield put(deleteAgentSuccess());
    const response = yield call(api.get, toAPIPath([ROUTE_AGENT]));
    yield put(loadAgentsSuccess(response.data));
    yield put(push('/'));
  } catch (err) {
    yield put(deleteAgentError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(ADD_AGENT, postAgent);
  yield takeLatest(UPDATE_AGENT, putAgent);
  yield takeLatest(DELETE_AGENT, deleteAgent);
  yield takeLatest(LOAD_ACTIONS, getActions);
}
