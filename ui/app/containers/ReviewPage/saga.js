import { call, put, select, takeLatest } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import {
  ROUTE_AGENT,
  ROUTE_CATEGORY,
  ROUTE_DOCUMENT,
  ROUTE_SAYING,
  ROUTE_SETTINGS,
  ROUTE_SESSION,
  ROUTE_CONTEXT,
  PARAM_DELETE_BY_QUERY
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import { getActions } from '../ActionPage/saga';

import {
  copySayingError,
  copySayingSuccess,
  loadAgentDocuments,
  loadAgentDocumentsError,
  loadAgentDocumentsSuccess,
  deleteDocumentError,
  deleteSessionDataError,
  loadAgentSessionsSuccess,
  loadAgentSessionsError,
  loadCategoriesError,
  loadCategoriesSuccess,
  loadFilteredCategoriesError,
  loadFilteredCategoriesSuccess,
  loadSayingsError,
  loadSayingsSuccess,
  updateSayingError,
  loadSession,
  loadAgentSessions,
} from '../App/actions';

import {
  ADD_ACTION_SAYING,
  CHANGE_REVIEW_PAGE_SIZE,
  CHANGE_SESSIONS_PAGE_SIZE,
  COPY_SAYING,
  DELETE_ACTION_SAYING,
  DELETE_SAYING,
  LOAD_ACTIONS,
  LOAD_AGENT_DOCUMENTS,
  DELETE_DOCUMENT,
  LOAD_AGENT_SESSIONS,
  LOAD_CATEGORIES,
  LOAD_FILTERED_CATEGORIES,
  LOAD_KEYWORDS,
  LOAD_SAYINGS,
  TAG_KEYWORD,
  UNTAG_KEYWORD,
  LOAD_SESSION,
  DELETE_SESSION_DATA,
} from '../App/constants';

import { makeSelectAgent, makeSelectAgentSettings } from '../App/selectors';

import { getKeywords } from '../DialoguePage/saga';
//import { getSession } from '../../components/ConversationBar/saga';

export function* postSaying(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, userSays, keywords = [], categoryId, actions } = payload;
  try {
    const newSayingData = {
      userSays,
      keywords,
      actions,
    };
    const response = yield call(
      api.post,
      toAPIPath([
        ROUTE_AGENT,
        agent.id,
        ROUTE_CATEGORY,
        categoryId,
        ROUTE_SAYING,
      ]),
      newSayingData,
    );
    yield put(copySayingSuccess(response));
  } catch (err) {
    yield put(copySayingError(err));
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
      saying,
    );
    yield call(getSayings, {
      api,
      filter,
      page,
      pageSize,
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
  const skip = 0;
  const limit = -1;
  try {
    const params = {
      filter,
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
      yield put(loadFilteredCategoriesError(response));
    } else {
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
    yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, agentId, ROUTE_SETTINGS]),
      mutableSettings,
    );
  } catch (err) {
    throw err;
  }
}

export function* putSessionsPageSize(payload) {
  const agentSettings = yield select(makeSelectAgentSettings());
  const { api, agentId, pageSize } = payload;
  const mutableSettings = Immutable.asMutable(agentSettings, { deep: true });
  mutableSettings.sessionsPageSize = pageSize;
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

export function* getAgentDocument(payload) {
  debugger;
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
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_DOCUMENT]),
      { params },
    );
    yield put(
      loadAgentDocumentsSuccess({
        documents: response.data,
        total: response.totalCount,
      }),
    );
  } catch (err) {
    yield put(loadAgentDocumentsError(err));
  }
}

export function* deleteDocument(payload) {
  const { api, documentId, sessionId, page, pageSize, field, direction } = payload;
  try {
    let session;
    try {
      session = yield call(
        api.get,
        toAPIPath([ROUTE_CONTEXT, sessionId])
      );
    } catch (err) {
      if (!err.response || !err.response.status || err.response.status !== 404) {
        throw (err);
      }
    }

    if (session) {
      let patchPayload = session;
      delete patchPayload.id;
      delete patchPayload.sessionId;
      patchPayload.docIds = patchPayload.docIds.filter((docId) => {
        return docId !== documentId;
      })

      yield call(
        api.patch,
        toAPIPath([ROUTE_CONTEXT, sessionId]),
        patchPayload,
      );
    }

    yield call(
      api.delete,
      toAPIPath([ROUTE_DOCUMENT, documentId])
    );
    yield put(loadAgentDocuments({
      page, pageSize, field, direction
    }));
    yield put(loadAgentSessions(
      page, pageSize, field, direction
    ));

    if (session) {
      yield put(
        loadSession(sessionId)
      );
    }
  } catch (err) {
    yield put(deleteDocumentError(err));
  }
}

export function* deleteSessionData(payload) {
  const { api, sessionId, page, pageSize, field, direction } = payload;
  try {

    let session;
    try {
      session = yield call(
        api.get,
        toAPIPath([ROUTE_CONTEXT, sessionId])
      );
    } catch (err) {
      if (!err.response || !err.response.status || err.response.status !== 404) {
        throw (err);
      }
    }

    if (session) {
      let patchPayload = session;
      delete patchPayload.id;
      delete patchPayload.sessionId;
      patchPayload.docIds = [];

      yield call(
        api.patch,
        toAPIPath([ROUTE_CONTEXT, sessionId]),
        patchPayload,
      );
    }

    yield call(
      api.post,
      toAPIPath([ROUTE_DOCUMENT, PARAM_DELETE_BY_QUERY]),
      {
        "query": {
          "match": {
            "session": sessionId
          }
        }
      }
    );
    yield put(
      loadSession(sessionId)
    );

    yield put(loadAgentDocuments({
      page, pageSize, field, direction
    }));
    yield put(loadAgentSessions(
      page, pageSize, field, direction
    ));

  } catch (err) {
    yield put(deleteSessionDataError(err));
  }
}

export function* getAgentSessions(payload) {
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
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_SESSION]),
      { params },
    );
    yield put(
      loadAgentSessionsSuccess({
        sessions: response.data,
        total: response.totalCount,
      }),
    );
  } catch (err) {
    yield put(loadAgentSessionsError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(COPY_SAYING, postSaying);
  yield takeLatest(TAG_KEYWORD, tagKeyword);
  yield takeLatest(UNTAG_KEYWORD, untagKeyword);
  yield takeLatest(ADD_ACTION_SAYING, addAction);
  yield takeLatest(DELETE_ACTION_SAYING, deleteAction);
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(LOAD_ACTIONS, getActions);
  yield takeLatest(LOAD_CATEGORIES, getCategories);
  yield takeLatest(LOAD_FILTERED_CATEGORIES, getCategories);
  yield takeLatest(CHANGE_REVIEW_PAGE_SIZE, putReviewPageSize);
  yield takeLatest(CHANGE_SESSIONS_PAGE_SIZE, putSessionsPageSize);
  yield takeLatest(LOAD_AGENT_DOCUMENTS, getAgentDocument);
  yield takeLatest(DELETE_DOCUMENT, deleteDocument);
  yield takeLatest(DELETE_SESSION_DATA, deleteSessionData);
  yield takeLatest(LOAD_AGENT_SESSIONS, getAgentSessions);
  //yield takeLatest(LOAD_SESSION, getSession);
}
