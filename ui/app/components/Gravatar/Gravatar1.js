import React from 'react';
import PropTypes from 'prop-types';

function Gravatar1(props) {

  const { title, color, ...rest} = props;

  return (
    <svg {...rest} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <title>{title}</title>
        <circle style={
          {
            fill: color
          }
        } cx="7.22" cy="12.69" r="1.54" />
        <circle style={
          {
            fill: color
          }
        } cx="13.01" cy="12.69" r="1.54" />
        <line style={
          {
            fill: '#fff',
            stroke: color,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '1.5px'
          }
        } x1="15.02" y1="3.85" x2="15.02" y2="6.61" />
        <rect style={
          {
            fill: 'none',
            stroke: color,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '1.5px'
          }
        } x="2.65" y="6.61" width="14.95" height="12.65" rx="1.69" />
        <circle style={
          {
            fill: 'none',
            stroke: color,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '1.5px'
          }
        } cx="15.02" cy="2.31" r="1.54" />
    </svg>
  );
}

Gravatar1.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar1.defaultProps = {
  title: '',
  color: '#4e4e4e'
}

export default Gravatar1;