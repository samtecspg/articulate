import _ from 'lodash';
import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import ExtractTokensFromString from '../../utils/extractTokensFromString';
import { getActions } from '../ActionPage/saga';
import {
  addSayingError,
  deleteSayingError,
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
  ADD_SAYING,
  CHANGE_SAYINGS_PAGE_SIZE,
  DELETE_ACTION_SAYING,
  DELETE_SAYING,
  LOAD_ACTIONS,
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
  makeSelectNewSayingActions,
  makeSelectSelectedCategory,
} from '../App/selectors';
import { getKeywords } from '../KeywordsPage/saga';

export function* getSayings(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, filter, page, pageSize } = payload;
  const { remainingText, found } = ExtractTokensFromString({ text: filter, tokens: ['category', 'actions'] });
  const tempFilter = filter === '' ? undefined : JSON.stringify({
    category: found.category,
    actions: found.actions,
    query: remainingText,
  });
  let skip = 0;
  let limit = -1;
  if (page) {
    skip = (page - 1) * pageSize;
    limit = pageSize;
  }
  try {
    console.log(`saga::getSayings{filter, page, pageSize}`); // TODO: REMOVE!!!!
    console.log({ tempFilter, page, pageSize }); // TODO: REMOVE!!!!
    const response = yield call(api.agent.getAgentAgentidSaying, {
      agentId: agent.id,
      filter: tempFilter,
      skip,
      limit,
      field: 'id',
      direction: 'DESC',
      loadCategoryId: true,
    });
    yield put(loadSayingsSuccess({ sayings: response.obj.data, total: response.obj.totalCount }));
  }
  catch (err) {
    yield put(loadSayingsError(err));
  }
}

export function* postSaying(payload) {
  const agent = yield select(makeSelectAgent());
  const category = yield select(makeSelectSelectedCategory());
  const actions = yield select(makeSelectNewSayingActions());
  const { api, value, filter, page, pageSize } = payload;
  try {
    const newSayingData = {
      userSays: value,
      keywords: [],
      actions,
    };
    yield call(api.agent.postAgentAgentidCategoryCategoryidSaying, {
      agentId: agent.id,
      categoryId: category,
      body: newSayingData,
    });
    yield call(getSayings, {
      api,
      filter,
      pageSize,
      page,
    });
  }
  catch (err) {
    yield put(addSayingError(err));
  }
}

export function* deleteSaying(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, sayingId, categoryId, filter, page, pageSize } = payload;
  try {
    yield call(api.agent.deleteAgentAgentidCategoryCategoryidSayingSayingid, {
      agentId: agent.id,
      categoryId,
      sayingId,
    });
    yield call(getSayings, {
      api,
      filter,
      page,
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
  try {
    yield call(api.agent.putAgentAgentidCategoryCategoryidSayingSayingid, {
      agentId: agent.id,
      categoryId: saying.category,
      sayingId,
      body: _.omit(saying, ['id', 'agent', 'category', 'Action', 'Category']),
    });
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
    const response = yield call(api.agent.getAgentAgentidCategory, {
      agentId: agent.id,
      filter,
      skip,
      limit,
    });
    if (filter !== undefined) {
      yield put(loadFilteredCategoriesSuccess({ categories: response.obj.data }));
    }
    else {
      yield put(loadCategoriesSuccess({ categories: response.obj.data }));
      yield put(loadFilteredCategoriesSuccess({ categories: response.obj.data }));
    }
  }
  catch (err) {
    if (filter !== undefined) {
      yield put(loadFilteredCategoriesError(response.obj));
    }
    else {
      yield put(loadCategoriesError(err));
    }
  }
}

export function* putSayingsPageSize(payload) {
  const agentSettings = yield select(makeSelectAgentSettings());
  const { api, agentId, pageSize } = payload;
  const mutableSettings = Immutable.asMutable(agentSettings, { deep: true });
  mutableSettings.sayingsPageSize = pageSize;
  try {
    yield call(api.agent.putAgentAgentidSettings, { agentId, body: mutableSettings });
  }
  catch (err) {
    throw err;
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_SAYINGS, getSayings);
  yield takeLatest(ADD_SAYING, postSaying);
  yield takeLatest(DELETE_SAYING, deleteSaying);
  yield takeLatest(TAG_KEYWORD, tagKeyword);
  yield takeLatest(UNTAG_KEYWORD, untagKeyword);
  yield takeLatest(ADD_ACTION_SAYING, addAction);
  yield takeLatest(DELETE_ACTION_SAYING, deleteAction);
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(LOAD_ACTIONS, getActions);
  yield takeLatest(LOAD_CATEGORIES, getCategories);
  yield takeLatest(LOAD_FILTERED_CATEGORIES, getCategories);
  yield takeLatest(CHANGE_SAYINGS_PAGE_SIZE, putSayingsPageSize);
};
