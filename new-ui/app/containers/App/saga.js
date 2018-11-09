import {
  takeLatest,
  select,
  put,
  call,
} from 'redux-saga/effects';

import {
  LOAD_DOC,
  LOAD_SETTINGS,
  SEND_MESSAGE,
  RESET_SESSION,
  TRAIN_AGENT,
} from '../App/constants';

import {
  getSettings,
} from '../SettingsPage/saga';

import {
  respondMessage,
  resetSessionSuccess,
  loadDocSuccess,
  loadDocError,
  trainAgentError,
} from './actions';

import {
  makeSelectAgent
} from './selectors';

export function* getConverse(payload) {
  const agent = yield select(makeSelectAgent());
  if (agent.id){
    const { api, message } = payload;
    try {
        const response = yield call(api.agent.getAgentIdConverse, {
          id: agent.id,
          sessionId: 'articulateUI',
          text: message.message,
        });
        yield put(respondMessage({
          author: agent.agentName,
          docId: response.obj.docId,
          message: response.obj.textResponse,
        }));
    } catch (err) {
        yield put(respondMessage({
          author: 'Error',
          docId: null,
          message: 'I\'m sorry. An error ocurred calling Articulate\'s converse service. This is not an issue with your agent.',
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
  try {
    const { api } = payload;
    yield call(api.context.deleteContextSessionid, { sessionId: 'articulateUI', });
    yield put(resetSessionSuccess());
  } catch ({ response }) {
    if (response.status && response.status === 404){
      yield put(resetSessionSuccess());
    }
    else {
      yield put(respondMessage({
        author: 'Error',
        docId: null,
        message: 'I\'m sorry. An error ocurred cleaning your session data.',
      }));
    }
  }
}

export function* getDoc(payload) {
  const { api, docId } = payload;
  try {
    const response = yield call(api.doc.getDocDocid, { docId });
    yield put(loadDocSuccess({ doc: response.obj }));
  } catch (err) {
    yield put(loadDocError(err));
  }
}

export function* postTrainAgent(payload) {
  const agent = yield select(makeSelectAgent());
  const { api } = payload;
  try {
    yield call(api.agent.postAgentAgentidTrain, { agentId: agent.id });
  } catch (err) {
      yield put(trainAgentError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_SETTINGS, getSettings);
  yield takeLatest(SEND_MESSAGE, getConverse);
  yield takeLatest(RESET_SESSION, deleteSession);
  yield takeLatest(LOAD_DOC, getDoc);
  yield takeLatest(TRAIN_AGENT, postTrainAgent);
};