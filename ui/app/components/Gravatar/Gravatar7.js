import React from 'react';
import PropTypes from 'prop-types';

function Gravatar7(props) {

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
        }} d="M2.41,8.93A7.85,7.85,0,0,1,10,.83a7.85,7.85,0,0,1,7.59,8.1c0,4.48-3.4,10.24-7.59,10.24S2.41,13.41,2.41,8.93Z" />
      <circle style={{
          fill: color,
        }} cx="7.01" cy="9.12" r="1.32" />
      <circle style={{
          fill: color,
        }} cx="12.99" cy="9.12" r="1.32" />
      <path style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} d="M2.48,5.79h0a.92.92,0,0,0-.92.91v4.83a.92.92,0,0,0,.92.92h0" />
      <path style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} d="M17.59,5.79h0a.92.92,0,0,1,.92.91v4.83a.92.92,0,0,1-.92.92h0" />
      <polyline style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px'
        }} points="5.31 2.56 10 6.12 14.69 2.56" />
    </svg>
  );
}

Gravatar7.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar7.defaultProps = {
  title: '',
  color: '#4e4e4e'
}

export default Gravatar7;