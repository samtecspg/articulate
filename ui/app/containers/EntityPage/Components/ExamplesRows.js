import React from 'react';
import Example from './Example';
import NewExampleRow from './NewExampleRow';
import Synonyms from './Synonyms';

export function ExamplesRows(props) {
  const newExampleRow = <NewExampleRow key="newExample" addExampleFunction={props.addExampleFunction} />;
  const rows = props.examples.map((example, exampleIndex) => {
    return (
      <tr style={{ width: '100%' }} key={exampleIndex}>
        <td style={{ width: '30%', display: 'inline-block' }}>
          <Example removeExampleFunction={props.removeExampleFunction} example={example} />
        </td>
        <Synonyms removeSynonymFunction={props.removeSynonymFunction} addSynonymFunction={props.addSynonymFunction} example={example} />
      </tr>
    );
  });
  return (
    <tbody>
    {rows.concat(newExampleRow)}
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
