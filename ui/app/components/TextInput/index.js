import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'react-materialize';
import Tooltip from '../Tooltip';

function TextInput(props) { // eslint-disable-line react/prefer-stateless-function

  return (
    <div>
      {
        props.label ?
          (<label style={{ pointerEvents: 'all' }} htmlFor={props.id}>
            {
              props.tooltip ?
                (
                  <div>
                    <FormattedMessage {...props.label} />
                    <Tooltip
                      tooltip={props.tooltip}
                      delay={50}
                      position="top"
                    >
                      <a>
                        <Icon tiny>help_outline</Icon>
                      </a>
                    </Tooltip>
                  </div>) :
                <FormattedMessage {...props.label} />
            }
          </label>) : ''
      }
      <div>
        <input
          id={props.id}
          style={props.style}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onKeyDown={props.onKeyDown}
          required={props.required}
          type="text"
          className={props.className}
          disabled={props.disabled}
          defaultValue={props.defaultValue}
        />
        { props.icon ?
          (<Icon className="input-icon">{props.icon}</Icon>) : ''
        }
      </div>
    </div>
  );
}

TextInput.propTypes = {
  id: PropTypes.string,
  label: React.PropTypes.object,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.string,
  defaultValue: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onKeyDown: React.PropTypes.func,
  required: React.PropTypes.bool,
  style: React.PropTypes.object,
  disabled: React.PropTypes.bool,
  className: React.PropTypes.string,
  tooltip: React.PropTypes.string,
  icon: React.PropTypes.string
};

export default TextInput;
