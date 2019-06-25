import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import helpButton from '../../../images/help-button-icon.svg';
import messages from '../messages';

const styles = {
  getStartedContainer: {
    display: 'block',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #a2a7b1',
    padding: '20px',
    boxShadow:
      '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
  },
  getStartedClose: {
    cursor: 'pointer',
    float: 'right',
  },
  getStartedText: {
    marginTop: '15px',
  },
  getStartedTextClick: {
    display: 'flex',
  },
  getStartedTextClickElement: {
    display: 'inline',
  },
  getStartedTextClickButtonContainer: {
    '&:hover': {
      boxShadow: '0 2px 10px 0px #4e4e4e',
    },
    border: '1px solid #00bd6f',
    cursor: 'pointer',
    padding: '5px',
    marginLeft: '10px',
    position: 'relative',
    bottom: '5px',
  },
  getStartedTextClickButtonText: {
    display: 'inline',
    color: '#00bd6f',
    textDecoration: 'none',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class GetStarted extends React.Component {
  state = {
    hideGetStarted: localStorage.getItem('hideGetStarted'),
  };

  hideGetStarted() {
    localStorage.setItem('hideGetStarted', true);
    this.setState({
      hideGetStarted: true,
    });
  }

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid
        style={{ display: this.state.hideGetStarted ? 'none' : 'block' }}
        container
        className={classes.getStartedContainer}
      >
        <Typography
          onClick={() => {
            this.hideGetStarted();
          }}
          className={classes.getStartedClose}
        >
          X
        </Typography>
        <Grid item xs={12}>
          <Typography variant="h1">
            {intl.formatMessage(messages.getStarted)}
          </Typography>
        </Grid>
        <Grid className={classes.getStartedText} item xs={12}>
          <Typography>
            {intl.formatMessage(messages.getStartedDescription1)}{' '}
            <img
              src={helpButton}
              style={{ top: '6px', position: 'relative' }}
            />{' '}
            {intl.formatMessage(messages.getStartedDescription2)}
          </Typography>
        </Grid>
        <Grid
          className={`${classes.getStartedText} ${classes.getStartedTextClick}`}
          item
          xs={12}
        >
          <Typography className={classes.getStartedTextClickElement}>
            {intl.formatMessage(messages.clickHereFor)}
          </Typography>
          <div
            className={`${classes.getStartedTextClickButtonContainer} ${
              classes.getStartedTextClickElement
            }`}
          >
            <Typography>
              <a
                className={classes.getStartedTextClickButtonText}
                target="_blank"
                href="https://blog.spg.ai/articulates-got-a-whole-new-groove-2175c3d67b4c"
              >
                Articulate got a new groove
              </a>
            </Typography>
          </div>
          <div
            className={`${classes.getStartedTextClickButtonContainer} ${
              classes.getStartedTextClickElement
            }`}
          >
            <Typography>
              <a
                className={classes.getStartedTextClickButtonText}
                target="_blank"
                href="https://blog.spg.ai/basic-access-restrictions-for-articulate-58e77c931ca3"
              >
                Basic Access Restrictions
              </a>
            </Typography>
          </div>
        </Grid>
      </Grid>
    );
  }
}

GetStarted.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(withStyles(styles)(GetStarted));
