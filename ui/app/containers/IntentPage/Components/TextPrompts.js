import React from 'react';
import TextPrompt from './TextPrompt';
import NewTextPromptInput from './NewTextPromptInput';

export function TextPrompts(props) {

    const rows = props.slot.textPrompts.map( (textPrompt, indexTextPrompt) => {
        return (
            <TextPrompt key={indexTextPrompt} onDeleteTextPrompt={props.onDeleteTextPrompt} slot={props.slot} textPrompt={textPrompt} />
        )
    });

    rows.push(
        <NewTextPromptInput
            key = {props.slot.slotName + '_newTextPrompt'}
            slot={props.slot}
            onAddTextPrompt={props.onAddTextPrompt}
        />
    );
  
    return (
        <td style={{width: '35%', display: 'inline-block'}}>
            {
              rows
            }
        </td>
    )
}

TextPrompts.propTypes = {
    slot: React.PropTypes.object,
    onDeleteTextPrompt: React.PropTypes.func,
    onAddTextPrompt: React.PropTypes.func,
};

export default TextPrompts;
