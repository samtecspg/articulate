import { push } from 'react-router-redux';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import {
  ROUTE_AGENT,
  ROUTE_IDENTIFY_KEYWORDS,
  ROUTE_KEYWORD,
  ROUTE_SETTINGS,
  ROUTE_RECOGNIZE_UPDATED_KEYWORDS,
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  addModifierSayingSuccess,
  createKeywordError,
  createKeywordSuccess,
  deleteKeywordError,
  loadKeywordError,
  loadKeywordSuccess,
  loadKeyword,
  loadKeywords,
  updateKeywordError,
  updateKeywordSuccess,
  refreshKeywordExamplesUpdate,
  recognizeUpdatedKeywords,
  loadSayings
} from '../App/actions';
import {
  ADD_MODIFIER_SAYING,
  CHANGE_MODIFIER_SAYINGS_PAGE_SIZE,
  CREATE_KEYWORD,
  DELETE_KEYWORD,
  LOAD_KEYWORD,
  LOAD_KEYWORDS,
  UPDATE_KEYWORD,
  RECOGNIZE_UPDATED_KEYWORDS
} from '../App/constants';
import {
  makeSelectAgent,
  makeSelectAgentSettings,
  makeSelectKeyword,
  makeSelectkeywordExamplesUpdate,
  makeSelectDialoguePageFilterString,
} from '../App/selectors';
import { getKeywords } from '../DialoguePage/saga';

export function* getKeyword(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_KEYWORD, id]),
    );
    response.regex = response.regex ? response.regex : '';
    yield put(loadKeywordSuccess(response));
  } catch (err) {
    yield put(loadKeywordError(err));
  }
}

export function* postKeyword(payload) {
  const agent = yield select(makeSelectAgent());
  const keyword = yield select(makeSelectKeyword());
  const newKeyword = Immutable.asMutable(keyword, { deep: true });
  delete newKeyword.agent;
  const { api, updateSayingsKeywords } = payload;
  try {
    const response = yield call(
      api.post,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_KEYWORD]),
      newKeyword,
    );
    if (updateSayingsKeywords) {
      yield call(putRecognizeUpdatedKeywords, payload, response.id);
      yield put(refreshKeywordExamplesUpdate());
    }
    yield put(createKeywordSuccess(response));
  } catch (err) {
    const error = { ...err };
    yield put(createKeywordError(error.response.data.message));
  }
}

export function* putKeyword(payload) {
  const agent = yield select(makeSelectAgent());
  const keyword = yield select(makeSelectKeyword());
  const mutableKeyword = Immutable.asMutable(keyword, { deep: true });
  const keywordId = keyword.id;
  const { api, updateSayingsKeywords } = payload;
  delete mutableKeyword.id;
  delete mutableKeyword.agent;
  try {
    const response = yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_KEYWORD, keywordId]),
      mutableKeyword,
    );
    if (updateSayingsKeywords) {
      yield call(putRecognizeUpdatedKeywords, payload);
      yield put(refreshKeywordExamplesUpdate());
    }
    yield put(loadKeyword(keywordId));
    yield put(updateKeywordSuccess(response));
    var agentSettings = yield select(makeSelectAgentSettings());
    var dialoguePageFilterString = yield select(makeSelectDialoguePageFilterString());
    //This is in case the name of the keyword change, the sayings are updated so they are loaded again
    yield put(loadSayings(dialoguePageFilterString, 1, agentSettings.sayingsPageSize));
  } catch (err) {
    yield put(updateKeywordError(err));
  }
}

export function* putRecognizeUpdatedKeywords(payload, createdKeywordId = null) {
  const agent = yield select(makeSelectAgent());
  const keyword = yield select(makeSelectKeyword());
  const keywordExamplesUpdate = yield select(makeSelectkeywordExamplesUpdate());
  let keywordExamplesUpdateClean = yield call(() => {
    return keywordExamplesUpdate.filter(update => {
      return update.count !== 0;
    })
  });
  let keywordExamplesAdd = yield call(() => {
    return keywordExamplesUpdateClean.filter(update => {
      return update.count > 0;
    }).map(update => update.synonym)
      .filter((update, index, self) => self.indexOf(update) === index)
      .map(synonym => {
        return {
          "synonym": synonym,
          "keywordName": keyword.keywordName,
          "keywordId": keyword.id ? keyword.id : createdKeywordId
        }
      });
  })

  let keywordExamplesDelete = yield call(() => {
    return keywordExamplesUpdateClean.filter(updateClean => {
      return updateClean.count < 0 && !keywordExamplesAdd.find(function (update) {
        return update.synonym === updateClean.synonym
      })
    }).map(update => update.synonym)
      .filter((update, index, self) => self.indexOf(update) === index)
      .map(synonym => {
        return {
          "synonym": synonym,
          "keywordName": keyword.keywordName,
          "keywordId": keyword.id
        }
      });
  });
  const { api } = payload;
  try {
    const response = yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_RECOGNIZE_UPDATED_KEYWORDS]),
      {
        deletedValues: keywordExamplesDelete,
        updatedValues: keywordExamplesAdd
      },
    );
  } catch (err) {
    throw err;
  }
}

export function* deleteKeyword(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(
      api.delete,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_KEYWORD, id]),
    );
    yield call(getKeywords, {
      api,
      filter: '',
      page: 1,
    });
    yield put(push(`/agent/${agent.id}/dialogue?tab=keywords`));
  } catch (err) {
    const error = { ...err };
    yield put(deleteKeywordError(error.response.data.message));
  }
}

export function* putModifierSayingsPageSize(payload) {
  const agentSettings = yield select(makeSelectAgentSettings());
  const { api, agentId, pageSize } = payload;
  const mutableSettings = Immutable.asMutable(agentSettings, { deep: true });
  mutableSettings.modifierSayingsPageSize = pageSize;
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

export function* getIdentifyKeywords(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, modifierIndex, newSaying, keyword } = payload;
  try {
    const params = {
      text: newSaying,
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_IDENTIFY_KEYWORDS]),
      { params },
    );
    const filteredResponse = response.filter((identifiedKeyword) => {

      return identifiedKeyword.keyword === keyword;
    });
    yield put(addModifierSayingSuccess(modifierIndex, newSaying, filteredResponse));
  } catch (err) {
    yield put(addModifierSayingSuccess(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_KEYWORD, getKeyword);
  yield takeLatest(CREATE_KEYWORD, postKeyword);
  yield takeLatest(UPDATE_KEYWORD, putKeyword);
  yield takeLatest(DELETE_KEYWORD, deleteKeyword);
  yield takeLatest(
    CHANGE_MODIFIER_SAYINGS_PAGE_SIZE,
    putModifierSayingsPageSize,
  );
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(ADD_MODIFIER_SAYING, getIdentifyKeywords);
}
