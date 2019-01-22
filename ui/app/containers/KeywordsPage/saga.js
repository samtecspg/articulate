import Immutable from 'seamless-immutable';

import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';

import {
  loadKeywordsError,
  loadKeywordsSuccess,
} from '../App/actions';

import {
  LOAD_KEYWORDS,
  CHANGE_KEYWORDS_PAGE_SIZE,
} from '../App/constants';

import {
  makeSelectAgent,
  makeSelectAgentSettings
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

export function* putKeywordsPageSize(payload){
  const agentSettings = yield select(makeSelectAgentSettings());
  const { api, agentId, pageSize } = payload;
  const mutableSettings = Immutable.asMutable(agentSettings, { deep: true} );
  mutableSettings.keywordsPageSize = pageSize;
  try {
    yield call(api.agent.putAgentAgentidSettings, { agentId, body: mutableSettings });
  } catch (err) {
    throw err;
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(CHANGE_KEYWORDS_PAGE_SIZE, putKeywordsPageSize);
};