import React from 'react';
import PropTypes from 'prop-types';

function Gravatar4(props) {
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
        d="M15.49,14.46H3.39a1.57,1.57,0,0,1-1.57-1.57V3.76A1.56,1.56,0,0,1,3.39,2.2H16.61a1.56,1.56,0,0,1,1.57,1.56v10.7s0,3.25-3,3.77"
      />
      <path
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M6.44,9c0,1,1.57,1.89,3.5,1.89s3.51-.85,3.51-1.89"
      />
      <circle
        style={{
          fill: color,
        }}
        cx="7.89"
        cy="5.98"
        r="1.09"
      />
      <circle
        style={{
          fill: color,
        }}
        cx="11.99"
        cy="5.98"
        r="1.09"
      />
    </svg>
  );
}

Gravatar4.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar4.defaultProps = {
  title: '',
  color: '#4e4e4e',
};

export default Gravatar4;
