import React from 'react';
import { FormattedMessage } from 'react-intl';


import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Header from '../../components/Header';

import messages from './messages';

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Header breadcrumbs={[]}/>
        <Content>
          <ContentHeader title={messages.notFoundTitle} subTitle={messages.notFoundDescription} />
        </Content>
      </div>
    );
  }
}
