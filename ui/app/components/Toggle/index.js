import React, { PropTypes } from 'react';

export function Toggle(props) { // eslint-disable-line react/prefer-stateless-function
  return (
    <div className="switch" style={props.right ? { float: 'right' } : {}}>
      <label>
        {
          <strong>
            {props.label ? props.label : null}:
          </strong>
        }
        <input type="checkbox" onChange={props.onChange} />
        <span className="lever"></span>
        Enable
      </label>
    </div>
  );
};

Toggle.propTypes = {
  label: PropTypes.string,
  right: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Toggle;
