import React from 'react';
import PropTypes from 'prop-types';

function Gravatar6(props) {
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
      <polygon
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="2.15 6.26 17.89 6.26 17.89 11 16.83 12.68 17.89 19.1 2.15 19.1 3.42 12.41 2.15 11 2.15 6.26"
      />
      <polygon
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="12.49 15.36 7.55 15.36 6.5 19.1 13.53 19.1 12.49 15.36"
      />
      <rect
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        x="8.47"
        y="0.9"
        width="3.14"
        height="5.36"
      />
      <path
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M3.68,6.26S4.84,2.12,8.47,2.12"
      />
      <path
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        d="M16.4,6.26s-1.16-4.14-4.79-4.14"
      />
      <polygon
        style={{
          fill: 'none',
          stroke: color,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
        points="5.6 8.52 10.04 8.91 14.48 8.52 14.48 10.98 11.48 11.36 11.89 12.55 8.25 12.55 8.64 11.4 5.6 11.03 5.6 8.52"
      />
    </svg>
  );
}

Gravatar6.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Gravatar6.defaultProps = {
  title: '',
  color: '#4e4e4e',
};

export default Gravatar6;
