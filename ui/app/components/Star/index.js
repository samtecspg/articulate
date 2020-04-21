import React from 'react';
import PropTypes from 'prop-types';

function Star(props) {
  const { starred, hovered, ...rest } = props;

  return (
    <svg {...rest} viewBox='0 0 39 35' version='1.1' xmlns='http://www.w3.org/2000/svg'>
        <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' strokeLinejoin='round'>
            <polygon id='Star' stroke={starred || hovered ? '#FDD421' : '#979797'} strokeWidth='3' fill={starred ? '#FDD421' : null} points='19.5 25.4070173 8.62597283 32.7532889 12.8689084 20.9798772 1.90545445 13.7467111 15.40176 13.8166141 19.5 2 23.59824 13.8166141 37.0945456 13.7467111 26.1310916 20.9798772 30.3740272 32.7532889'></polygon>
        </g>
    </svg>
  );
}

Star.propTypes = {
  fill: PropTypes.string,
  starred: PropTypes.bool,
  hovered: PropTypes.bool,
};

Star.defaultProps = {
  starred: false,
  hovered: false,
};

export default Star;
