import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';

import {
  LOAD_AGENT,
  LOAD_SETTINGS,
  RESET_SESSION,
  SEND_MESSAGE,
  TRAIN_AGENT,
  UPDATE_SETTING,
} from '../App/constants';

import { getSettings } from '../SettingsPage/saga';

import {
  loadAgentError,
  loadAgentSuccess,
  resetSessionSuccess,
  respondMessage,
  trainAgentError,
  storeSourceData,
} from './actions';

import { makeSelectAgent, makeSelectSettings } from './selectors';

import { putSetting } from '../SettingsPage/saga';

export function* postConverse(payload) {
  const agent = yield select(makeSelectAgent());
  const settings = yield select(makeSelectSettings());
  if (agent.id) {
    const { api, message } = payload;
    try {
      const response = yield call(api.agent.postAgentAgentidConverse, {
        agentId: agent.id,
        debug: true,
        body: {
          sessionId: settings.defaultUISessionId,
          text: message.message,
        },
      });
      yield put(respondMessage({
        author: agent.agentName,
        docId: response.obj.docId,
        message: response.obj.textResponse,
      }));
      yield put(storeSourceData({ ...response.obj.conversationStateObject }));
    } catch (err) {
      yield put(respondMessage({
        author: 'Error',
        docId: null,
        message: 'I\'m sorry. An error occurred calling Articulate\'s converse service. This is not an issue with your agent.',
      }));
    }
  } else {
    yield put(respondMessage({
      author: 'Warning',
      docId: null,
      message: 'Please click on an agent first',
    }));
  }
}

export function* deleteSession(payload) {
  const settings = yield select(makeSelectSettings());
  const sessionId = settings.defaultUISessionId;
  try {
    const { api } = payload;
    yield call(api.context.deleteContextSessionidFrame, { sessionId });
    yield call(api.context.patchContextSessionid, { sessionId, body: {
      actionQueue: [],
      responseQueue: []
    }});
    yield put(resetSessionSuccess());
  } catch ({ response }) {
    if (response.status && response.status === 404) {
      yield put(resetSessionSuccess());
    } else {
      yield put(respondMessage({
        author: 'Error',
        docId: null,
        message: 'I\'m sorry. An error occurred cleaning your session data.',
      }));
    }
  }
}

export function* postTrainAgent(payload) {
  const agent = yield select(makeSelectAgent());
  const { api } = payload;
  try {
    yield call(api.agent.postAgentAgentidTrain, { agentId: agent.id });
  } catch (err) {
    const error = { ...err };
    yield put(trainAgentError(error.response.body.message));
  }
}

export function* getAgent(payload) {
  const { api, agentId } = payload;
  try {
    let response = yield call(api.agent.getAgentAgentid, { agentId });
    const agent = response.obj;
    agent.categoryClassifierThreshold *= 100;
    let webhook, postFormat;
    if (agent.useWebhook) {
      response = yield call(api.agent.getAgentIdWebhook, { agentId });
      webhook = response.obj;
    }
    if (agent.usePostFormat) {
      response = yield call(api.agent.getAgentIdPostformat, { agentId });
      postFormat = response.obj;
    }
    yield put(loadAgentSuccess({ agent, webhook, postFormat }));
  } catch (err) {
    yield put(loadAgentError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_AGENT, getAgent);
  yield takeLatest(LOAD_SETTINGS, getSettings);
  yield takeLatest(SEND_MESSAGE, postConverse);
  yield takeLatest(RESET_SESSION, deleteSession);
  yield takeLatest(TRAIN_AGENT, postTrainAgent);
  yield takeLatest(UPDATE_SETTING, putSetting);
};
