import React from 'react';

export function Form(props) {

  return (
    <div id="form-section" style={props.style}>
      {React.Children.toArray(props.children)}
    </div>
  );
}

Form.propTypes = {
  children: React.PropTypes.node,
  style: React.PropTypes.object,
};

export default Form;
