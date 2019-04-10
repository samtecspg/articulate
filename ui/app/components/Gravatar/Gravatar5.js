import React from 'react';
import PropTypes from 'prop-types';

function Gravatar5(props) {

  const { title, color, ...rest} = props;

  return (
    <svg {...rest} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <title>{title}</title>
      <path style={{
        fill: 'none',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '1.5px'
      }} d="M12.13,6h3.23a3,3,0,0,1,3,3v6.68a3,3,0,0,1-3,3H4.64a3,3,0,0,1-3-3V9a3,3,0,0,1,3-3H10" />
      <line style={{
        fill: '#fff',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '1.5px'
      }} x1="10" y1="7.37" x2="10" y2="3.99" />
      <circle style={{
        fill: 'none',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '1.5px'
      }} cx="10" cy="2.36" r="1.56" />
      <line style={{
        fill: '#fff',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '1.5px'
      }} x1="5.75" y1="10.26" x2="10.75" y2="10.26" />
      <line style={{
        fill: '#fff',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '1.5px'
      }} x1="5.75" y1="12.84" x2="14.61" y2="12.84" />
      <line style={{
        fill: '#fff',
        stroke: color,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '1.5px'
      }} x1="5.75" y1="15.43" x2="14.61" y2="15.43" />
    </svg>
  );
}

Gravatar5.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar5.defaultProps = {
  title: '',
  color: '#4e4e4e'
}

export default Gravatar5;