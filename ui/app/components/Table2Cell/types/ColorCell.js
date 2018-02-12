/**
 *
 * ColorCell
 *
 */

import React from 'react';

function ColorCell(props) {
  const { value, className } = props;
  return (
    <div className={className}>
      <span
        style={{
          backgroundColor: value,
        }}
        className={'circle'}
      >&nbsp;</span>
    </div>
  );
  // return <div className={className}>{value}</div>;
}

ColorCell.propTypes = {
  value: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
};
ColorCell.defaultProps = {
  className: 'center-align'
};
export default ColorCell;
