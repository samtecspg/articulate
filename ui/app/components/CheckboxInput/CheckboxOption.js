import React, { PropTypes } from 'react';

function CheckboxOption(props) { // eslint-disable-line react/prefer-stateless-function

  return (
    <div className="checkbox">
      <input name={props.groupName} type="checkbox" id={props.id} />
      <label htmlFor={props.id}>{props.label}</label>
      <p>{props.text}</p>
    </div>
  );
}

CheckboxOption.propTypes = {
  groupName: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  text: PropTypes.string,
};

export default CheckboxOption;
