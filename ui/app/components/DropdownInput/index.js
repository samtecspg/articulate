import React, { PropTypes } from 'react';

function DropdownInput(props) { // eslint-disable-line react/prefer-stateless-function

  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <select id={props.id} onChange={props.onChange} value={props.selectedValue}>
        {
          props.options.map((option, index) => {
            return <option key={option.value} value={option.value} disabled={option.disabled}>{option.text}</option>;
          })
        }
      </select>
    </div>
  );
}

DropdownInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  onChange: React.PropTypes.func,
  selectedValue: PropTypes.string,
};

export default DropdownInput;
