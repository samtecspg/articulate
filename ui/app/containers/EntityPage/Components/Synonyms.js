import React from 'react';
import NewSynonymInput from './NewSynonymInput';
import Synonym from './Synonym';

export function Synonyms(props) {
  const newSynonymInput = <NewSynonymInput
    key={props.example.value + '_newSynonym'}
    example={props.example}
    addSynonymFunction={props.addSynonymFunction}
  />;
  const rows = props.example.synonyms.map((synonym, indexSynonym) => {
    return (
      <Synonym key={indexSynonym} removeSynonymFunction={props.removeSynonymFunction} example={props.example} synonym={synonym} />
    );
  });
  return (
    <td style={{ width: '70%', display: 'inline-block' }}>
      {rows.concat(newSynonymInput)}
    </td>
  );
}

Synonyms.propTypes = {
  example: React.PropTypes.object,
  removeSynonymFunction: React.PropTypes.func,
  addSynonymFunction: React.PropTypes.func,
};

export default Synonyms;
