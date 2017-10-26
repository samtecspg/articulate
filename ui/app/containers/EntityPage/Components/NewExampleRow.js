import React from 'react';
import TextInput from 'components/TextInput';

import messages from '../messages';

export function NewExampleRow(props) {
  
    return (
        <tr style={{width: '100%'}}>
            <td style={{width: '30%', display: 'inline-block'}}>
                <TextInput
                placeholder={messages.examplePlaceholder.defaultMessage}
                inputId="newExample"
                onKeyPress={props.addExampleFunction}
                />
            </td>
            <td style={{width: '70%', display: 'inline-block'}}> 
            </td>
        </tr>
    );
}

NewExampleRow.propTypes = {
    addExampleFunction: React.PropTypes.func,
};

export default NewExampleRow;
