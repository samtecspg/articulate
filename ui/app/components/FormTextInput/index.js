import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Tooltip from '../Tooltip';
import { Icon } from 'react-materialize';
import TextInput from '../TextInput';

function FormTextInput(props) { // eslint-disable-line react/prefer-stateless-function

    return (
        <div className={`input-field col s${props.s}`}>
            <TextInput 
                id={props.id}
                label={props.label}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                onKeyPress={props.onKeyPress}
                required={props.required}
                style={props.style}
                disabled={props.disabled}
                className={props.className}
                tooltip={props.tooltip}
            />
        </div>
    );
}

FormTextInput.propTypes = {
    id: PropTypes.string,
    label: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onKeyPress: React.PropTypes.func,
    required: React.PropTypes.bool,
    style: React.PropTypes.object,
    disabled: React.PropTypes.bool,
    className: React.PropTypes.string,
    tooltip: React.PropTypes.string,
    s: React.PropTypes.number
};

FormTextInput.defaultProps = {
    s: 12,
};

export default FormTextInput;