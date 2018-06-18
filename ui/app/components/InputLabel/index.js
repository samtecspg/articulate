import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Tooltip from '../Tooltip';
import { Icon } from 'react-materialize';

function InputLabel(props) { // eslint-disable-line react/prefer-stateless-function

  return (
    <div className={`col input-field s${props.s}`}>
      <label className={props.tooltip ? 'tooltipped-input-label' : ''}><FormattedMessage {...props.text} /></label>
      {props.tooltip ?
        <Tooltip
          tooltip={props.tooltip}
          delay={50}
          position="top"
        >
          <a style={{display: 'inline', top: '-10px', position: 'absolute'}}>
            <Icon tiny>help_outline</Icon>
          </a>
        </Tooltip> : null}
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
