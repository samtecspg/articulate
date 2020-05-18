import { push } from 'react-router-redux';
import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import {
  ROUTE_AGENT,
  ROUTE_CONNECTION,
  ROUTE_CONTEXT,
  ROUTE_CONVERSE,
  ROUTE_CURRENT,
  ROUTE_POST_FORMAT,
  ROUTE_SETTINGS,
  ROUTE_TRAIN,
  ROUTE_USER,
  ROUTE_WEBHOOK,
  ROUTE_TEST_TRAIN,
  ROUTE_KEYWORD,
  ROUTE_TRAIN_TEST,
  ROUTE_AGENT_VERSION,
  ROUTE_ACTION

} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  getSettings,
  putSetting,
} from '../SettingsPage/saga';
import ExtractTokensFromString from '../../utils/extractTokensFromString';
import {
  loadAgent,
  loadAgentError,
  loadAgentSuccess,
  loadAgentVersions,
  loadAgentVersionsError,
  loadAgentVersionsSuccess,
  addAgentVersionError,
  addAgentVersionSuccess,
  loadAgentVersion,
  loadAgentVersionError,
  loadAgentVersionSuccess,
  updateAgentVersionError,
  updateAgentVersionSuccess,
  deleteAgentVersionError,
  deleteAgentVersionSuccess,
  loadCurrentUserError,
  loadCurrentUserSuccess,
  loadServerInfoError,
  loadServerInfoSuccess,
  loadSessionSuccess,
  logoutUserError,
  logoutUserSuccess,
  resetSessionSuccess,
  showWarning,
  toggleChatButton,
  toggleConversationBar,
  trainAgentError,
  updateSettingsError,
  updateSettingSuccess,
  testAgentTrainError,
  testAgentTrainSuccess,
  loadKeywords,
  loadKeywordsError,
  loadKeywordsSuccess,
  loadAgentTrainTests,
  loadAgentTrainTestsError,
  loadAgentTrainTestsSuccess,
  loadSayings,
  loadAgentLatestTrainTest,
  loadAgentLatestTrainTestSuccess,
  loadAgentLatestTrainTestError,
  closeTestTrainNotification,
  deleteActionSuccess,
  deleteActionError,
  loadActionsPageSuccess,
  loadActionsPageError,
  loadActionsPage
} from './actions';
import {
  LOAD_AGENT,
  LOAD_AGENT_VERSIONS,
  ADD_AGENT_VERSION,
  LOAD_AGENT_VERSION,
  LOAD_CURRENT_USER,
  LOAD_SERVER_INFO,
  LOAD_SETTINGS,
  LOGOUT_USER,
  RESET_SESSION,
  SEND_MESSAGE,
  TOGGLE_CONVERSATION_BAR,
  TRAIN_AGENT,
  UPDATE_SETTING,
  TEST_AGENT_TRAIN,
  UPDATE_AGENT_VERSION,
  DELETE_AGENT_VERSION,
  LOAD_KEYWORDS,
  LOAD_AGENT_TRAIN_TESTS,
  LOAD_AGENT_LATEST_TRAIN_TEST,
  DELETE_ACTION,
  LOAD_ACTIONS_PAGE,
} from './constants';
import {
  makeSelectAgent,
  makeSelectConnection,
  makeSelectSessionId,
  makeSelectSettings,
  makeSelectAgentSettings,
  makeSelectDialoguePageFilterString,
} from './selectors';

export function* postConverse(payload) {
  const agent = yield select(makeSelectAgent());
  const connection = yield select(makeSelectConnection());
  const systemSessionId = yield select(makeSelectSessionId());

  if (agent.id) {
    const { api, message, newSession, isDemo } = payload;
    if (message.sessionId || systemSessionId) {
      const sessionId = systemSessionId || message.sessionId;
      try {
        const postPayload = {
          params: {
            debug: true,
          },
          data: {
            sessionId,
            text: message.message,
            articulateUI: true,
          },
        };
        yield call(api.post, toAPIPath(isDemo ? [ROUTE_CONNECTION, connection.id, 'external'] : [ROUTE_AGENT, agent.id, ROUTE_CONVERSE]), null, postPayload);

        if (newSession) {
          yield put(loadSessionSuccess(sessionId));
        }
      } catch (err) {
        yield put(showWarning('errorCallingArticulate'));
      }
    } else {
      yield put(showWarning('errorSelectOrCreateASession'));
    }
  } else {
    yield put(showWarning('errorClickOnAgentFirst'));
  }
}

export function* deleteSession(payload) {
  const sessionId = yield select(makeSelectSessionId());
  if (sessionId) {
    try {
      const { api } = payload;
      const patchPayload = {
        actionQueue: [],
        savedSlots: {},
        docIds: [],
        listenFreeText: false,
      };
      yield call(api.patch, toAPIPath([ROUTE_CONTEXT, sessionId]), patchPayload);
      yield put(resetSessionSuccess());
    } catch ({ response }) {
      if (response.status && response.status === 404) {
        yield put(resetSessionSuccess());
      } else {
        yield put(showWarning('errorCleaningSessionData'));
      }
    }
  } else {
    yield put(showWarning('errorSelectSessionToClear'));
  }
}

export function* postTrainAgent(payload) {
  const agent = yield select(makeSelectAgent());
  const { api } = payload;
  try {
    yield call(api.post, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_TRAIN]));
  } catch (err) {
    const error = { ...err };
    yield put(trainAgentError(error.response.data.message));
  }
}

export function* getAgent(payload) {
  const { api, agentId } = payload;
  try {
    let response = yield call(api.get, toAPIPath([ROUTE_AGENT, agentId]));
    const agent = response;
    agent.categoryClassifierThreshold *= 100;
    let webhook;
    let postFormat;
    if (agent.useWebhook) {
      response = yield call(api.get, toAPIPath([ROUTE_AGENT, agentId, ROUTE_WEBHOOK]));
      webhook = response;
    }
    if (agent.usePostFormat) {
      response = yield call(api.get, toAPIPath([ROUTE_AGENT, agentId, ROUTE_POST_FORMAT]));
      postFormat = response;
    }
    yield put(loadAgentSuccess({ agent, webhook, postFormat }));
    yield put(loadAgentVersions(agent.originalAgentVersionId == -1 ? agent.id : agent.originalAgentVersionId));
    yield put(closeTestTrainNotification());
    yield put(loadAgentLatestTrainTest());
  } catch (err) {
    yield put(loadAgentError(err));
  }
}

export function* postagentVersion(payload) {
  const { api, id } = payload;
  try {
    const version = yield call(api.post, toAPIPath([ROUTE_AGENT, id, ROUTE_AGENT_VERSION]));
    yield put(addAgentVersionSuccess(version));
    yield put(loadAgentVersions(id));
  } catch (err) {
    yield put(addAgentVersionError(err));
  }
}

export function* getagentVersions(payload) {
  const { api, originalAgentVersionId } = payload;
  try {
    const response = yield call(api.get, toAPIPath([ROUTE_AGENT, Number(originalAgentVersionId), ROUTE_AGENT_VERSION]));
    yield put(loadAgentVersionsSuccess(response.data));
  } catch (err) {
    yield put(loadAgentVersionsError(_.get(err, 'response.data', true)));
  }
}

export function* getAgentVersion(payload) {
  const { api, versionId, currentAgentId } = payload;
  try {
    var agentWithLoadedVersion = yield call(api.put, toAPIPath([ROUTE_AGENT, Number(currentAgentId), ROUTE_AGENT_VERSION, Number(versionId), 'load']));
    window.location.reload();
    yield put(loadAgentVersionSuccess());
  } catch (err) {
    yield put(loadAgentVersionError(err));
  }
}

export function* putAgentVersion(payload) {
  const { api, version } = payload;
  try {
    var id = version.id;
    var currentAgentId = version.originalAgentVersionId
    delete version.id;
    delete version.settings;
    delete version.status;
    delete version.lastTraining;

    const response = yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, currentAgentId, ROUTE_AGENT_VERSION, id]),
      version,
    );
    yield put(updateAgentVersionSuccess(response));
    yield put(loadAgentVersions(currentAgentId));
  } catch (err) {
    yield put(updateAgentVersionError(err));
  }
}

export function* deleteAgentVersion(payload) {
  const { api, versionId, currentAgentId } = payload;
  try {
    yield call(api.delete, toAPIPath([ROUTE_AGENT, versionId, ROUTE_AGENT_VERSION, versionId]));
    yield put(deleteAgentVersionSuccess());
    yield put(loadAgentVersions(currentAgentId));
  } catch (err) {
    yield put(deleteAgentVersionError(err));
  }
}

export function* getServerInfo(payload) {
  const { api } = payload;
  try {
    const response = yield call(api.get, toAPIPath([]));
    yield put(loadServerInfoSuccess(response));
  } catch (err) {
    yield put(loadServerInfoError(err));
  }
}

export function* putConversationBarWidth(payload) {
  const { api } = payload;
  const settings = yield select(makeSelectSettings());
  const width = settings.conversationPanelWidth;
  try {
    if (width > 300) {
      const response = yield call(api.put, toAPIPath([ROUTE_SETTINGS, 'conversationPanelWidth']), 300);
      yield put(updateSettingSuccess(response));
    }
  } catch (err) {
    yield put(updateSettingsError(err));
  }
}

export function* logoutUser(payload) {
  const { api } = payload;
  try {
    const response = yield call(
      api.get,
      toAPIPath(['auth', 'logout']),
    );
    yield put(logoutUserSuccess(response));
    yield put(toggleConversationBar(false));
    yield put(toggleChatButton(false));
    yield put(push('/'));
  } catch (err) {
    yield put(logoutUserError(err));
  }
}

export function* getCurrentUser(payload) {
  const { api } = payload;
  try {
    const response = yield call(api.get, toAPIPath([ROUTE_USER, ROUTE_CURRENT]));
    yield put(loadCurrentUserSuccess({ user: response }));
  } catch (err) {
    yield put(loadCurrentUserError(err));
  }
}

export function* testAgentTrain(payload) {
  const { api, id } = payload;
  try {
    const result = yield call(api.get, toAPIPath([ROUTE_AGENT, id, ROUTE_TEST_TRAIN]));
    yield put(testAgentTrainSuccess({ result }));
    yield put(loadKeywords());
    var agentSettings = yield select(makeSelectAgentSettings());
    var dialoguePageFilterString = yield select(makeSelectDialoguePageFilterString());
    yield put(loadSayings(dialoguePageFilterString, 1, agentSettings.sayingsPageSize));
    yield put(loadAgentLatestTrainTest());
    yield put(loadAgentTrainTests({ page: 1, pageSize: 5 }))//FIXME page size
  } catch (error) {
    yield put(testAgentTrainError(error));
  }
}

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

export function* getAgentTrainTests(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, page, pageSize, field, direction, filter } = payload;
  let tempFilter = null;
  if (filter) {
    const { remainingText, found } = ExtractTokensFromString({
      text: filter,
      tokens: ['keywords', 'actions'],
    });
    tempFilter =
      filter === ''
        ? undefined
        : JSON.stringify({
          keywords: found.keywords,
          actions: found.actions,
        });
  }
  let skip = 0;
  let limit = -1;
  if (page) {
    skip = (page - 1) * pageSize;
    limit = pageSize;
  }
  try {
    const params = {
      filter: tempFilter ? tempFilter : null,
      skip,
      limit,
      field,
      direction
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_TRAIN_TEST]),
      { params },
    );
    yield put(
      loadAgentTrainTestsSuccess({
        trainTests: response.data.map(result => {
          return result._source;
        }),
        total: response.totalCount,
      }),
    );
  } catch (err) {
    yield put(loadAgentTrainTestsError(err));
  }
}

export function* getAgentLatestTrainTest(payload) {
  const { api } = payload;
  const agent = yield select(makeSelectAgent());
  try {
    const params = {
      filter: null,
      skip: 0,
      limit: 1,
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_TRAIN_TEST]),
      { params },
    );
    yield put(
      loadAgentLatestTrainTestSuccess({
        trainTest: response.data.length > 0 ?
          response.data[0]._source :
          null
      }),
    );
  } catch (err) {
    yield put(loadAgentLatestTrainTestError(err));
  }
}

export function* deleteTotalAction(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id, redirectUrl, filter, page, pageSize } = payload;
  try {
    yield call(
      api.delete,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_ACTION, id]),
    );
    yield put(deleteActionSuccess());
    if (redirectUrl) {
      yield put(push(redirectUrl));
    }
    if (!redirectUrl && (filter || page || pageSize)) {
      yield put(loadActionsPage(filter, page, pageSize));
    }
  } catch (err) {
    const error = { ...err };
    yield put(deleteActionError(error.response.data.message));
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


export default function* rootSaga() {
  yield takeLatest(LOAD_AGENT, getAgent);
  yield takeLatest(LOAD_AGENT_VERSIONS, getagentVersions);
  yield takeLatest(LOAD_AGENT_VERSION, getAgentVersion);
  yield takeLatest(UPDATE_AGENT_VERSION, putAgentVersion);
  yield takeLatest(DELETE_AGENT_VERSION, deleteAgentVersion);
  yield takeLatest(ADD_AGENT_VERSION, postagentVersion);
  yield takeLatest(LOAD_SETTINGS, getSettings);
  yield takeLatest(LOAD_SERVER_INFO, getServerInfo);
  yield takeLatest(SEND_MESSAGE, postConverse);
  yield takeLatest(RESET_SESSION, deleteSession);
  yield takeLatest(TRAIN_AGENT, postTrainAgent);
  yield takeLatest(UPDATE_SETTING, putSetting);
  yield takeLatest(TOGGLE_CONVERSATION_BAR, putConversationBarWidth);
  yield takeLatest(LOGOUT_USER, logoutUser);
  yield takeLatest(LOAD_CURRENT_USER, getCurrentUser);
  yield takeLatest(LOGOUT_USER, logoutUser);
  yield takeLatest(LOAD_CURRENT_USER, getCurrentUser);
  yield takeLatest(TEST_AGENT_TRAIN, testAgentTrain);
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(LOAD_AGENT_TRAIN_TESTS, getAgentTrainTests);
  yield takeLatest(LOAD_AGENT_LATEST_TRAIN_TEST, getAgentLatestTrainTest);
  yield takeLatest(DELETE_ACTION, deleteTotalAction);
  yield takeLatest(LOAD_ACTIONS_PAGE, getActionsPage);
}
