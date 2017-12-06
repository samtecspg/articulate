import TextInput from 'components/TextInput';
import React, { PropTypes } from 'react';
import {
  Icon,
  Row,
} from 'react-materialize';

export function TestMessageInput(props) {

  return (
    <Row>
      <div className="col input-field s10">
        <TextInput
          id={props.id}
          style={props.style}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onKeyPress={props.onKeyPress}
          required={props.required}
          type="text"
          className={props.className ? props.className + ' validate' : 'validate'}
          disabled={props.disabled}
        />
      </div>
      <div className="col input-field s2">
        <a onClick={props.onSpeakClick}>
          <Icon small className="mic-icon">mic</Icon>
        </a>
      </div>
    </Row>
  );
}

TestMessageInput.propTypes = {
  id: PropTypes.string,
  label: React.PropTypes.object,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onKeyPress: React.PropTypes.func,
  onSpeakClick: React.PropTypes.func,
  required: React.PropTypes.bool,
  style: React.PropTypes.object,
  disabled: React.PropTypes.bool,
  className: React.PropTypes.string,
};

export default TestMessageInput;
