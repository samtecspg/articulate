/**
 *
 * StringCell
 *
 */

import _ from 'lodash';
import React from 'react';

function ListCell(props) {
  const { value, className } = props;
  const cell = _.isArray(value) ? value.join(', ') : value;
  return <div title={cell} className={className}>{cell}</div>;
}

ListCell.propTypes = {
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),
  className: React.PropTypes.string,
};

ListCell.defaultProps = {
  className: '',
};
export default ListCell;
