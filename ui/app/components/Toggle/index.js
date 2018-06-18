import React, { PropTypes } from 'react';
import propTypes from 'material-ui/utils/propTypes';

export function Toggle(props) { // eslint-disable-line react/prefer-stateless-function
  const style = {};
  if (props.right){
    style.float = 'right';
  }
  if (props.inline){
    style.display = 'inline';
  }
  return (
    <div className="switch" style={style}>
      <label>
        {
          (
          props.strongLabel ?
          <strong>
            {props.label ? props.label : null}:
          </strong>
          :
          props.label ? props.label + ":" : null)
        }
        <input type="checkbox" disabled={props.disabled} onChange={props.onChange} checked={props.checked ? true : false} />
        <span className="lever"></span>
      </label>
    </div>
  );
};

Toggle.propTypes = {
  label: PropTypes.string,
  right: PropTypes.bool,
  inline: PropTypes.bool,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  strongLabel: PropTypes.bool
};

Toggle.defaultProps = {
  strongLabel: true,
  disabled: false
}

export default Toggle;
