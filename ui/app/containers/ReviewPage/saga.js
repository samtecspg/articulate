import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import {
  ROUTE_AGENT,
  ROUTE_CATEGORY,
  ROUTE_DOCUMENT,
  ROUTE_SAYING,
  ROUTE_SETTINGS,
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import { getActions } from '../ActionPage/saga';

import {
  copySayingError,
  copySayingSuccess,
  deleteSayingError,
  loadAgentDocumentsError,
  loadAgentDocumentsSuccess,
  loadCategoriesError,
  loadCategoriesSuccess,
  loadFilteredCategoriesError,
  loadFilteredCategoriesSuccess,
  loadSayingsError,
  loadSayingsSuccess,
  updateSayingError,
} from '../App/actions';

import {
  ADD_ACTION_SAYING,
  CHANGE_REVIEW_PAGE_SIZE,
  COPY_SAYING,
  DELETE_ACTION_SAYING,
  DELETE_SAYING,
  LOAD_ACTIONS,
  LOAD_AGENT_DOCUMENTS,
  LOAD_CATEGORIES,
  LOAD_FILTERED_CATEGORIES,
  LOAD_KEYWORDS,
  LOAD_SAYINGS,
  TAG_KEYWORD,
  UNTAG_KEYWORD,
} from '../App/constants';

import {
  makeSelectAgent,
  makeSelectAgentSettings,
} from '../App/selectors';

import { getKeywords } from '../DialoguePage/saga';

export function* getSayings(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, filter, page, pageSize } = payload;
  const tempFilter = filter === '' ? undefined : filter;
  let skip = 0;
  let limit = -1;
  if (page) {
    skip = (page - 1) * pageSize;
    limit = pageSize;
  }
  try {
    const params = {
      filter: tempFilter,
      skip,
      limit,
      field: 'id',
      direction: 'DESC',
      loadCategoryId: true,
    };
    const response = yield call(api.get, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_SAYING]), { params });
    yield put(loadSayingsSuccess({ sayings: response.data, total: response.totalCount }));
  }
  catch (err) {
    yield put(loadSayingsError(err));
  }
}

export function* postSaying(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, userSays, keywords = [], categoryId, actions } = payload;
  try {
    const newSayingData = {
      userSays,
      keywords,
      actions,
    };
    const response = yield call(api.post, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CATEGORY, categoryId, ROUTE_SAYING]), newSayingData);
    yield put(copySayingSuccess(response));
  }
  catch (err) {
    yield put(copySayingError(err));
  }
}

export function* deleteSaying(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, sayingId, categoryId, pageSize } = payload;
  try {
    yield call(api.delete, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CATEGORY, categoryId, ROUTE_SAYING, sayingId]));
    yield call(getSayings, {
      api,
      filter: '',
      page: 1,
      pageSize,
    });
  }
  catch (err) {
    yield put(deleteSayingError(err));
  }
}

export function* putSaying(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, sayingId, saying, filter, page, pageSize } = payload;
  const categoryId = saying.category;
  delete saying.id;
  delete saying.agent;
  delete saying.category;
  try {
    yield call(api.put, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CATEGORY, categoryId, ROUTE_SAYING, sayingId]), saying);
    yield call(getSayings, {
      api,
      filter,
      page,
      pageSize,
    });
  }
  catch (err) {
    yield put(updateSayingError(err));
  }
}

export function* tagKeyword(payload) {
  const { api, saying, value, start, end, keywordId, keywordName, filter, page, pageSize } = payload;
  const mutableSaying = Immutable.asMutable(saying, { deep: true });
  const keywordToAdd = {
    value,
    keyword: keywordName,
    start,
    end,
    keywordId,
  };
  if (keywordName.indexOf('sys.') !== -1) {
    keywordToAdd.extractor = 'system';
    keywordToAdd.keywordId = 0;
  }
  mutableSaying.keywords.push(keywordToAdd);
  try {
    yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page, pageSize });
  }
  catch (err) {
    yield put(updateSayingError(err));
  }
}

export function* untagKeyword(payload) {
  const { api, saying, start, end, filter, page, pageSize } = payload;
  const mutableSaying = Immutable.asMutable(saying, { deep: true });
  mutableSaying.keywords = mutableSaying.keywords.filter((keyword) => keyword.start !== start || keyword.end !== end);
  try {
    yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page, pageSize });
  }
  catch (err) {
    yield put(updateSayingError(err));
  }
}

export function* addAction(payload) {
  const { api, saying, actionName, filter, page, pageSize } = payload;
  const mutableSaying = Immutable.asMutable(saying, { deep: true });
  mutableSaying.actions.push(actionName);
  try {
    yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page, pageSize });
  }
  catch (err) {
    yield put(updateSayingError(err));
  }
}

export function* deleteAction(payload) {
  const { api, saying, actionName, filter, page, pageSize } = payload;
  const mutableSaying = Immutable.asMutable(saying, { deep: true });
  mutableSaying.actions = mutableSaying.actions.filter((action) => action !== actionName);
  try {
    yield call(putSaying, { api, sayingId: saying.id, saying: mutableSaying, filter, page, pageSize });
  }
  catch (err) {
    yield put(updateSayingError(err));
  }
}

export function* getCategories(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, filter } = payload;
  const skip = 0;
  const limit = -1;
  try {
    const params = {
      filter,
      skip,
      limit,
    };
    const response = yield call(api.get, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CATEGORY]), { params });

    if (filter !== undefined) {
      yield put(loadFilteredCategoriesSuccess({ categories: response.data }));
    }
    else {
      yield put(loadCategoriesSuccess({ categories: response.data }));
      yield put(loadFilteredCategoriesSuccess({ categories: response.data }));
    }
  }
  catch (err) {
    if (filter !== undefined) {
      yield put(loadFilteredCategoriesError(response));
    }
    else {
      yield put(loadCategoriesError(err));
    }
  }
}

export function* putReviewPageSize(payload) {
  const agentSettings = yield select(makeSelectAgentSettings());
  const { api, agentId, pageSize } = payload;
  const mutableSettings = Immutable.asMutable(agentSettings, { deep: true });
  mutableSettings.reviewPageSize = pageSize;
  try {
    yield call(api.put, toAPIPath([ROUTE_AGENT, agentId, ROUTE_SETTINGS]), mutableSettings);
  }
  catch (err) {
    throw err;
  }
}

export function* getAgentDocument(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, page, pageSize, field, direction } = payload;
  let skip = 0;
  let limit = -1;
  if (page) {
    skip = (page - 1) * pageSize;
    limit = pageSize;
  }
  try {
    const params = {
      skip,
      limit,
      field,
      direction,
    };
    const response = yield call(api.get, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_DOCUMENT]), { params });
    yield put(loadAgentDocumentsSuccess({ documents: response.data, total: response.totalCount }));

  }
  catch (err) {
    yield put(loadAgentDocumentsError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_SAYINGS, getSayings);
  yield takeLatest(COPY_SAYING, postSaying);
  yield takeLatest(DELETE_SAYING, deleteSaying);
  yield takeLatest(TAG_KEYWORD, tagKeyword);
  yield takeLatest(UNTAG_KEYWORD, untagKeyword);
  yield takeLatest(ADD_ACTION_SAYING, addAction);
  yield takeLatest(DELETE_ACTION_SAYING, deleteAction);
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(LOAD_ACTIONS, getActions);
  yield takeLatest(LOAD_CATEGORIES, getCategories);
  yield takeLatest(LOAD_FILTERED_CATEGORIES, getCategories);
  yield takeLatest(CHANGE_REVIEW_PAGE_SIZE, putReviewPageSize);
  yield takeLatest(LOAD_AGENT_DOCUMENTS, getAgentDocument);
};
