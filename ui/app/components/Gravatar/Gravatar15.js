import React from 'react';
import PropTypes from 'prop-types';

function Gravatar15(props) {

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
        }} x="1.59" y="3.54" width="16.83" height="9.35" rx="4.67" />
      <circle style={{
          fill: color
        }} cx="6.71" cy="8.22" r="1.34" />
      <circle style={{
          fill: color
        }} cx="13.29" cy="8.22" r="1.34" />
      <line style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} x1="10" y1="3.54" x2="10" y2="1" />
      <line style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} x1="10" y1="12.89" x2="10" y2="15.63" />
      <path style={{
          fill: 'none',
          stroke: color,
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} d="M16.1,20V17.74A2.11,2.11,0,0,0,14,15.63H6.06A2.11,2.11,0,0,0,4,17.74V20" />
    </svg>
  );
}

Gravatar15.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar15.defaultProps = {
  title: '',
  color: '#4e4e4e'
}

export default Gravatar15;