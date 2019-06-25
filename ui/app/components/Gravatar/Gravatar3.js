import React from 'react';
import PropTypes from 'prop-types';

function Gravatar3(props) {
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
          fill: color,
        }}
        d="M8.62,12.69a1.54,1.54,0,1,0-3.07,0"
      />
      <path
        style={{
          fill: color,
        }}
        d="M14.42,12.69a1.54,1.54,0,0,0-3.08,0"
      />
      <line
        style={{
          fill: '#fff',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="10"
        y1="3.85"
        x2="10"
        y2="6.61"
      />
      <rect
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x="2.52"
        y="6.61"
        width="14.95"
        height="12.65"
        rx="1.69"
      />
      <circle
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        cx="10"
        cy="2.31"
        r="1.54"
      />
    </svg>
  );
}

Gravatar3.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar3.defaultProps = {
  title: '',
  color: '#4e4e4e',
};

export default Gravatar3;
