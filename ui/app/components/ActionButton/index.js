import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

export function ActionButton(props) { // eslint-disable-line react/prefer-stateless-function
  return (
    <div style={props.customStyle} className="btn-action">
      <a className="btn-floating btn-large" onClick={props.onClick}>
        <FormattedMessage {...props.label} />
      </a>
    </div>
  );
}

ActionButton.propTypes = {
  label: PropTypes.object,
  onClick: PropTypes.func,
  customStyle: PropTypes.object,
};

export default ActionButton;
