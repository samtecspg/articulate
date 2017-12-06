import {
  ADD_EXAMPLE,
  ADD_SYNONYM,
  CHANGE_ENTITY_DATA,
  REMOVE_EXAMPLE,
  REMOVE_SYNONYM,
} from './constants';

export function changeEntityData(payload) {
  return {
    type: CHANGE_ENTITY_DATA,
    payload,
  };
}

export function removeExample(example) {
  return {
    type: REMOVE_EXAMPLE,
    example,
  };
}

export function addExample(example) {
  return {
    type: ADD_EXAMPLE,
    example,
  };
}

export function removeSynonym(payload) {
  return {
    type: REMOVE_SYNONYM,
    payload,
  };
}

export function addSynonym(payload) {
  return {
    type: ADD_SYNONYM,
    payload,
  };
}

