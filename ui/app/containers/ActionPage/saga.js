import { call, put, select, takeLatest } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import {
  ROUTE_ACTION,
  ROUTE_AGENT,
  ROUTE_POST_FORMAT,
  ROUTE_WEBHOOK,
  ROUTE_RICH_RESPONSE,
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  addActionError,
  addActionSuccess,
  loadActionError,
  loadActionsError,
  loadActionsSuccess,
  loadActionSuccess,
  updateActionError,
  loadFilteredActionsuccess,
  loadFilteredActionsError,
  updateActionSuccess,
  loadRichResponsesSuccess,
  loadRichResponsesError
} from '../App/actions';
import {
  ADD_ACTION,
  DELETE_ACTION,
  LOAD_ACTION,
  LOAD_ACTIONS,
  LOAD_KEYWORDS,
  UPDATE_ACTION,
  LOAD_FILTERED_ACTIONS,
  LOAD_RICH_RESPONSES,
} from '../App/constants';
import {
  makeSelectAction,
  makeSelectActionPostFormat,
  makeSelectActionWebhook,
  makeSelectAgent,
  makeSelectCurrentAction,
  makeSelectSayingForAction,
} from '../App/selectors';

import { getKeywords, putSaying } from '../DialoguePage/saga';

export function* getActions(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, agentId, filter, loadForDropdown } = payload;
  let transformedFilter = filter;
  if (filter !== undefined) {
    transformedFilter = {
      actionName: filter,
    };
  }
  const skip = 0;
  const limit = -1;
  try {
    const params = {
      field: 'actionName',
      filter: transformedFilter
        ? JSON.stringify(transformedFilter)
        : transformedFilter,
      skip,
      limit,
    };
    const response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agentId || agent.id, ROUTE_ACTION]),
      { params },
    );

    params.skip = 0;
    params.limit = 3;
    params.field = 'modificationDate';
    params.direction = 'DESC';
    const recentActions = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agentId || agent.id, ROUTE_ACTION]),
      { params },
    );
    const recentActionsIds = [];
    recentActions.data.forEach((recentAction) => {

      recentAction.recent = true;
      recentActionsIds.push(recentAction.id);
    });
    const actionsWithoutRecents = response.data.filter((action) => {

      return recentActionsIds.indexOf(action.id) === -1;
    });
    const sortedActions = recentActions.data.concat(actionsWithoutRecents);

    if (filter !== undefined) {
      yield put(loadFilteredActionsuccess({ actions: sortedActions }));
    } else {
      yield put(
        loadActionsSuccess({
          actions: sortedActions,
          total: response.totalCount,
        }),
      );
      yield put(loadFilteredActionsuccess({ actions: sortedActions }));
    }
  } catch (err) {
    if (filter !== undefined) {
      yield put(loadFilteredActionsError(err));
    } else {
      yield put(loadActionsError(err));
    }
  }
}

export function* getAction(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, actionId, isDuplicate } = payload;
  let response;
  let webhook;
  let postFormat;
  try {
    response = yield call(
      api.get,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_ACTION, actionId]),
    );
    const action = response;
    if (action.useWebhook) {
      try {
        webhook = yield call(
          api.get,
          toAPIPath([
            ROUTE_AGENT,
            agent.id,
            ROUTE_ACTION,
            actionId,
            ROUTE_WEBHOOK,
          ]),
        );
      } catch (errWebhook) {
        console.log(errWebhook);
      }
    }
    if (action.usePostFormat) {
      try {
        postFormat = yield call(
          api.get,
          toAPIPath([
            ROUTE_AGENT,
            agent.id,
            ROUTE_ACTION,
            actionId,
            ROUTE_POST_FORMAT,
          ]),
        );
      } catch (errWebhook) {
        console.log(errWebhook);
      }
    }
    yield put(loadActionSuccess({ action, webhook, postFormat, isDuplicate }));
  } catch (err) {
    yield put(loadActionError(err));
  }
}

function* postActionWebhook(payload) {
  const actionWebhook = yield select(makeSelectActionWebhook());
  const agent = yield select(makeSelectAgent());
  const mutableActionWebhook = Immutable.asMutable(actionWebhook, {
    deep: true,
  });
  delete mutableActionWebhook.id;
  delete mutableActionWebhook.creationDate;
  delete mutableActionWebhook.modificationDate;
  const { api, id } = payload;
  try {
    yield call(
      api.post,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_ACTION, id, ROUTE_WEBHOOK]),
      mutableActionWebhook,
    );
  } catch (err) {
    throw err;
  }
}

function* postActionPostFormat(payload) {
  const actionPostFormat = yield select(makeSelectActionPostFormat());
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  const mutableActionPostFormat = Immutable.asMutable(actionPostFormat, {
    deep: true,
  });
  delete mutableActionPostFormat.id;
  delete mutableActionPostFormat.creationDate;
  delete mutableActionPostFormat.modificationDate;
  try {
    yield call(
      api.post,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_ACTION, id, ROUTE_POST_FORMAT]),
      mutableActionPostFormat,
    );
  } catch (err) {
    throw err;
  }
}

function* putActionWebhook(payload) {
  const actionWebhook = yield select(makeSelectActionWebhook());
  const agent = yield select(makeSelectAgent());
  const mutableActionWebhook = Immutable.asMutable(actionWebhook, {
    deep: true,
  });
  const { api, id } = payload;
  if (mutableActionWebhook.id) {
    delete mutableActionWebhook.id;
  }
  try {
    yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_ACTION, id, ROUTE_WEBHOOK]),
      mutableActionWebhook,
    );
  } catch (err) {
    throw err;
  }
}

function* putActionPostFormat(payload) {
  const actionPostFormat = yield select(makeSelectActionPostFormat());
  const agent = yield select(makeSelectAgent());
  const mutablePostFormat = Immutable.asMutable(actionPostFormat);
  const { api, id } = payload;
  if (mutablePostFormat.id) {
    delete mutablePostFormat.id;
  }
  try {
    yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_ACTION, id, ROUTE_POST_FORMAT]),
      mutablePostFormat,
    );
  } catch (err) {
    throw err;
  }
}

function* deleteActionWebhook(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(
      api.delete,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_ACTION, id, ROUTE_WEBHOOK]),
    );
  } catch (err) {
    throw err;
  }
}

function* deleteActionPostFormat(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(
      api.delete,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_ACTION, id, ROUTE_POST_FORMAT]),
    );
  } catch (err) {
    throw err;
  }
}

export function* postAction(payload) {
  const action = yield select(makeSelectAction());
  const agent = yield select(makeSelectAgent());
  const mutableAction = Immutable.asMutable(action, { deep: true });
  delete mutableAction.agent;
  delete mutableAction.id;
  delete mutableAction.creationDate;
  delete mutableAction.modificationDate;
  const { api, addToNewSayingActions } = payload;
  try {
    const response = yield call(
      api.post,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_ACTION]),
      mutableAction,
    );
    if (action.useWebhook) {
      yield call(postActionWebhook, { id: response.id, api });
    }
    if (action.usePostFormat) {
      yield call(postActionPostFormat, { id: response.id, api });
    }
    const sayingForAction = yield select(makeSelectSayingForAction());
    if (sayingForAction.agent) {
      const mutableSayingForAction = Immutable.asMutable(sayingForAction, {
        deep: true,
      });
      mutableSayingForAction.actions.push(response.actionName);
      const updateSayingPayload = {
        api,
        sayingId: sayingForAction.id,
        saying: mutableSayingForAction,
      };
      yield call(putSaying, updateSayingPayload);
    }
    yield put(addActionSuccess({ action: response, addToNewSayingActions }));
  } catch (err) {
    yield put(addActionError(err));
  }
}

export function* putAction(payload) {
  const agent = yield select(makeSelectAgent());
  const action = yield select(makeSelectAction());
  const currentAction = yield select(makeSelectCurrentAction());
  const mutableAction = Immutable.asMutable(action, { deep: true });
  const { api } = payload;
  delete mutableAction.id;
  delete mutableAction.agent;
  try {
    const response = yield call(
      api.put,
      toAPIPath([ROUTE_AGENT, agent.id, ROUTE_ACTION, currentAction.id]),
      mutableAction,
    );
    if (!currentAction.useWebhook) {
      if (action.useWebhook) {
        yield call(postActionWebhook, { id: currentAction.id, api });
      }
    } else if (currentAction.useWebhook) {
      if (!action.useWebhook) {
        yield call(deleteActionWebhook, { id: currentAction.id, api });
      } else {
        yield call(putActionWebhook, { id: currentAction.id, api });
      }
    }
    if (!currentAction.usePostFormat) {
      if (action.usePostFormat) {
        yield call(postActionPostFormat, { id: currentAction.id, api });
      }
    } else if (currentAction.usePostFormat) {
      if (!action.usePostFormat) {
        yield call(deleteActionPostFormat, { id: currentAction.id, api });
      } else {
        yield call(putActionPostFormat, { id: currentAction.id, api });
      }
    }
    yield put(updateActionSuccess(response, currentAction.actionName));
  } catch (err) {
    yield put(updateActionError(err));
  }
}

export function* getRichResponses(payload) {
  const { api } = payload;

  try {
    const response = yield call(api.get, toAPIPath([ROUTE_RICH_RESPONSE]));
    yield put(loadRichResponsesSuccess(response));
  } catch (err) {
    yield put(loadRichResponsesError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_ACTION, getAction);
  yield takeLatest(LOAD_ACTIONS, getActions);
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(ADD_ACTION, postAction);
  yield takeLatest(UPDATE_ACTION, putAction);
  yield takeLatest(LOAD_FILTERED_ACTIONS, getActions);
  yield takeLatest(LOAD_RICH_RESPONSES, getRichResponses);
}
