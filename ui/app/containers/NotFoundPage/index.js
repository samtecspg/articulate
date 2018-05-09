import React from 'react';
import { FormattedMessage } from 'react-intl';


import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Header from '../../components/Header';

import image404 from '../../img/404-img.svg';

import messages from './messages';

let breadcrumbs = [{ link: '/', label: `${messages.homeBreadcrumb.defaultMessage}` }];

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Header breadcrumbs={breadcrumbs}/>
        <Content>
          <ContentHeader title={messages.notFoundTitle} subTitle={messages.notFoundDescription} />
          <img className="error-img" src={image404} alt="" />
          <p className="error-paragraph">{messages.notFoundParagraph.defaultMessage}</p>
          <div className="error-btn-container">
            <a className="btn-floating btn-large" href="https://samtecspg.github.io/articulate/">See Docs</a>
          </div>
          <div className="fixed-action-btn">
						<a style={ { right: '310px' } } className="btn-floating btn-large" href="/agent/create">
						+ Create Agent
						</a>
					</div>
        </Content>
      </div>
    );
  }
}
