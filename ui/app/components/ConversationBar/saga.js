import { takeLatest, call, put, select } from 'redux-saga/effects';
import { putSetting } from '../../containers/SettingsPage/saga';
import { UPDATE_SETTING, LOAD_SESSION, DELETE_SESSION } from '../../containers/App/constants';
import { ROUTE_CONTEXT, ROUTE_DOCUMENT } from '../../../common/constants';
import { loadSessionSuccess, loadSessionError, respondMessage, deleteSessionError, deleteSessionSuccess } from '../../containers/App/actions';
import { toAPIPath } from '../../utils/locationResolver';
import { makeSelectAgent } from '../../containers/App/selectors';

function* messageIterator(message){
  const agent = yield select(makeSelectAgent());
  yield put(respondMessage({
    author: 'User',
    docId: null,
    message: message.document,
  }));
  yield put(respondMessage({
    author: agent.agentName,
    docId: message.id,
    message: message.converseResult.textResponse,
    conversationStateObject: message.converseResult ? message.converseResult.conversationStateObject : null,
  }));
};

export function* getSession(payload) {
  const { api, sessionId, newSession } = payload;
  try {
    if (newSession){
      yield call(api.post, toAPIPath([ROUTE_CONTEXT]), { sessionId });
    }
    yield call(api.get, toAPIPath([ROUTE_CONTEXT, sessionId]));
    const conversationLog = yield call(api.get, toAPIPath([ROUTE_CONTEXT, sessionId, ROUTE_DOCUMENT]));
    yield conversationLog.map(message => call(messageIterator, message));

    yield put(loadSessionSuccess(sessionId));
  }
  catch (err) {
    yield put(loadSessionError(err));
  }
}

export function* deleteSession(payload) {
  const { api, sessionId, clearSessionId } = payload;
  try {
    yield call(api.delete, toAPIPath([ROUTE_CONTEXT, sessionId]));
    yield put(deleteSessionSuccess());
    if (clearSessionId){
      yield put(loadSessionSuccess(''));
    }
  }
  catch (err) {
    yield put(deleteSessionError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(UPDATE_SETTING, putSetting);
  yield takeLatest(LOAD_SESSION, getSession);
  yield takeLatest(DELETE_SESSION, deleteSession);
};
