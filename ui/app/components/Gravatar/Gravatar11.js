import React from 'react';
import PropTypes from 'prop-types';

function Gravatar11(props) {
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
        d="M10.43,1H9L8.08,7.53l1.27,3.8L6.87,12.8A5.24,5.24,0,0,1,5.1,7.45L4.52,5.79"
      />
      <polyline
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="10.52 11.33 11.79 7.53 10.86 0.99 9.44 0.99"
      />
      <line
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="4.97"
        y1="8.98"
        x2="8.45"
        y2="9.35"
      />
      <line
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="4.52"
        y1="5.79"
        x2="2.73"
        y2="0.99"
      />
      <polyline
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="7.47 12.44 7.47 17.97 6.46 19.01 3.94 18.07 3.94 16.64 1.12 5.79"
      />
      <path
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M1.65,7.85A7.78,7.78,0,0,1,8.58,4"
      />
      <polyline
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="9.93 11.74 9.93 19.01 7.47 18.2"
      />
      <path
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M9.57,1H11l.93,6.54-1.27,3.8,2.48,1.47A5.24,5.24,0,0,0,14.9,7.45l.58-1.66"
      />
      <polyline
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="9.48 11.33 8.21 7.53 9.14 0.99 10.56 0.99"
      />
      <line
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="15.03"
        y1="8.98"
        x2="11.55"
        y2="9.35"
      />
      <line
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="15.48"
        y1="5.79"
        x2="17.27"
        y2="0.99"
      />
      <polyline
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="12.53 12.44 12.53 17.97 13.54 19.01 16.06 18.07 16.06 16.64 18.88 5.79"
      />
      <path
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M18.35,7.85A7.78,7.78,0,0,0,11.42,4"
      />
      <polyline
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="10.07 11.74 10.07 19.01 12.53 18.2"
      />
      <line
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="11.12"
        y1="3.39"
        x2="8.86"
        y2="3.39"
      />
      <line
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="11.12"
        y1="5.5"
        x2="8.86"
        y2="5.5"
      />
      <line
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x1="11.12"
        y1="7.6"
        x2="8.86"
        y2="7.6"
      />
    </svg>
  );
}

Gravatar11.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar11.defaultProps = {
  title: '',
  color: '#4e4e4e',
};

export default Gravatar11;
