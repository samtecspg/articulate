/**
 *
 * StringCell
 *
 */

import React from 'react';

function StringCell(props) {
  const { value, className } = props;
  return <div className={className}>{value}</div>;
}

StringCell.propTypes = {
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]).isRequired,
  className: React.PropTypes.string,
};

export default StringCell;
