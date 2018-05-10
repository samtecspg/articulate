import React from 'react';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Header from '../../components/Header';
import { push } from 'react-router-redux';

import image404 from '../../img/missing-api.svg';

import messages from './messages';
import { makeSelectMissingAPI, } from '../App/selectors';


export default class MissingAPIPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>
        <Header breadcrumbs={[{ label: 'Missing API' },]}/>
        <Content>
          <ContentHeader title={messages.missingAPITitle} subTitle={messages.missingAPIDescription} />
          <img className="error-img" src={image404} alt="" />
          <p className="error-paragraph">{messages.missingAPIParagraph.defaultMessage}</p>
          <div className="error-btn-container">
            <a target="_blank" className="btn-floating btn-large" href="https://samtecspg.github.io/articulate/">See Docs</a>
          </div>
        </Content>
      </div>
    );
  }
}
