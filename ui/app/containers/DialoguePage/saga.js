import _ from 'lodash';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import {
  ROUTE_AGENT,
  ROUTE_CATEGORY,
  ROUTE_KEYWORD,
  ROUTE_SAYING,
  ROUTE_SETTINGS,
  ROUTE_ACTION,
} from '../../../common/constants';
import ExtractTokensFromString from '../../utils/extractTokensFromString';
import { toAPIPath } from '../../utils/locationResolver';
import { getActions } from '../ActionPage/saga';
import {
  addSayingError,
  deleteSayingError,
  loadCategoriesError,
  loadCategoriesSuccess,
  loadFilteredCategoriesError,
  loadFilteredCategoriesSuccess,
  loadKeywordsError,
  loadKeywordsSuccess,
  loadSayingsError,
  loadSayingsSuccess,
  updateSayingError,
  updateSayingSuccess,
  loadActionsPageSuccess,
  loadActionsPageError,
} from '../App/actions';
import {
  ADD_ACTION_SAYING,
  ADD_SAYING,
  CHANGE_KEYWORDS_PAGE_SIZE,
  CHANGE_ACTIONS_PAGE_SIZE,
  CHANGE_SAYING_CATEGORY,
  CHANGE_SAYINGS_PAGE_SIZE,
  DELETE_ACTION_SAYING,
  DELETE_SAYING,
  LOAD_ACTIONS,
  LOAD_CATEGORIES,
  LOAD_FILTERED_ACTIONS,
  LOAD_FILTERED_CATEGORIES,
  LOAD_KEYWORDS,
  LOAD_SAYINGS,
  TAG_KEYWORD,
  UNTAG_KEYWORD,
  LOAD_ACTIONS_PAGE,
} from '../App/constants';
import {
  makeSelectAgent,
  makeSelectAgentSettings,
  makeSelectNewSayingActions,
  makeSelectSelectedCategory,
  makeSelectTotalSayings,
} from '../App/selectors';

export function* getKeywords(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, filter, page, pageSize } = payload;
  let skip = 0;
  let limit = -1;
  if (page) {
    skip = (page - 1) * pageSize;
    limit = pageSize;
  }
  try {
    const params = {
      filter: filter === '' ? undefined : filter,
      skip,
      limit,
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_KEYWORD]),
      { params },
    );
    // TODO: Fix in the api the return of total sayings
    yield put(
      loadKeywordsSuccess({
        keywords: response.data,
        total: response.totalCount,
      }),
    );
  } catch (err) {
    yield put(loadKeywordsError(err));
  }
}

export function* getActionsPage(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, filter, page, pageSize } = payload;
  let skip = 0;
  let limit = -1;
  if (page) {
    skip = (page - 1) * pageSize;
    limit = pageSize;
  }
  try {
    const params = {
      filter: filter === '' ? undefined : filter,
      skip,
      limit,
      direction: 'ASC',
      field: 'actionName',
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_ACTION]),
      { params },
    );
    // TODO: Fix in the api the return of total sayings
    yield put(
      loadActionsPageSuccess({
        actions: response.data,
        total: response.totalCount,
      }),
    );
  } catch (err) {
    yield put(loadActionsPageError(err));
  }
}

export function* putKeywordsPageSize(payload) {
  const agentSettings = yield select(makeSelectAgentSettings());
  const { api, agentId, pageSize } = payload;
  const mutableSettings = Immutable.asMutable(agentSettings, { deep: true });
  mutableSettings.keywordsPageSize = pageSize;
  try {
    yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, agentId, ROUTE_SETTINGS]),
      mutableSettings,
    );
  } catch (err) {
    throw err;
  }
}

export function* putActionsPageSize(payload) {
  const agentSettings = yield select(makeSelectAgentSettings());
  const { api, agentId, pageSize } = payload;
  const mutableSettings = Immutable.asMutable(agentSettings, { deep: true });
  mutableSettings.actionsPageSize = pageSize;
  try {
    yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, agentId, ROUTE_SETTINGS]),
      mutableSettings,
    );
  } catch (err) {
    throw err;
  }
}

export function* getSayings(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, filter, page, pageSize } = payload;
  const { remainingText, found } = ExtractTokensFromString({
    text: filter,
    tokens: ['category', 'actions'],
  });
  const tempFilter =
    filter === ''
      ? undefined
      : JSON.stringify({
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
    const params = {
      filter: tempFilter,
      skip,
      limit,
      field: 'id',
      direction: 'DESC',
      loadCategoryId: true,
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_SAYING]),
      { params },
    );
    yield call(getKeywords, { api });
    yield put(
      loadSayingsSuccess({
        sayings: response.data,
        total: response.totalCount,
      }),
    );
  } catch (err) {
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
    yield call(
      api.post,
      toAPIPath([
        ROUTE_AGENT,
        agent.id,
        ROUTE_CATEGORY,
        category,
        ROUTE_SAYING,
      ]),
      newSayingData,
    );
    yield call(getSayings, {
      api,
      filter,
      pageSize,
      page,
    });
  } catch (err) {
    yield put(addSayingError(err));
  }
}

export function* deleteSaying(payload) {
  const agent = yield select(makeSelectAgent());
  const totalSayings = yield select(makeSelectTotalSayings());
  const { api, sayingId, categoryId, filter, page, pageSize } = payload;
  const newPage = totalSayings % 5 === 1 ? page - 1 : page;
  try {
    yield call(
      api.delete,
      toAPIPath([
        ROUTE_AGENT,
        agent.id,
        ROUTE_CATEGORY,
        categoryId,
        ROUTE_SAYING,
        sayingId,
      ]),
    );
    yield call(getSayings, {
      api,
      filter,
      page: newPage,
      pageSize,
    });
  } catch (err) {
    yield put(deleteSayingError(err));
  }
}

export function* putSaying(payload) {
  const agent = yield select(makeSelectAgent());
  const {
    api,
    sayingId,
    saying,
    filter,
    page,
    pageSize,
    oldCategoryId,
  } = payload;
  const valuesToOmit = ['id', 'agent', 'Action', 'Category'];
  if (!oldCategoryId) {
    valuesToOmit.push('category');
  }
  try {
    const categoryId = oldCategoryId || saying.category;
    yield call(
      api.put,
      toAPIPath([
        ROUTE_AGENT,
        agent.id,
        ROUTE_CATEGORY,
        categoryId,
        ROUTE_SAYING,
        sayingId,
      ]),
      _.omit(saying, valuesToOmit),
    );
    yield put(updateSayingSuccess(saying));
  } catch (err) {
    yield put(updateSayingError(err));
  }
}

export function* changeSayingCategory(payload) {
  const { api, saying, categoryId, filter, page, pageSize } = payload;
  const oldCategoryId = saying.category;
  const mutableSaying = Immutable.asMutable(saying, { deep: true });
  mutableSaying.category = categoryId;
  try {
    yield call(putSaying, {
      api,
      sayingId: saying.id,
      saying: mutableSaying,
      filter,
      page,
      pageSize,
      oldCategoryId,
    });
  } catch (err) {
    yield put(updateSayingError(err));
  }
}

export function* tagKeyword(payload) {
  const {
    api,
    saying,
    value,
    start,
    end,
    keywordId,
    keywordName,
    filter,
    page,
    pageSize,
  } = payload;
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
    yield call(putSaying, {
      api,
      sayingId: saying.id,
      saying: mutableSaying,
      filter,
      page,
      pageSize,
    });
  } catch (err) {
    yield put(updateSayingError(err));
  }
}

export function* untagKeyword(payload) {
  const { api, saying, start, end, filter, page, pageSize } = payload;
  const mutableSaying = Immutable.asMutable(saying, { deep: true });
  mutableSaying.keywords = mutableSaying.keywords.filter(
    keyword => keyword.start !== start || keyword.end !== end,
  );
  try {
    yield call(putSaying, {
      api,
      sayingId: saying.id,
      saying: mutableSaying,
      filter,
      page,
      pageSize,
    });
  } catch (err) {
    yield put(updateSayingError(err));
  }
}

export function* addAction(payload) {
  const { api, saying, actionName, filter, page, pageSize } = payload;
  const mutableSaying = Immutable.asMutable(saying, { deep: true });
  mutableSaying.actions.push(actionName);
  try {
    yield call(putSaying, {
      api,
      sayingId: saying.id,
      saying: mutableSaying,
      filter,
      page,
      pageSize,
    });
  } catch (err) {
    yield put(updateSayingError(err));
  }
}

export function* deleteAction(payload) {
  const { api, saying, actionName, filter, page, pageSize } = payload;
  const mutableSaying = Immutable.asMutable(saying, { deep: true });
  mutableSaying.actions = mutableSaying.actions.filter(
    action => action !== actionName,
  );
  try {
    yield call(putSaying, {
      api,
      sayingId: saying.id,
      saying: mutableSaying,
      filter,
      page,
      pageSize,
    });
  } catch (err) {
    yield put(updateSayingError(err));
  }
}

export function* getCategories(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, filter } = payload;
  let transformedFilter = filter;
  if (filter !== undefined) {
    transformedFilter = {
      categoryName: filter,
    };
  }
  const skip = 0;
  const limit = -1;
  try {
    const params = {
      filter: transformedFilter
        ? JSON.stringify(transformedFilter)
        : transformedFilter,
      skip,
      limit,
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CATEGORY]),
      { params },
    );
    if (filter !== undefined) {
      yield put(loadFilteredCategoriesSuccess({ categories: response.data }));
    } else {
      yield put(loadCategoriesSuccess({ categories: response.data }));
      yield put(loadFilteredCategoriesSuccess({ categories: response.data }));
    }
  } catch (err) {
    if (filter !== undefined) {
      yield put(loadFilteredCategoriesError(err));
    } else {
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
    yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, agentId, ROUTE_SETTINGS]),
      mutableSettings,
    );
  } catch (err) {
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
  yield takeLatest(LOAD_ACTIONS, getActions);
  yield takeLatest(LOAD_CATEGORIES, getCategories);
  yield takeLatest(LOAD_FILTERED_CATEGORIES, getCategories);
  yield takeLatest(LOAD_FILTERED_ACTIONS, getActions);
  yield takeLatest(CHANGE_SAYINGS_PAGE_SIZE, putSayingsPageSize);
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(CHANGE_KEYWORDS_PAGE_SIZE, putKeywordsPageSize);
  yield takeLatest(CHANGE_ACTIONS_PAGE_SIZE, putActionsPageSize);
  yield takeLatest(CHANGE_SAYING_CATEGORY, changeSayingCategory);
  yield takeLatest(LOAD_ACTIONS_PAGE, getActionsPage);
}
