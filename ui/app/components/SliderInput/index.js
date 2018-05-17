import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'react-materialize';
import Tooltip from '../Tooltip';

function SliderInput(props) {
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
  tooltip: React.PropTypes.string,
  id: React.PropTypes.string,
  min: React.PropTypes.string,
  max: React.PropTypes.string,
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

export default SliderInput;
