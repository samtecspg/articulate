import Chip from 'components/Chip';
import React from 'react';

export function Synonym(props) {

  return (
    <Chip onClose={props.removeSynonymFunction.bind(null, props.example.value, props.synonym)} id={props.example.value + '_' + props.synonym} close={true}>
      {props.synonym}
    </Chip>
  );
}

Synonym.propTypes = {
  example: React.PropTypes.object,
  synonym: React.PropTypes.string,
  removeSynonymFunction: React.PropTypes.func,
};

export default Synonym;
