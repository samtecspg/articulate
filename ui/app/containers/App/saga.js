import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import {
  ROUTE_AGENT,
  ROUTE_CONTEXT,
  ROUTE_CONVERSE,
  ROUTE_FRAME,
  ROUTE_POST_FORMAT,
  ROUTE_TRAIN,
  ROUTE_WEBHOOK,
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  LOAD_AGENT,
  LOAD_SETTINGS,
  RESET_SESSION,
  SEND_MESSAGE,
  TRAIN_AGENT,
  UPDATE_SETTING,
} from '../App/constants';
import {
  getSettings,
  putSetting,
} from '../SettingsPage/saga';
import {
  loadAgentError,
  loadAgentSuccess,
  resetSessionSuccess,
  respondMessage,
  storeSourceData,
  trainAgentError,
} from './actions';
import {
  makeSelectAgent,
  makeSelectSessionId,
} from './selectors';

export function* postConverse(payload) {
  const agent = yield select(makeSelectAgent());
  const sessionId = yield select(makeSelectSessionId());
  if (agent.id) {
    const { api, message } = payload;
    if (sessionId){
      try {
        const postPayload = {
          params: {
            debug: true,
          },
          data: {
            sessionId,
            text: message.message,
          },
        };
        const response = yield call(api.post, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CONVERSE]), null, postPayload);
        yield put(respondMessage({
          author: agent.agentName,
          docId: response.docId,
          message: response.textResponse,
          conversationStateObject: response.converseResult ? response.converseResult.conversationStateObject : null,
        }));
        yield put(storeSourceData({ ...response.conversationStateObject }));
      }
      catch (err) {
        yield put(respondMessage({
          author: 'Error',
          docId: null,
          message: 'I\'m sorry. An error occurred calling Articulate\'s converse service. This is not an issue with your agent.',
        }));
      }
    }
    else {
      yield put(respondMessage({
        author: 'Warning',
        docId: null,
        message: 'Select or create a session first',
      }));
    }
  }
  else {
    yield put(respondMessage({
      author: 'Warning',
      docId: null,
      message: 'Please click on an agent first',
    }));
  }
}

export function* deleteSession(payload) {
  const sessionId = yield select(makeSelectSessionId());
  if (sessionId){
    try {
      const { api } = payload;
      yield call(api.delete, toAPIPath([ROUTE_CONTEXT, sessionId, ROUTE_FRAME]));
      const patchPayload = {
        actionQueue: [],
        responseQueue: [],
        savedSlots: {},
      };
      yield call(api.patch, toAPIPath([ROUTE_CONTEXT, sessionId]), patchPayload);
      yield put(resetSessionSuccess());
    }
    catch ({ response }) {
      if (response.status && response.status === 404) {
        yield put(resetSessionSuccess());
      }
      else {
        yield put(respondMessage({
          author: 'Error',
          docId: null,
          message: 'I\'m sorry. An error occurred cleaning your session data.',
        }));
      }
    }
  }
  else {
    yield put(respondMessage({
      author: 'Warning',
      docId: null,
      message: 'Select a session to clear',
    }));
  }
}

export function* postTrainAgent(payload) {
  const agent = yield select(makeSelectAgent());
  const { api } = payload;
  try {
    yield call(api.post, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_TRAIN]));
  }
  catch (err) {
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
    let webhook, postFormat;
    if (agent.useWebhook) {
      response = yield call(api.get, toAPIPath([ROUTE_AGENT, agentId, ROUTE_WEBHOOK]));
      webhook = response;
    }
    if (agent.usePostFormat) {
      response = yield call(api.get, toAPIPath([ROUTE_AGENT, agentId, ROUTE_POST_FORMAT]));
      postFormat = response;
    }
    yield put(loadAgentSuccess({ agent, webhook, postFormat }));
  }
  catch (err) {
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
