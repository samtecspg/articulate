/**
 *
 * Table2Cell
 *
 */

import React from 'react';
import CheckBoxCell from './types/CheckBoxCell';
import ProgressCell from './types/ProgressCell';
import StringCell from './types/StringCell';

class Table2Cell extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { type, value, onCellChange } = this.props;

    switch (type) {
      case 'string':
        return <StringCell value={value} />;
      case 'number':
        return <StringCell value={value} className={'center-align'} />;
      case 'checkbox':
        return <CheckBoxCell value={value} onChange={onCellChange} />;
      case 'progress':
        return <ProgressCell value={value} />;
      default:
        return <div>invalid type=[{type}]</div>;
    }
  }
}

Table2Cell.propTypes = {
  type: React.PropTypes.string.isRequired,
  value: React.PropTypes.any.isRequired,
  onCellChange: React.PropTypes.func,
};

export default Table2Cell;
