/**
 *
 * ColorCell
 *
 */

import React from 'react';

function ColorCell(props) {
  const { value, className } = props;
  return (
    <div className={'text-align-center'}>
      <div
        style={{
          backgroundColor: value,
          cursor: 'default',
        }}
        className={'btn'}
        color={value}
      />
    </div>
  );
  // return <div className={className}>{value}</div>;
}

ColorCell.propTypes = {
  value: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
};

export default ColorCell;
