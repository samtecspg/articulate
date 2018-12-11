import Immutable from 'seamless-immutable';

import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';

import {
  loadKeywordSuccess,
  loadKeywordError,
  createKeywordSuccess,
  createKeywordError,
  updateKeywordSuccess,
  updateKeywordError,
} from '../App/actions';

import {
  LOAD_KEYWORD,
  CREATE_KEYWORD,
  UPDATE_KEYWORD,
} from '../App/constants';

import {
  makeSelectAgent, makeSelectKeyword,
} from '../App/selectors';

export function* getKeyword(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    const response = yield call(api.agent.getAgentAgentidKeywordKeywordid, {
      agentId: agent.id,
      keywordId: id,
    });
    response.obj.regex = response.obj.regex ? response.obj.regex : '';
    yield put(loadKeywordSuccess(response.obj));
  } catch (err) {
    yield put(loadKeywordError(err));
  }
}

export function* postKeyword(payload) {
  const agent = yield select(makeSelectAgent());
  const keyword = yield select(makeSelectKeyword());
  const newKeyword = Immutable.asMutable(keyword, { deep: true });
  delete newKeyword.agent;
  const { api } = payload;
  try {
    const response = yield call(api.agent.postAgentAgentidKeyword, { agentId: agent.id, body: newKeyword });
    yield put(createKeywordSuccess(response.obj));
  } catch (err) {
    yield put(createKeywordError(err));
  }
}

export function* putKeyword(payload) {
  const agent = yield select(makeSelectAgent());
  const keyword = yield select(makeSelectKeyword());
  const mutableKeyword = Immutable.asMutable(keyword, { deep: true });
  const keywordId = keyword.id;
  const { api } = payload;
  delete mutableKeyword.id;
  delete mutableKeyword.agent;
  try {
    const response = yield call(api.agent.putAgentAgentidKeywordKeywordid, { agentId: agent.id, keywordId, body: mutableKeyword });
    yield put(updateKeywordSuccess(response.obj));
  } catch (err) {
    yield put(updateKeywordError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_KEYWORD, getKeyword);
  yield takeLatest(CREATE_KEYWORD, postKeyword);
  yield takeLatest(UPDATE_KEYWORD, putKeyword);
};