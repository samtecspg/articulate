import React from 'react';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Header from '../../components/Header';

import image404 from '../../img/missing-api.svg';

import messages from './messages';


export default class MissingAPIPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>
        <Header breadcrumbs={[]}/>
        <Content>
          <ContentHeader headerStyle={{textAlign: 'center'}} title={messages.missingAPITitle} subTitle={messages.missingAPIDescription}>
            <img className="error-img" src={image404} alt="" />
            <p className="error-paragraph">{messages.missingAPIParagraph.defaultMessage}</p>
            <div className="error-btn-container">
              <a target="_blank" className="btn-floating btn-large" href="https://samtecspg.github.io/articulate/">See Docs</a>
            </div>
          </ContentHeader>
        </Content>
      </div>
    );
  }
}
