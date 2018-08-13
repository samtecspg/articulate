/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Grid } from '@material-ui/core';

import image404 from '../../images/404-img.svg';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export default class NotFound extends React.PureComponent {
  render() {
    return (
      <Grid>
        <p>
          {messages.notFoundTitle.defaultMessage}{messages.notFoundDescription.defaultMessage}
        </p>
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
      </Grid>
    );
  }
}
