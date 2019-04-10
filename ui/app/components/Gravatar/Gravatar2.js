import React from 'react';
import PropTypes from 'prop-types';

function Gravatar2(props) {

  const { title, color, ...rest} = props;

  return (
    <svg {...rest} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <title>{title}</title>
      <path style={{
        strokeMiterlimit: 10,
        fill: 'none',
        stroke: color
      }} d="M8.39,10.39a1.54,1.54,0,1,0-2.91-1" />
      <path style={{
        strokeMiterlimit: 10,
        fill: 'none',
        stroke: color        
      }} d="M13.88,12.23a1.54,1.54,0,1,0-2.91-1" />
      <line style={{
        fill: '#fff',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '1.5px'        
      }} x1="17.14" y1="4.01" x2="16.26" y2="6.62" />
      <rect style={{
        fill: 'none',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '1.5px'        
      }} x="2.14" y="4.74" width="14.95" height="12.65" rx="1.69" transform="translate(4.02 -2.48) rotate(18.54)" />
      <circle style={{
        fill: 'none',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '1.5px'
      }} cx="17.63" cy="2.55" r="1.54" />
    </svg>
  );
}

Gravatar2.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar2.defaultProps = {
  title: '',
  color: '#4e4e4e'
}

export default Gravatar2;