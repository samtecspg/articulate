import React from 'react';
import Chip from 'components/Chip';



export function TextPrompt(props) {
  
    return (
        <Chip onClose={props.onDeleteTextPrompt.bind(null, props.slot.slotName, props.textPrompt)} close={true}>
            {props.textPrompt}
        </Chip>
    );
}

TextPrompt.propTypes = {
    slot: React.PropTypes.object,
    textPrompt: React.PropTypes.string,
    onDeleteTextPrompt: React.PropTypes.func,
};

export default TextPrompt;
