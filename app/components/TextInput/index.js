import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Tooltip from '../Tooltip';
import { Icon } from 'react-materialize';

function TextInput(props) { // eslint-disable-line react/prefer-stateless-function

    return (
        <div>
            { 
                props.label ?
                (<div>
                    <label htmlFor={props.id}><FormattedMessage {...props.label} /></label>
                    {
                        props.tooltip ? 
                        (<Tooltip
                            tooltip={props.tooltip}
                            delay={50}
                            position="top"
                        >
                            <a>
                                <Icon tiny>help_outline</Icon>
                            </a>
                        </Tooltip>) : ''
                    }
                </div>) : ''
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
    tooltip: React.PropTypes.string,
};

export default TextInput;