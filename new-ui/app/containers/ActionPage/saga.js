import Immutable from 'seamless-immutable';

import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';

import {
  loadActionError,
  loadActionSuccess,
  loadActionsError,
  loadActionsSuccess,
  addActionSuccess,
  addActionError,
  deleteActionSuccess,
  deleteActionError,
  updateActionSuccess,
  updateActionError,
} from '../App/actions';

import {
  LOAD_ACTIONS,
  LOAD_ACTION,
  LOAD_KEYWORDS,
  ADD_ACTION,
  UPDATE_ACTION,
  DELETE_ACTION,
} from '../App/constants';

import {
  makeSelectAgent,
  makeSelectAction,
  makeSelectCurrentAction,
  makeSelectActionWebhook,
  makeSelectActionPostFormat,
  makeSelectSayingForAction,
} from '../App/selectors';

import { getKeywords } from '../KeywordsPage/saga';
import { putSaying } from '../SayingsPage/saga';

export function* getActions(payload) {
  const agent = yield select(makeSelectAgent());
  const { api } = payload;
  try {
    const response = yield call(api.agent.getAgentAgentidAction, {
      agentId: agent.id,
    });
    yield put(loadActionsSuccess({actions: response.obj.data, total: response.obj.totalCount}));
  } catch (err) {
    yield put(loadActionsError(err));
  }
}

export function* getAction(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, actionId } = payload;
  try {
    let response = yield call(api.agent.getAgentAgentidActionActionid, { agentId: agent.id, actionId });
    const action = response.obj;
    let webhook, postFormat;
    if (action.useWebhook){
      response = yield call(api.agent.getAgentAgentidActionActionidWebhook, { agentId: agent.id, actionId });
      webhook = response.obj;
    }
    if (action.usePostFormat){
      response = yield call(api.agent.getAgentAgentidActionActionidPostformat, { agentId: agent.id, actionId });
      postFormat = response.obj;
    }
    yield put(loadActionSuccess({ action, webhook, postFormat }));
  } catch (err) {
    yield put(loadActionError(err));
  }
}

function* postActionWebhook(payload) {
  const actionWebhook = yield select(makeSelectActionWebhook());
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(api.agent.postAgentAgentidActionActionidWebhook, { agentId: agent.id, actionId: id, body: actionWebhook });
  } catch (err) {
    throw err;
  }
}

function* postActionPostFormat(payload) {
  const actionPostFormat = yield select(makeSelectActionPostFormat());
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(api.agent.postAgentAgentidActionActionidPostformat, { agentId: agent.id, actionId: id, body: actionPostFormat });
  } catch (err) {
    throw err;
  }
}

function* putActionWebhook(payload) {
  const actionWebhook = yield select(makeSelectActionWebhook());
  const agent = yield select(makeSelectAgent());
  const mutableActionWebhook = Immutable.asMutable(actionWebhook, { deep: true });
  const { api, id } = payload;
  if (mutableActionWebhook.id){ // TODO: Check why webhook have an id
    delete mutableActionWebhook.id;
  }
  try {
    yield call(api.agent.putAgentAgentidActionActionidWebhook, { agentId: agent.id, actionId: id, body: mutableActionWebhook });
  } catch (err) {
    throw err;
  }
}

function* putActionPostFormat(payload) {
  const actionPostFormat = yield select(makeSelectActionPostFormat());
  const agent = yield select(makeSelectAgent());
  const mutablePostFormat = Immutable.asMutable(actionPostFormat);
  const { api, id } = payload;
  if (mutablePostFormat.id){ // TODO: Check why post format have an id
    delete mutablePostFormat.id;
  }
  try {
    yield call(api.agent.putAgentAgentidActionActionidPostformat, { agentId: agent.id, actionId: id, body: mutablePostFormat });
  } catch (err) {
    throw err;
  }
}

function* deleteActionWebhook(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentAgentidActionActionidWebhook, { agentId: agent.id, actionId: id });
  } catch (err) {
    throw err;
  }
}

function* deleteActionPostFormat(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentAgentidActionActionidPostformat, { agentId: agent.id, actionId: id });
  } catch (err) {
    throw err;
  }
}

export function* postAction(payload) {
  const action = yield select(makeSelectAction());
  const agent = yield select(makeSelectAgent());
  const mutableAction = Immutable.asMutable(action, {deep: true});
  delete mutableAction.agent;
  const { api, addToNewSayingActions } = payload;
  try {
    const response = yield call(api.agent.postAgentAgentidAction, { agentId: agent.id ,body: mutableAction });
    if (action.useWebhook){
      yield call(postActionWebhook, { id: response.obj.id, api });
    }
    if (action.usePostFormat){
      yield call(postActionPostFormat, { id: response.obj.id, api });
    }
    const sayingForAction = yield select(makeSelectSayingForAction());
    const mutableSayingForAction = Immutable.asMutable(sayingForAction, {deep: true});
    mutableSayingForAction.actions.push(response.obj.actionName);
    const updateSayingPayload = { api, sayingId: sayingForAction.id, saying: mutableSayingForAction };
    yield call(putSaying, updateSayingPayload);
    yield put(addActionSuccess({ action: response.obj, addToNewSayingActions }));
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
    const response = yield call(api.agent.putAgentAgentidActionActionid, { agentId: agent.id, actionId: currentAction.id, body: mutableAction });
    if (!currentAction.useWebhook){
      if (action.useWebhook) {
        yield call(postActionWebhook, { id: currentAction.id, api });
      }
    }
    else if (currentAction.useWebhook){
      if (!action.useWebhook){
        yield call(deleteActionWebhook, { id: currentAction.id, api });
      }
      else {
        yield call(putActionWebhook, { id: currentAction.id, api });
      }
    }
    if (!currentAction.usePostFormat){
      if (action.usePostFormat) {
        yield call(postActionPostFormat, { id: currentAction.id, api });
      }
    }
    else if (currentAction.usePostFormat){
      if (!action.usePostFormat){
        yield call(deleteActionPostFormat, { id: currentAction.id, api });
      }
      else {
        yield call(putActionPostFormat, { id: currentAction.id, api });
      }
    }
    yield put(updateActionSuccess(response.obj));
  } catch (err) {
    yield put(updateActionError(err));
  }
}

export function* deleteAction(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentAgentidActionActionid, { agentId: agent.id, actionId: id });
    yield put(deleteActionSuccess());
    yield put(push(`/agent/${agent.id}/sayings`))
  } catch (err) {
    const error = { ...err };
    yield put(deleteActionError(error.response.body.message));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_ACTION, getAction);
  yield takeLatest(LOAD_ACTIONS, getActions);
  yield takeLatest(LOAD_KEYWORDS, getKeywords);
  yield takeLatest(ADD_ACTION, postAction);
  yield takeLatest(UPDATE_ACTION, putAction);
  yield takeLatest(DELETE_ACTION, deleteAction);
};