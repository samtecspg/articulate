import React from 'react';
import PropTypes from 'prop-types';

function Gravatar16(props) {
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
        d="M11,2.88c3.19.58,5.63,3.88,5.63,7.88,0,4.4-3,8-6.61,8s-6.6-3.56-6.6-8c0-3.93,2.36-7.19,5.46-7.84"
      />
      <polyline
        style={{
          fill: 'none',
          stroke: color,
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="3.63 7.98 1.35 8.43 1.35 12.66 3.4 13.11"
      />
      <polyline
        style={{
          fill: 'none',
          stroke: color,
          strokeMiterlimit: 10,
        }}
        points="16.38 7.98 18.66 8.43 18.66 12.66 16.61 13.11"
      />
      <path
        style={{
          fill: 'none',
          stroke: color,
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M3.53,12.35S3.19,10,6.77,10A3.47,3.47,0,0,1,10,12.1,3.58,3.58,0,0,1,13.47,10c2.7,0,3.06,2,3.06,2"
      />
      <rect
        style={{
          fill: 'none',
          stroke: color,
          strokeLinejoin: 'round',
        }}
        x="8.75"
        y="0.66"
        width="2.5"
        height="7.55"
        rx="1.25"
      />
      <line
        style={{
          fill: 'none',
          stroke: color,
          strokeLinejoin: 'round',
        }}
        x1="8.75"
        y1="6.03"
        x2="11.25"
        y2="6.03"
      />
      <circle
        style={{
          fill: color,
        }}
        cx="7.25"
        cy="13.89"
        r="0.79"
      />
      <circle
        style={{
          fill: color,
        }}
        cx="12.77"
        cy="13.89"
        r="0.79"
      />
    </svg>
  );
}

Gravatar16.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar16.defaultProps = {
  title: '',
  color: '#4e4e4e',
};

export default Gravatar16;
