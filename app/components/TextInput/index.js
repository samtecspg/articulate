import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

function TextInput(props) { // eslint-disable-line react/prefer-stateless-function

    return (
        <div>
            { 
                props.label ? <label htmlFor={props.id}><FormattedMessage {...props.label} /></label> : ''
            }
            <input 
                id={props.id}
                style={props.style} 
                placeholder={props.placeholder} 
                value={props.value}
                onChange={props.onChange}
                onKeyPress={props.onKeyPress}
                required={props.required}
                type="text" 
                className={props.className}
                disabled={props.disabled}
            />
        </div>
    );
}

TextInput.propTypes = {
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
};

export default TextInput;