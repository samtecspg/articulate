import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import Header from 'components/Header';
import Toggle from 'components/Toggle';
import TextInput from 'components/TextInput';
import InputWarning from 'components/InputWarning';
import DropdownInput from 'components/DropdownInput';
import CheckboxInput from 'components/CheckboxInput';

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Header/>
        </div>
    );
  }
}
