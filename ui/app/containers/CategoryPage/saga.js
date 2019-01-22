import Immutable from 'seamless-immutable';
import {
  push
} from 'react-router-redux';
import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';

import {
  loadCategorySuccess,
  loadCategoryError,
  createCategorySuccess,
  createCategoryError,
  updateCategorySuccess,
  updateCategoryError,
  deleteCategorySuccess,
  deleteCategoryError,
} from '../App/actions';

import {
  LOAD_CATEGORY,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from '../App/constants';

import {
  makeSelectAgent, makeSelectCategory,
} from '../App/selectors';
import { getCategories } from '../SayingsPage/saga';

export function* getCategory(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    const response = yield call(api.agent.getAgentAgentidCategoryCategoryid, {
      agentId: agent.id, categoryId: id,
    });
    response.obj.actionThreshold = response.obj.actionThreshold * 100;
    yield put(loadCategorySuccess(response.obj));
  } catch (err) {
    yield put(loadCategoryError(err));
  }
}

export function* postCategory(payload) {
  const agent = yield select(makeSelectAgent());
  const category = yield select(makeSelectCategory());
  const newCategory = Immutable.asMutable(category, { deep: true });
  newCategory.actionThreshold /= 100;
  const { api } = payload;
  try {
    const response = yield call(api.agent.postAgentAgentidCategory, { 
      agentId: agent.id,
      body: newCategory,
    });
    yield put(createCategorySuccess(response.obj));
  } catch (err) {
    yield put(createCategoryError(err));
  }
}

export function* putCategory(payload) {
  const agent = yield select(makeSelectAgent());
  const category = yield select(makeSelectCategory());
  const mutableCategory = Immutable.asMutable(category, { deep: true });
  const categoryId = category.id;
  const { api } = payload;
  delete mutableCategory.id;
  delete mutableCategory.agent;
  mutableCategory.actionThreshold /= 100;
  try {
    const response = yield call(api.agent.putAgentAgentidCategoryCategoryid, { agentId: agent.id, categoryId, body: mutableCategory });
    yield put(updateCategorySuccess(response.obj));
  } catch (err) {
    yield put(updateCategoryError(err));
  }
}

export function* deleteCategory(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentAgentidCategoryCategoryid, { agentId: agent.id, categoryId: id });
    yield put(deleteCategorySuccess());
    yield put(getCategories({
      api
    }));
    yield put(push(`/agent/${agent.id}/sayings`));
  } catch (err) {
    const error = { ...err };
    yield put(deleteCategoryError(error.response.body.message));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_CATEGORY, getCategory);
  yield takeLatest(CREATE_CATEGORY, postCategory);
  yield takeLatest(UPDATE_CATEGORY, putCategory);
  yield takeLatest(DELETE_CATEGORY, deleteCategory);
};
