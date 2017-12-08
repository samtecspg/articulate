import {
  ADD_TEXT_PROMPT,
  CHANGE_INTENT_DATA,
  CHANGE_SLOT_NAME,
  DELETE_TEXT_PROMPT,
  TAG_ENTITY,
  TOGGLE_FLAG,
  UNTAG_ENTITY,
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

export function changeSlotName(payload) {
  return {
    type: CHANGE_SLOT_NAME,
    payload,
  };
}

export function addTextPrompt(payload) {
  return {
    type: ADD_TEXT_PROMPT,
    payload,
  };
}

export function deleteTextPrompt(payload) {
  return {
    type: DELETE_TEXT_PROMPT,
    payload,
  };
}
