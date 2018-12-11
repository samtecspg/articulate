import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';

import {
  loadKeywordsError,
  loadKeywordsSuccess,
  deleteKeywordError,
} from '../App/actions';

import {
  LOAD_KEYWORDS,
  DELETE_KEYWORD,
} from '../App/constants';

import {
  makeSelectAgent,
} from '../App/selectors';


export function* getKeywords(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, filter, page, pageSize } = payload;
  let skip = 0;
  let limit = -1;
  if (page){
    skip = (page - 1) * pageSize;
    limit = pageSize;
  }
  try {
    const response = yield call(api.agent.getAgentAgentidKeyword, {
      agentId: agent.id,
      filter,
      skip,
      limit,
    });
    // TODO: Fix in the api the return of total sayings
    yield put(loadKeywordsSuccess({keywords: response.obj.data, total: response.obj.totalCount }));
  } catch (err) {
    yield put(loadKeywordsError(err));
  }
}

export function* deleteKeyword(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, keywordId } = payload;
  try {
    yield call(api.agent.deleteAgentAgentidKeywordKeywordid, { agentId: agent.id, keywordId });
    yield call(getKeywords, {
      api,
      filter: '',
      page: 1,
    });
  } catch (err) {
    yield put(deleteKeywordError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(DELETE_KEYWORD, deleteKeyword);
};