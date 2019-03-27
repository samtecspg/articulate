import { push } from 'react-router-redux';
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
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  createCategoryError,
  createCategorySuccess,
  deleteCategoryError,
  deleteCategorySuccess,
  loadCategoryError,
  loadCategorySuccess,
  updateCategoryError,
  updateCategorySuccess,
} from '../App/actions';
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  LOAD_CATEGORY,
  UPDATE_CATEGORY,
} from '../App/constants';
import {
  makeSelectAgent,
  makeSelectCategory,
} from '../App/selectors';
import { getCategories } from '../DialoguePage/saga';

export function* getCategory(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    const response = yield call(api.get, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CATEGORY, id]));
    response.actionThreshold *= 100;
    yield put(loadCategorySuccess(response));
  }
  catch (err) {
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
    const response = yield call(api.post, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CATEGORY]), newCategory);
    response.actionThreshold = parseInt(response.actionThreshold * 100);
    yield put(createCategorySuccess(response));
  }
  catch (err) {
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
    const response = yield call(api.put, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CATEGORY, categoryId]), mutableCategory);
    response.actionThreshold = parseInt(response.actionThreshold * 100);
    yield put(updateCategorySuccess(response));
  }
  catch (err) {
    yield put(updateCategoryError(err));
  }
}

export function* deleteCategory(payload) {
  const agent = yield select(makeSelectAgent());
  const { api, id } = payload;
  try {
    yield call(api.agent.deleteAgentAgentidCategoryCategoryid, { agentId: agent.id, categoryId: id });
    yield call(api.delete, toAPIPath([ROUTE_AGENT, agent.id, ROUTE_CATEGORY, id]));
    yield put(deleteCategorySuccess());
    yield call(getCategories, { api });
    yield put(push(`/agent/${agent.id}/dialogue?tab=sayings`));
  }
  catch (err) {
    const error = { ...err };
    yield put(deleteCategoryError(error.response.data.message));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOAD_CATEGORY, getCategory);
  yield takeLatest(CREATE_CATEGORY, postCategory);
  yield takeLatest(UPDATE_CATEGORY, putCategory);
  yield takeLatest(DELETE_CATEGORY, deleteCategory);
};
