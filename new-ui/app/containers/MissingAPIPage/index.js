import React from 'react';
import { Grid } from '@material-ui/core';

import imgMissingAPI from '../../images/missing-api.svg';
import messages from './messages';

export default class MissingAPIPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <Grid>
        <p>{messages.missingAPITitle.defaultMessage}</p>
        <p>{messages.missingAPIDescription.defaultMessage}</p>
        <img className="error-img" src={imgMissingAPI} alt="" />
        <p className="error-paragraph">{messages.missingAPIParagraph.defaultMessage}</p>
        <div className="error-btn-container">
          <a target="_blank" className="btn-floating btn-large" href="https://samtecspg.github.io/articulate/">See Docs</a>
        </div>
      </Grid>
    );
  }
}
