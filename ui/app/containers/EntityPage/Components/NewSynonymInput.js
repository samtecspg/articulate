import TextInput from 'components/TextInput';
import React from 'react';

import messages from '../messages';

export function NewSynonymInput(props) {
  return (
    <TextInput
      placeholder={messages.synonymPlaceholder.defaultMessage}
      inputId={props.example.value + '_newSynonym'}
      onKeyDown={props.addSynonymFunction.bind(null, props.example.value)}
    />
  );
}

NewSynonymInput.propTypes = {
  addSynonymFunction: React.PropTypes.func,
  example: React.PropTypes.object,
};

export default NewSynonymInput;
