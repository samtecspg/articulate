import React from 'react';


import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Header from '../../components/Header';

import image404 from '../../img/404-img.svg';

import messages from './messages';

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {

    const goBack = this.props.router.goBack;

    return (
      <div>
        <Header breadcrumbs={[]}/>
        <Content>
          <ContentHeader headerStyle={{textAlign: 'center'}} title={messages.notFoundTitle} subTitle={messages.notFoundDescription}>
            <img className="error-img" src={image404} alt="" />
            <p className="error-paragraph">{messages.notFoundParagraph.defaultMessage}</p>
            <div className="error-btn-container">
              <a onClick={() => goBack()} className="btn-floating btn-large">Go Back</a>
              <a target="_blank" style={{ marginLeft: '5px' }} className="btn-floating secondary-btn btn-large" href="https://samtecspg.github.io/articulate/">See Docs</a>
            </div>
            <div className="fixed-action-btn">
              <a style={ { right: '310px' } } className="btn-floating btn-large" href="/agent/create">
              + Create Agent
              </a>
            </div>
          </ContentHeader>
        </Content>
      </div>
    );
  }
}
