import React from 'react';
import PropTypes from 'prop-types';

function Gravatar17(props) {

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
        }} x="1.17" y="4.01" width="17.67" height="12.45" rx="6.23" />
      <circle style={{
          fill: 'none',
          stroke: color,
	        strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} cx="6.24" cy="10.23" r="0.79" />
      <circle style={{
          fill: 'none',
          stroke: color,
	        strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} cx="13.78" cy="10.23" r="0.79" />
      <line style={{
          fill: 'none',
          stroke: color,
	        strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} x1="6.24" y1="10.23" x2="13.78" y2="10.23" />
    </svg>
  );
}

Gravatar17.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar17.defaultProps = {
  title: '',
  color: '#4e4e4e'
}

export default Gravatar17;