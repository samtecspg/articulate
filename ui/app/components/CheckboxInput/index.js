import React, { PropTypes } from 'react';

import CheckboxOption from './CheckboxOption';

function CheckboxInput(props) { // eslint-disable-line react/prefer-stateless-function

  return (
    <form className="checkbox-container" action="#">
      {
        props.options.map((option) => {
          return <CheckboxOption key={option.id} groupName={props.id} id={option.id} label={option.label} text={option.text} />;
        })
      }
    </form>
  );
}

CheckboxInput.propTypes = {
  id: PropTypes.string,
  options: PropTypes.array,
};

export default CheckboxInput;
