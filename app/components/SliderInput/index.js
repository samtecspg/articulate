import React from 'react';
import { FormattedMessage } from 'react-intl';

function SliderInput(props) {
  return (
    <div>
      <label htmlFor={props.id}>
          <FormattedMessage {...props.label} />
      </label>
      <p className="range-field">
        <input
          id={props.id}
          type="range"
          value={props.value}
          min={props.min}
          max={props.max}
          onChange={props.onChange}
          />
      </p>
    </div>
  );
}

SliderInput.propTypes = {
  label: React.PropTypes.object,
  id: React.PropTypes.string,
  min: React.PropTypes.string,
  max: React.PropTypes.string,
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

export default SliderInput;
