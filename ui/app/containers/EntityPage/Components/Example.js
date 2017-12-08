import Chip from 'components/Chip';
import React from 'react';

export function Example(props) {
  return (
    <Chip onClose={props.removeExampleFunction.bind(null, props.example.value)} id={props.example.value} close={true}>
      {props.example.value}
    </Chip>
  );
}

Example.propTypes = {
  example: React.PropTypes.object,
  removeExampleFunction: React.PropTypes.func,
};

export default Example;
