import TextInput from 'components/TextInput';
import React, { PropTypes } from 'react';
import {
  Icon,
  Row,
} from 'react-materialize';
import Dropdown from '../Dropdown';

export function TestMessageInput(props) {

  return (
    <div id="form-section" style={{marginBottom: '60px'}}>
      <Row>
        <div className="col input-field s10">
          <TextInput
            id={props.id}
            style={props.style}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            onKeyDown={props.onKeyDown}
            required={props.required}
            type="text"
            className={props.className ? props.className + ' validate' : 'validate'}
            disabled={props.disabled}
          />
        </div>
        <div className="col input-field s1" style={{paddingRight: '0px'}}>
          <a onClick={props.onSpeakClick}>
            <Icon small className="mic-icon">mic</Icon>
          </a>
        </div>
        <div className="col input-field s1">
          <Dropdown
              element={<Icon>more_vert</Icon>}
              menu={props.menu}
              item={{}}
              globalStyle={{paddingTop: '10px'}}
              belowOrigin={false}
          />
        </div>
      </Row>
    </div>
  );
}

TestMessageInput.propTypes = {
  id: PropTypes.string,
  label: React.PropTypes.object,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onKeyDown: React.PropTypes.func,
  onSpeakClick: React.PropTypes.func,
  required: React.PropTypes.bool,
  style: React.PropTypes.object,
  disabled: React.PropTypes.bool,
  className: React.PropTypes.string,
  menu: React.PropTypes.array,
};

export default TestMessageInput;
