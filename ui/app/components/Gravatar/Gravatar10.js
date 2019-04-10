import React from 'react';
import PropTypes from 'prop-types';

function Gravatar10(props) {

  const { title, color, ...rest} = props;

  return (
    <svg {...rest} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <title>{title}</title>
      <rect style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} x="5.22" y="0.85" width="9.57" height="18.28" rx="1.58" />
      <rect style={{
          fill: color,
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} x="8.77" y="6.26" width="2.45" height="6.91" />
      <circle style={{
          fill: '#fff',
        }} cx="10" cy="9.72" r="0.97" />
    </svg>
  );
}

Gravatar10.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar10.defaultProps = {
  title: '',
  color: '#4e4e4e'
}

export default Gravatar10;