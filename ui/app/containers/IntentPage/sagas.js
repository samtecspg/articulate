import _ from 'lodash';
import Immutable from 'seamless-immutable';
import {
  LOCATION_CHANGE,
  push
} from 'react-router-redux';
import {
  call,
  cancel,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {
  intentCreated,
  intentCreationError,
  scenarioCreated,
  scenarioCreationError,
  webhookCreationError,
  updateIntentError,
  updateIntentSuccess,
  updateScenarioError,
  updateScenarioSuccess,
  updateWebhookError,
  loadCurrentAgentStatus,
} from '../App/actions';
import {
  CREATE_INTENT,
  LOAD_AGENT_DOMAINS,
  LOAD_AGENT_ENTITIES,
  LOAD_AGENTS,
  UPDATE_INTENT
} from '../App/constants';
import { getAgents } from '../App/sagas';
import { getAgentDomains } from '../DomainListPage/sagas';
import { getAgentEntities } from '../EntityListPage/sagas';
import {
  loadIntentError,
  loadIntentSuccess,
  loadScenarioError,
  loadScenarioSuccess,
  loadWebhookError,
  loadWebhookSuccess,
  loadPostFormat,
  loadPostFormatError,
  loadPostFormatSuccess,
  loadSysEntitiesSucess
} from './actions';
import {
  LOAD_INTENT,
  LOAD_SCENARIO,
  LOAD_WEBHOOK,
  LOAD_POSTFORMAT,
  LOAD_INTENT_SUCCESS,
  FIND_SYS_ENTITES
} from './constants';
import {
  makeSelectIntentData,
  makeSelectOldIntentData,
  makeSelectScenarioData,
  makeSelectOldScenarioData,
  makeSelectWebhookData,
  makeSelectOldWebhookData,
  makeSelectPostFormatData,
} from './selectors';
import { SIGSYS } from 'constants';

function* postWebhook(payload) {
  const { api, id, intentData } = payload;
  let webhookData = yield select(makeSelectWebhookData());
  if (intentData) {
    webhookData = webhookData.set('agent', intentData.agent);
    webhookData = webhookData.set('domain', intentData.domain);
    webhookData = webhookData.set('intent', intentData.intentName);
  }

  try {
    yield call(api.intent.postIntentIdWebhook, { id, body: webhookData });
  } catch ({ response }) {
    yield put(webhookCreationError({ message: response.obj.message }));
    throw response;
  }
}

function* postPostFormat(payload) {
  const { api, id, intentData } = payload;
  let postFormatData = yield select(makeSelectPostFormatData());
  if (intentData) {
    postFormatData = postFormatData.set('agent', intentData.agent);
    postFormatData = postFormatData.set('domain', intentData.domain);
    postFormatData = postFormatData.set('intent', intentData.intentName);
  }

  try {
    yield call(api.intent.postIntentIdPostformat, { id, body: postFormatData });
  } catch ({ response }) {
    yield put(webhookCreationError({ message: response.obj.message }));
    throw response;
  }
}


function* postScenario(payload) {
  const { api, id, intentData } = payload;
  let scenarioData = yield select(makeSelectScenarioData());
  if (intentData) {
    scenarioData = scenarioData.set('agent', intentData.agent);
    scenarioData = scenarioData.set('domain', intentData.domain);
    scenarioData = scenarioData.set('intent', intentData.intentName);
    scenarioData = scenarioData.set('scenarioName', intentData.intentName);
  }

  try {
    const response = yield call(api.intent.postIntentIdScenario, { id, body: scenarioData });
    const scenario = response.obj;
    yield put(scenarioCreated(scenario, scenario.id));
  } catch ({ response }) {
    yield put(scenarioCreationError({ message: response.obj.message }));
    throw response;
  }
}

export function* postIntent(payload) {
  const { api } = payload;
  let intentData = yield select(makeSelectIntentData());
  intentData = Immutable.asMutable(intentData, { deep: true });

  try {
    const response = yield call(api.intent.postIntent, { body: intentData });
    const intent = response.obj;
    yield put(intentCreated(intent, intent.id));
    yield call(postScenario, { api, id: intent.id });
    if (intent.useWebhook) {
      yield call(postWebhook, { api, id: intent.id });
    }
    if (intent.usePostFormat) {
      yield call(postPostFormat, { api, id: intent.id, intentData });
    }
    yield put(push('/intents'));
  } catch ({ response }) {
    yield put(intentCreationError({ message: response.obj.message }));
  }
}

export function* createIntent() {
  const watcher = yield takeLatest(CREATE_INTENT, postIntent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadAgents() {
  const watcher = yield takeLatest(LOAD_AGENTS, getAgents);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadAgentDomains() {
  const watcher = yield takeLatest(LOAD_AGENT_DOMAINS, getAgentDomains);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadAgentEntities() {
  const watcher = yield takeLatest(LOAD_AGENT_ENTITIES, getAgentEntities);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* putWebhook(payload) {
  const { api, id } = payload;
  const webhookData = yield select(makeSelectWebhookData());
  const oldWebhookData = yield select(makeSelectOldWebhookData());
  try {
    if (!_.isEqual(webhookData, oldWebhookData)) {
      const { agent, domain, intent, ...data } = webhookData;
      delete data.id;
      yield call(api.intent.putIntentIdWebhook, { id, body: data });
    }
  } catch ({ response }) {
    yield put(updateWebhookError({ message: response.obj.message }));
    throw response;
  }
}

function* deleteWebhook(payload) {
  const { api, id } = payload;
  try {
    yield call(api.intent.deleteIntentIdWebhook, { id });
  } catch ({ response }) {
    yield put(updateWebhookError({ message: response.obj.message }));
    throw response;
  }
}

function* putPostFormat(payload) {
  const { api, id } = payload;
  const postFormatData = yield select(makeSelectPostFormatData());
  try {
    const { agent, domain, intent, ...data } = postFormatData;
    delete data.id;
    yield call(api.intent.putIntentIdPostformat, { id, body: data });
  } catch ({ response }) {
    yield put(updateWebhookError({ message: response.obj.message }));
    throw response;
  }
}

function* deletePostFormat(payload) {
  const { api, id } = payload;
  try {
    yield call(api.intent.deleteIntentIdPostformat, { id });
  } catch ({ response }) {
    yield put(updateWebhookError({ message: response.obj.message }));
    throw response;
  }
}

function* putScenario(payload) {
  const { api, id } = payload;
  const scenarioData = yield select(makeSelectScenarioData());
  const oldScenarioData = yield select(makeSelectOldScenarioData());
  try {
    if (!_.isEqual(scenarioData, oldScenarioData)) {
      const { agent, domain, intent, ...data } = scenarioData;
      delete data.id;
      yield call(api.intent.putIntentIdScenario, { id, body: data });
    }
    yield put(updateScenarioSuccess());
  } catch ({ response }) {
    yield put(updateScenarioError({ message: response.obj.message }));
    throw response;
  }
}

export function* putIntent(payload) {
  const { api } = payload;
  let intentData = yield select(makeSelectIntentData());
  intentData = Immutable.asMutable(intentData, { deep: true });
  const oldIntentData = yield select(makeSelectOldIntentData());
  const oldScenarioData = yield select(makeSelectOldScenarioData());
  try {
    if (!_.isEqual(intentData, oldIntentData)) {
      const { id, agent, domain, ...data } = intentData;
      const response = yield call(api.intent.putIntentId, { id, body: data });
      yield call(loadCurrentAgentStatus, {id: agent.id});
    }
    yield put(updateIntentSuccess());
    if (oldScenarioData) {
      yield call(putScenario, { api, id: intentData.id });
    }
    else {
      yield call(postScenario, { api, id: intentData.id, intentData });
    }
    if (oldIntentData.useWebhook) {
      if (intentData.useWebhook) {
        yield call(putWebhook, { api, id: intentData.id });
      }
      else {
        yield call(deleteWebhook, { api, id: intentData.id });
      }
    }
    else {
      if (intentData.useWebhook) {
        yield call(postWebhook, { api, id: intentData.id, intentData });
      }
    }
    if (oldIntentData.usePostFormat) {
      if (intentData.usePostFormat) {
        yield call(putPostFormat, { api, id: intentData.id });
      }
      else {
        yield call(deletePostFormat, { api, id: intentData.id });
      }
    }
    else {
      if (intentData.usePostFormat) {
        yield call(postPostFormat, { api, id: intentData.id, intentData });
      }
    }


    yield put(push('/intents'));
  } catch (err) {
    console.log(err)
    const errObject = { err };
    if (errObject.err && errObject.err.message === 'Failed to fetch') {
      yield put(updateIntentError({ message: 'Can\'t find a connection with the API. Please check your API is alive and configured properly.' }));
    }
    else {
      if (errObject.err.response.obj && errObject.err.response.obj.message) {
        yield put(updateIntentError({ message: errObject.err.response.obj.message }));
      }
      else {
        yield put(updateIntentError({ message: 'Unknow API error' }));
      }
    }
  }
}

export function* updateIntent() {
  const watcher = yield takeLatest(UPDATE_INTENT, putIntent);
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getIntent(payload) {
  const { api, id } = payload;
  try {
    const responseIntent = yield call(api.intent.getIntentId, { id });
    const intent = responseIntent.obj;
    const responseAgent = yield call(api.agent.getAgentNameAgentname, { agentName: intent.agent });
    const agent = responseAgent.obj;
    yield call(getAgentDomains, { api, agentId: agent.id });
    yield call(getAgentEntities, { api, agentId: agent.id, forIntentEdit: true });
    yield put(loadIntentSuccess(intent));
    // yield put(loadWebhook(id));
    // yield put(loadPostFormat(id));
  } catch ({ response }) {
    yield put(loadIntentError({ message: response.obj.message }));
  }
}

export function* loadIntent() {
  const watcher = yield takeLatest(LOAD_INTENT, getIntent);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getScenario(payload) {
  const { api, id } = payload;
  try {
    const responseScenario = yield call(api.intent.getIntentIdScenario, { id });
    const scenario = responseScenario.obj;
    yield put(loadScenarioSuccess(scenario));
  } catch ({ response }) {
    yield put(loadScenarioError({ message: response.obj.message }));
  }
}

export function* loadScenario() {
  const watcher = yield takeLatest(LOAD_SCENARIO, getScenario);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getWebhook(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.intent.getIntentIdWebhook, { id });
    const webhook = response.obj;
    yield put(loadWebhookSuccess(webhook));
  } catch ({ response }) {
    yield put(loadWebhookError({ message: response.obj.message }));
  }
}
export function* getPostFormat(payload) {
  const { api, id } = payload;
  try {
    const response = yield call(api.intent.getIntentIdPostformat, { id });
    const postFormat = response.obj;
    yield put(loadPostFormatSuccess(postFormat));
  } catch ({ response }) {
    yield put(loadPostFormatError({ message: response.obj.message }));
  }
}


export function* getSysEntities(payload) {
  const { api, id } = payload;
  try {
    const scenario = yield select(makeSelectScenarioData());
    let foundSysEntities = [];

    scenario.slots.forEach(slot => {
      if (slot.entity !== null && slot.entity.indexOf('sys.') > -1) {
        foundSysEntities.push(slot.entity);
      }

    });

    let intentData = yield select(makeSelectIntentData());
    intentData = Immutable.asMutable(intentData, { deep: true });

    for (var i = 0; i < intentData.examples.length; i++) {
      intentData.examples[i].entities = intentData.examples[i].entities.filter((ent) => {
        return ent.entity.indexOf('sys.') < 0; //get rid of old sys entities found
      });

      if (foundSysEntities.length > 0) {
        let example = intentData.examples[i];
        const parseResult = yield call(api.agent.getAgentIdParse, { id: id, text: example.userSays, timezone: '' })
        let results = parseResult.obj.result.results;
        results.forEach((result) => {

          let entitiesFound = result.entities;
          entitiesFound.forEach((entity) => {

            if (foundSysEntities.indexOf(entity.entity) > -1) {

              intentData.examples[i].entities = [...intentData.examples[i].entities, { value: entity.value.value || entity.value.values[0].value, entity: entity.entity, start: entity.start, end: entity.end, extractor: 'system', entityId: 0 }];

            }
          })
        })
      }
    }
    yield put(loadSysEntitiesSucess(intentData));

  } catch (error) {
    console.log(error);
  }
}

export function* loadWebhook() {
  const watcher = yield takeLatest(LOAD_WEBHOOK, getWebhook);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadPostFormatSaga() {
  const watcher = yield takeLatest(LOAD_POSTFORMAT, getPostFormat);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* findSysEntitiesSaga() {
  const watcher = yield takeLatest(FIND_SYS_ENTITES, getSysEntities);

}
// Bootstrap sagas
export default [
  createIntent,
  loadAgents,
  loadAgentDomains,
  loadAgentEntities,
  updateIntent,
  loadIntent,
  loadScenario,
  loadWebhook,
  loadPostFormatSaga,
  findSysEntitiesSaga,
];
