import React from 'react';
import PropTypes from 'prop-types';

function Gravatar12(props) {
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
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M4.05,11.78v-3a6,6,0,0,1,11.9,0v3"
      />
      <line
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="10"
        y1="0.97"
        x2="10"
        y2="13.56"
      />
      <circle
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        cx="7.08"
        cy="9.65"
        r="0.5"
      />
      <circle
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        cx="12.94"
        cy="9.65"
        r="0.5"
      />
      <polygon
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="16.58 11.41 12.94 13.56 7.08 13.56 3.42 11.41 3.42 16.55 7.08 18.93 12.94 18.93 16.58 16.73 16.58 11.41"
      />
      <polyline
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="3.42 11.41 3.42 8.15 2.2 8.15"
      />
      <polyline
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="16.58 11.41 16.58 8.15 17.75 8.15"
      />
    </svg>
  );
}

Gravatar12.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar12.defaultProps = {
  title: '',
  color: '#4e4e4e',
};

export default Gravatar12;
