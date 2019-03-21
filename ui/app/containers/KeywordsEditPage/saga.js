import { push } from 'react-router-redux';
import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import {
  ROUTE_AGENT,
  ROUTE_IDENTIFY_KEYWORDS,
  ROUTE_KEYWORD,
  ROUTE_SETTINGS,
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  addModifierSayingSuccess,
  createKeywordError,
  createKeywordSuccess,
  deleteKeywordError,
  loadKeywordError,
  loadKeywordSuccess,
  updateKeywordError,
  updateKeywordSuccess,
} from '../App/actions';
import {
  ADD_MODIFIER_SAYING,
  CHANGE_MODIFIER_SAYINGS_PAGE_SIZE,
  CREATE_KEYWORD,
  DELETE_KEYWORD,
  LOAD_KEYWORD,
  LOAD_KEYWORDS,
  UPDATE_KEYWORD,
} from '../App/constants';
import {
  makeSelectAgent,
  makeSelectAgentSettings,
  makeSelectKeyword,
} from '../App/selectors';
import { getKeywords } from '../DialoguePage/saga';

export function* getKeyword(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    const response = yield call(api.get, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_KEYWORD, id]));
    response.regex = response.regex ? response.regex : '';
    yield put(loadKeywordSuccess(response));
  }
  catch (err) {
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
    const response = yield call(api.post, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_KEYWORD]), newKeyword);
    yield put(createKeywordSuccess(response));
  }
  catch (err) {
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
    const response = yield call(api.put, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_KEYWORD, keywordId]), mutableKeyword);
    yield put(updateKeywordSuccess(response));
  }
  catch (err) {
    yield put(updateKeywordError(err));
  }
}

export function* deleteKeyword(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(api.delete, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_KEYWORD, id]));
    yield call(getKeywords, {
      api,
      filter: '',
      page: 1,
    });
    yield put(push(`/agent/${agent.id}/keywords`));
  }
  catch (err) {
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
    yield call(api.put, toAPIPath([ROUTE_AGENT, agentId, ROUTE_SETTINGS]), mutableSettings);
  }
  catch (err) {
    throw err;
  }
}

export function* getIdentifyKeywords(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, modifierIndex, newSaying } = payload;
  try {
    const params = {
      text: newSaying,
    };
    yield call(api.get, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_IDENTIFY_KEYWORDS]),{params});
    yield put(addModifierSayingSuccess(modifierIndex, newSaying, response));
  }
  catch (err) {
    yield put(addModifierSayingSuccess(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_KEYWORD, getKeyword);
  yield takeLatest(CREATE_KEYWORD, postKeyword);
  yield takeLatest(UPDATE_KEYWORD, putKeyword);
  yield takeLatest(DELETE_KEYWORD, deleteKeyword);
  yield takeLatest(CHANGE_MODIFIER_SAYINGS_PAGE_SIZE, putModifierSayingsPageSize);
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(ADD_MODIFIER_SAYING, getIdentifyKeywords);
};
