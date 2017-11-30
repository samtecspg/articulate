/**
 *
 * ProgressCell
 *
 */

import React from 'react';

function ProgressCell(props) {
  const { value } = props;
  const color = () => {
    if (value > 66) return 'green';
    else if (value > 33) return 'yellow';
    return 'red';
  };
  return (<div
    title={`${value}%`}
    style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#dadada',
      borderRadius: '2px',
    }}
  >
    <div
      className={color()}

      style={{
        width: `${value}%`,
        height: '100%',
        borderRadius: '2px',
        transition: 'all .2s ease-out',
      }}
    />
  </div>);
}

ProgressCell.propTypes = {
  value: React.PropTypes.number.isRequired,
};

export default ProgressCell;
