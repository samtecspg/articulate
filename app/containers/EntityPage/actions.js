import {
  CHANGE_ENTITY_DATA,
  ADD_EXAMPLE,
  ADD_SYNONYM,
} from './constants';

export function changeEntityData(payload) {
  return {
    type: CHANGE_ENTITY_DATA,
    payload,
  };
}

export function addExample(payload) {
  return {
    type: ADD_EXAMPLE,
    payload,
  };
}

export function addSynonym(payload) {
  return {
    type: ADD_SYNONYM,
    payload,
  };
}

