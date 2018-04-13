import React from 'react';
import NewTextPromptInput from './NewTextPromptInput';
import TextPrompt from './TextPrompt';

export function TextPrompts(props) {
  const newTextPromptInput = <NewTextPromptInput
    key={props.slot.slotName + '_newTextPrompt'}
    slot={props.slot}
    onAddTextPrompt={props.onAddTextPrompt}
  />;
  const rows = props.slot.textPrompts.map((textPrompt, indexTextPrompt) => {
    return (
      <TextPrompt key={indexTextPrompt} onDeleteTextPrompt={props.onDeleteTextPrompt} slot={props.slot} textPrompt={textPrompt} />
    );
  });

  return (
    <td style={{ width: '40%', display: 'inline-block' }}>
      {rows.concat(newTextPromptInput)}
    </td>
  );
}

TextPrompts.propTypes = {
  slot: React.PropTypes.object,
  onDeleteTextPrompt: React.PropTypes.func,
  onAddTextPrompt: React.PropTypes.func,
};

export default TextPrompts;
