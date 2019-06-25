import React from 'react';
import PropTypes from 'prop-types';

function Gravatar9(props) {
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
        d="M17.2,7.49C17.2,3.87,14,.93,10,.93S2.8,3.87,2.8,7.49C2.8,11.41,5,16.08,6,18.06a1.78,1.78,0,0,0,1.59,1h4.23"
      />
      <path
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M2.8,7.49C2.8,3.87,6,.93,10,.93s7.2,2.94,7.2,6.56c0,3.92-2.15,8.59-3.17,10.57a1.78,1.78,0,0,1-1.59,1H8.21"
      />
      <line
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="6.85"
        y1="8.96"
        x2="13.13"
        y2="8.96"
      />
      <line
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="3.85"
        y1="12.36"
        x2="16.15"
        y2="12.36"
      />
      <polyline
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="4.33 13.49 7.33 17.77 12.61 17.77 15.66 13.36"
      />
    </svg>
  );
}

Gravatar9.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar9.defaultProps = {
  title: '',
  color: '#4e4e4e',
};

export default Gravatar9;
