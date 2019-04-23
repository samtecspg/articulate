import { takeLatest, call, put } from 'redux-saga/effects';
import { putSetting } from '../../containers/SettingsPage/saga';
import { UPDATE_SETTING } from '../../containers/App/constants';

export function* getAgents(payload) {
  const { api } = payload;

  try {
    const response = yield call(api.agent.getAgent, {});
    yield put(loadAgentsSuccess(response.obj));
  } catch (err) {
    yield put(loadAgentsError(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(UPDATE_SETTING, putSetting);
};
