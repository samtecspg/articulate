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
                placeholder={props.placeholder} 
                value={props.value}
                onChange={props.onChange}
                onKeyPress={props.onKeyPress}
                required={props.required}
                type="text" 
                className="validate" />
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
};

export default TextInput;