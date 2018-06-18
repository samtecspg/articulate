import TextInput from 'components/TextInput';
import React from 'react';

import messages from '../messages';

export function NewTextPromptInput(props) {
  return (
    <TextInput
      style={{ marginBottom: '0px' }}
      placeholder={messages.slotPromptPlaceholder.defaultMessage}
      inputId={props.slot.value + '_newTextPrompt'}
      onKeyDown={props.onAddTextPrompt.bind(null, props.slot.slotName)}
      disabled={!props.slot.isRequired}
    />
  );
}

NewTextPromptInput.propTypes = {
  onAddTextPrompt: React.PropTypes.func,
  slot: React.PropTypes.object,
};

export default NewTextPromptInput;
