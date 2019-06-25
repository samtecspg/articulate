import React from 'react';
import PropTypes from 'prop-types';

function Gravatar13(props) {
  const { title, color, ...rest } = props;

  return (
    <svg
      {...rest}
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <title>{title}</title>
      <path
        style={{
          fill: 'none',
          stroke: color,
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M2.37,20V13.06a7.63,7.63,0,1,1,15.26,0V20"
      />
      <rect
        style={{
          fill: color,
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x="4.68"
        y="12.86"
        width="10.65"
        height="3.57"
        rx="1.78"
      />
      <line
        style={{
          fill: '#fff',
          stroke: color,
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="10"
        y1="5.42"
        x2="10"
        y2="2.75"
      />
      <circle
        style={{
          fill: color,
          stroke: color,
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        cx="10.01"
        cy="1.61"
        r="0.81"
      />
      <circle
        style={{
          fill: '#fff',
        }}
        cx="12.85"
        cy="14.64"
        r="1.45"
      />
      <circle
        style={{
          fill: '#fff',
        }}
        cx="7.15"
        cy="14.64"
        r="1.45"
      />
    </svg>
  );
}

Gravatar13.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar13.defaultProps = {
  title: '',
  color: '#4e4e4e',
};

export default Gravatar13;
