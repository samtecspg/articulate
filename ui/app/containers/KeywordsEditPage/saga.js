import Immutable from 'seamless-immutable';
import {
  push
} from 'react-router-redux';
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
  deleteKeywordError,
} from '../App/actions';

import {
  LOAD_KEYWORD,
  CREATE_KEYWORD,
  UPDATE_KEYWORD,
  DELETE_KEYWORD,
  CHANGE_MODIFIER_SAYINGS_PAGE_SIZE,
} from '../App/constants';

import {
  makeSelectAgent, makeSelectKeyword, makeSelectAgentSettings
} from '../App/selectors';
import { getKeywords } from '../KeywordsPage/saga';

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

export function* deleteKeyword(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentAgentidKeywordKeywordid, { agentId: agent.id, keywordId: id });
    yield call(getKeywords, {
      api,
      filter: '',
      page: 1,
    });
    yield put(push(`/agent/${agent.id}/keywords`));
  } catch (err) {
    const error = { ...err };
    yield put(deleteKeywordError(error.response.body.message));
  }
}

export function* putModifierSayingsPageSize(payload) {
  const agentSettings = yield select(makeSelectAgentSettings());
  const { api, agentId, pageSize } = payload;
  const mutableSettings = Immutable.asMutable(agentSettings, { deep: true });
  mutableSettings.modifierSayingsPageSize = pageSize;
  try {
    yield call(api.agent.putAgentAgentidSettings, { agentId, body: mutableSettings });
  } catch (err) {
    throw err;
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_KEYWORD, getKeyword);
  yield takeLatest(CREATE_KEYWORD, postKeyword);
  yield takeLatest(UPDATE_KEYWORD, putKeyword);
  yield takeLatest(DELETE_KEYWORD, deleteKeyword);
  yield takeLatest(CHANGE_MODIFIER_SAYINGS_PAGE_SIZE, putModifierSayingsPageSize);
};