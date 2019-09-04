import { call, put, select, takeLatest } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import {
  ROUTE_AGENT,
  ROUTE_CONTEXT,
  ROUTE_CONVERSE,
  ROUTE_POST_FORMAT,
  ROUTE_TRAIN,
  ROUTE_WEBHOOK,
  ROUTE_SETTINGS,
  ROUTE_CONNECTION,
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  LOAD_AGENT,
  LOAD_SETTINGS,
  LOAD_SERVER_INFO,
  RESET_SESSION,
  SEND_MESSAGE,
  TRAIN_AGENT,
  UPDATE_SETTING,
  TOGGLE_CONVERSATION_BAR,
} from './constants';
import { getSettings, putSetting } from '../SettingsPage/saga';
import {
  loadAgentError,
  loadAgentSuccess,
  resetSessionSuccess,
  respondMessage,
  storeSourceData,
  trainAgentError,
  showWarning,
  loadServerInfoSuccess,
  loadServerInfoError,
  updateSettingsError,
  updateSettingSuccess,
  loadSessionSuccess,
} from './actions';
import {
  makeSelectAgent,
  makeSelectSessionId,
  makeSelectSettings,
  makeSelectConnection,
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
            articulateUI: true
          },
        };
        yield call(
          api.post,
          toAPIPath(isDemo ? [ROUTE_CONNECTION, connection.id, 'external'] : [ROUTE_AGENT, agent.id, ROUTE_CONVERSE]),
          null,
          postPayload,
        );

        if (newSession){
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
        docIds: []
      };
      yield call(
        api.patch,
        toAPIPath([ROUTE_CONTEXT, sessionId]),
        patchPayload,
      );
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
      response = yield call(
        api.get,
        toAPIPath([ROUTE_AGENT, agentId, ROUTE_WEBHOOK]),
      );
      webhook = response;
    }
    if (agent.usePostFormat) {
      response = yield call(
        api.get,
        toAPIPath([ROUTE_AGENT, agentId, ROUTE_POST_FORMAT]),
      );
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
  const mutableSettings = Immutable.asMutable(settings, { deep: true });
  const width = settings.conversationPanelWidth;
  try {
    if (width > 300) {
      const response = yield call(
        api.put,
        toAPIPath([ROUTE_SETTINGS, 'conversationPanelWidth']),
        300,
      );
      yield put(updateSettingSuccess(response));
    }
  } catch (err) {
    yield put(updateSettingsError(err));
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
}
