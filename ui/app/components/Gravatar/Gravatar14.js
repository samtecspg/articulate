import React from 'react';
import PropTypes from 'prop-types';

function Gravatar14(props) {
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
        d="M3.1,7.73a6.9,6.9,0,1,1,13.8,0c0,3.81-3.09,11.44-6.9,11.44S3.1,11.54,3.1,7.73Z"
      />
      <path
        style={{
          fill: '#fff',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M3.33,5.78S7.27,1.86,10,6.11c0,0,2.83-4,6.75,0"
      />
      <polygon
        style={{
          fill: 'none',
          stroke: color,
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="11.88 7.88 10.04 5.51 8.21 7.87 10.05 10.24 11.88 7.88"
      />
      <path
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M3.33,9.81s-2.68,4.75-.68,9.36c0,0,1.1-4.11,3.74-2.29"
      />
      <path
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M16.74,9.81s2.69,4.75.69,9.36c0,0-1.11-4.11-3.75-2.29"
      />
    </svg>
  );
}

Gravatar14.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar14.defaultProps = {
  title: '',
  color: '#4e4e4e',
};

export default Gravatar14;
