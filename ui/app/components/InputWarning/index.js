import React, { PropTypes } from 'react';

function InputWarning(props) { // eslint-disable-line react/prefer-stateless-function

  return (
    <p className="warning">{props.text}</p>
  );
}

InputWarning.propTypes = {
  text: PropTypes.string,
};

export default InputWarning;
