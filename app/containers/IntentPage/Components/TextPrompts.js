import React from 'react';
import Synonym from './Synonym';
import NewSynonymInput from './NewSynonymInput';

export function Synonyms(props) {

    const rows = props.slot.textPrompts.map( (textPrompt, indexTextPrompt) => {
        return (
            <TextPrompt key={indexTextPrompt} onDeleteTextPrompt={props.onDeleteTextPrompt} slot={props.slot} textPrompt={textPrompt} />
        )
    });

    rows.push(
        <NewTextPromptInput
            key = {props.example.value + '_newSynonym'}
            example={props.example}
            addSynonymFunction={props.addSynonymFunction}
        />
    );
  
    return (
        <td style={{width: '70%', display: 'inline-block'}}>
            {rows}
        </td>
    )
}

Synonyms.propTypes = {
    example: React.PropTypes.object,
    removeSynonymFunction: React.PropTypes.func,
    addSynonymFunction: React.PropTypes.func,
};

export default Synonyms;
