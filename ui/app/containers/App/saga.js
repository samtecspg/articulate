import { push } from 'react-router-redux';
import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import {
  ROUTE_AGENT,
  ROUTE_CONNECTION,
  ROUTE_CONTEXT,
  ROUTE_CONVERSE,
  ROUTE_CURRENT,
  ROUTE_POST_FORMAT,
  ROUTE_SETTINGS,
  ROUTE_TRAIN,
  ROUTE_USER,
  ROUTE_WEBHOOK,
  ROUTE_TEST_TRAIN
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  getSettings,
  putSetting,
} from '../SettingsPage/saga';
import {
  loadAgentError,
  loadAgentSuccess,
  loadCurrentUserError,
  loadCurrentUserSuccess,
  loadServerInfoError,
  loadServerInfoSuccess,
  loadSessionSuccess,
  logoutUserError,
  logoutUserSuccess,
  resetSessionSuccess,
  showWarning,
  toggleChatButton,
  toggleConversationBar,
  trainAgentError,
  updateSettingsError,
  updateSettingSuccess,
  testAgentTrainError,
  testAgentTrainSuccess
} from './actions';
import {
  LOAD_AGENT,
  LOAD_CURRENT_USER,
  LOAD_SERVER_INFO,
  LOAD_SETTINGS,
  LOGOUT_USER,
  RESET_SESSION,
  SEND_MESSAGE,
  TOGGLE_CONVERSATION_BAR,
  TRAIN_AGENT,
  UPDATE_SETTING,
  TEST_AGENT_TRAIN
} from './constants';
import {
  makeSelectAgent,
  makeSelectConnection,
  makeSelectSessionId,
  makeSelectSettings,
} from './selectors';

export function* postConverse(payload) {
  const agent = yield select(makeSelectAgent());
  const connection = yield select(makeSelectConnection());
  const systemSessionId = yield select(makeSelectSessionId());

  if (agent.id) {
    const { api, message, newSession, isDemo } = payload;
    if (message.sessionId || systemSessionId) {
      const sessionId = systemSessionId || message.sessionId;
      try {
        const postPayload = {
          params: {
            debug: true,
          },
          data: {
            sessionId,
            text: message.message,
            articulateUI: true,
          },
        };
        yield call(api.post, toAPIPath(isDemo ? [ROUTE_CONNECTION, connection.id, 'external'] : [ROUTE_AGENT, agent.id, ROUTE_CONVERSE]), null, postPayload);

        if (newSession) {
          yield put(loadSessionSuccess(sessionId));
        }
      } catch (err) {
        yield put(showWarning('errorCallingArticulate'));
      }
    } else {
      yield put(showWarning('errorSelectOrCreateASession'));
    }
  } else {
    yield put(showWarning('errorClickOnAgentFirst'));
  }
}

export function* deleteSession(payload) {
  const sessionId = yield select(makeSelectSessionId());
  if (sessionId) {
    try {
      const { api } = payload;
      const patchPayload = {
        actionQueue: [],
        savedSlots: {},
        docIds: [],
        listenFreeText: false,
      };
      yield call(api.patch, toAPIPath([ROUTE_CONTEXT, sessionId]), patchPayload);
      yield put(resetSessionSuccess());
    } catch ({ response }) {
      if (response.status && response.status === 404) {
        yield put(resetSessionSuccess());
      } else {
        yield put(showWarning('errorCleaningSessionData'));
      }
    }
  } else {
    yield put(showWarning('errorSelectSessionToClear'));
  }
}

export function* postTrainAgent(payload) {
  const agent = yield select(makeSelectAgent());
  const { api } = payload;
  try {
    yield call(api.post, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_TRAIN]));
  } catch (err) {
    const error = { ...err };
    yield put(trainAgentError(error.response.data.message));
  }
}

export function* getAgent(payload) {
  const { api, agentId } = payload;
  try {
    let response = yield call(api.get, toAPIPath([ROUTE_AGENT, agentId]));
    const agent = response;
    agent.categoryClassifierThreshold *= 100;
    let webhook;
    let postFormat;
    if (agent.useWebhook) {
      response = yield call(api.get, toAPIPath([ROUTE_AGENT, agentId, ROUTE_WEBHOOK]));
      webhook = response;
    }
    if (agent.usePostFormat) {
      response = yield call(api.get, toAPIPath([ROUTE_AGENT, agentId, ROUTE_POST_FORMAT]));
      postFormat = response;
    }
    yield put(loadAgentSuccess({ agent, webhook, postFormat }));
  } catch (err) {
    yield put(loadAgentError(err));
  }
}

export function* getServerInfo(payload) {
  const { api } = payload;
  try {
    const response = yield call(api.get, toAPIPath([]));
    yield put(loadServerInfoSuccess(response));
  } catch (err) {
    yield put(loadServerInfoError(err));
  }
}

export function* putConversationBarWidth(payload) {
  const { api } = payload;
  const settings = yield select(makeSelectSettings());
  const width = settings.conversationPanelWidth;
  try {
    if (width > 300) {
      const response = yield call(api.put, toAPIPath([ROUTE_SETTINGS, 'conversationPanelWidth']), 300);
      yield put(updateSettingSuccess(response));
      yield put(push('/users'));
    }
  } catch (err) {
    yield put(updateSettingsError(err));
  }
}

export function* logoutUser(payload) {
  const { api } = payload;
  try {
    const response = yield call(
      api.get,
      toAPIPath(['auth', 'logout']),
    );
    yield put(logoutUserSuccess(response));
    yield put(toggleConversationBar(false));
    yield put(toggleChatButton(false));
    yield put(push('/'));
  } catch (err) {
    yield put(logoutUserError(err));
  }
}

export function* getCurrentUser(payload) {
  const { api } = payload;
  try {
    const response = yield call(api.get, toAPIPath([ROUTE_USER, ROUTE_CURRENT]));
    yield put(loadCurrentUserSuccess({ user: response }));
  } catch (err) {
    yield put(loadCurrentUserError(err));
  }
}

export function* testAgentTrain(payload) {
  const { api, id } = payload;
  try {
    const result = yield call(api.get, toAPIPath([ROUTE_AGENT, id, ROUTE_TEST_TRAIN]));
    yield put(testAgentTrainSuccess({ result }));
  } catch (error) {
    yield put(testAgentTrainError(error));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_AGENT, getAgent);
  yield takeLatest(LOAD_SETTINGS, getSettings);
  yield takeLatest(LOAD_SERVER_INFO, getServerInfo);
  yield takeLatest(SEND_MESSAGE, postConverse);
  yield takeLatest(RESET_SESSION, deleteSession);
  yield takeLatest(TRAIN_AGENT, postTrainAgent);
  yield takeLatest(UPDATE_SETTING, putSetting);
  yield takeLatest(TOGGLE_CONVERSATION_BAR, putConversationBarWidth);
  yield takeLatest(LOGOUT_USER, logoutUser);
  yield takeLatest(LOAD_CURRENT_USER, getCurrentUser);
  yield takeLatest(LOGOUT_USER, logoutUser);
  yield takeLatest(LOAD_CURRENT_USER, getCurrentUser);
  yield takeLatest(TEST_AGENT_TRAIN, testAgentTrain);
}
