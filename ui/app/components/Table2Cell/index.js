/**
 *
 * Table2Cell
 *
 */

import React from 'react';
import CheckBoxCell from './types/CheckBoxCell';
import ColorCell from './types/ColorCell';
import LinkCell from './types/LinkCell';
import ListCell from './types/ListCell';
import ProgressCell from './types/ProgressCell';
import StringCell from './types/StringCell';

class Table2Cell extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { type, value, onCellChange } = this.props;

    switch (type) {
      case 'string':
        return <StringCell value={value} className={'cell-string'} />;
      case 'number':
        return <StringCell value={value} className={'cell-string center-align'} />;
      case 'checkbox':
        return <CheckBoxCell value={value} className={'cell-check-box'} onChange={onCellChange} />;
      case 'progress':
        return <ProgressCell value={value} className={'cell-progress-bar'} />;
      case 'list':
        return <ListCell value={value} className={'cell-list'} />;
      case 'color':
        return <ColorCell value={value} className={'cell-color'} />;
      case 'link':
        return <LinkCell label={value.label} path={value.path} className={'cell-link'} />;
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
