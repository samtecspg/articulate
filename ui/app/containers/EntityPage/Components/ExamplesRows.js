import React from 'react';
import Example from './Example';
import Synonyms from './Synonyms';
import NewExampleRow from './NewExampleRow';
import Chip from 'components/Chip';
import NewSynonymInput from './NewSynonymInput';

export function ExamplesRows(props) {

    const rows = props.examples.map( (example, exampleIndex) => {
        return (
            <tr style={{width: '100%'}} key={exampleIndex} >
                <td style={{width: '30%', display: 'inline-block'}}>
                    <Example removeExampleFunction={props.removeExampleFunction} example={example} />
                </td>
                <Synonyms removeSynonymFunction={props.removeSynonymFunction} addSynonymFunction={props.addSynonymFunction} example={example} />
            </tr>
        )
    });
    rows.push(<NewExampleRow key="newExample" addExampleFunction={props.addExampleFunction} />);
  
    return (
        <tbody>
            {rows}
        </tbody>        
    );
}

ExamplesRows.propTypes = {
    examples: React.PropTypes.array,
    addExampleFunction: React.PropTypes.func,
    removeExampleFunction: React.PropTypes.func,
    addSynonymFunction: React.PropTypes.func,
    removeSynonymFunction: React.PropTypes.func,
};

export default ExamplesRows;
