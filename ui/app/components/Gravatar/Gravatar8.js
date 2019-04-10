import React from 'react';
import PropTypes from 'prop-types';

function Gravatar8(props) {

  const { title, color, ...rest} = props;

  return (
    <svg {...rest} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <title>{title}</title>
      <path style={{
          fill: 'none',
          stroke: color,
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
      }} d="M16.53,11.5V8A6.7,6.7,0,0,0,10,1.17h0A6.7,6.7,0,0,0,3.48,8V11.5Z" />
      <circle style={{
          fill: color,
        }} cx="10.01" cy="6.16" r="1.82" />
      <circle style={{
          fill: color,
        }} cx="13.47" cy="9.25" r="0.65" />
      <polyline style={{
          fill: 'none',
          stroke: color,
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
      }} points="3.48 20 3.48 11.49 16.53 11.49 16.53 20" />
      <line style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} x1="6.28" y1="14.7" x2="13.72" y2="14.7" />
      <line style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} x1="6.28" y1="17.43" x2="13.72" y2="17.43" />
      <polyline style={{
          fill: 'none',
          stroke: color,
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
      }} points="3.48 20 3.48 11.49 0.94 11.49 0.94 20" />
      <polyline style={{
          fill: 'none',
          stroke: color,
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
      }} points="19.08 20 19.08 11.49 16.53 11.49 16.53 20" />
    </svg>
  );
}

Gravatar8.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar8.defaultProps = {
  title: '',
  color: '#4e4e4e'
}

export default Gravatar8;