import {
  CHANGE_INTENT_DATA,
  TAG_ENTITY,
  UNTAG_ENTITY,
  TOGGLE_FLAG,
  ADD_TEXT_PROMPT,
  DELETE_TEXT_PROMPT,
} from './constants';

export function changeIntentData(payload) {
  return {
    type: CHANGE_INTENT_DATA,
    payload,
  };
}

export function untagEntity(example) {
  return {
    type: UNTAG_ENTITY,
    example,
  };
}

export function tagEntity(payload) {
  return {
    type: TAG_ENTITY,
    payload,
  };
}

export function toggleFlag(payload) {
  return {
    type: TOGGLE_FLAG,
    payload,
  };
}

export function addTextPrompt(payload) {
  return {
    type: ADD_TEXT_PROMPT,
    payload,
  }
}

export function deleteTextPrompt(payload){
  return {
    type: DELETE_TEXT_PROMPT,
    payload,
  }
}
