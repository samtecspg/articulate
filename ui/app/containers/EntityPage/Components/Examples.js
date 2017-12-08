import React from 'react';
import ExamplesRows from './ExamplesRows';

export function Examples(props) {

  return <ExamplesRows
    examples={props.examples}
    addExampleFunction={props.addExampleFunction}
    removeExampleFunction={props.removeExampleFunction}
    addSynonymFunction={props.addSynonymFunction}
    removeSynonymFunction={props.removeSynonymFunction}
  />;
}

Examples.propTypes = {
  examples: React.PropTypes.array,
  removeExampleFunction: React.PropTypes.func,
  addExampleFunction: React.PropTypes.func,
  removeSynonymFunction: React.PropTypes.func,
  addSynonymFunction: React.PropTypes.func,
};

export default Examples;
