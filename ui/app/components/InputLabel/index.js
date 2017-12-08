import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

function InputLabel(props) { // eslint-disable-line react/prefer-stateless-function

  return (
    <div className="col input-field s12">
      <label><FormattedMessage {...props.text} /></label>
    </div>
  );
}

InputLabel.propTypes = {
  text: PropTypes.object,
};

InputLabel.defaultProps = {
  s: 12,
};

export default InputLabel;
