import { Grid, Hidden, Icon, Tab, Tabs, Tooltip, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import messages from './../messages';

const styles = {
  mainTabContainer: {
    marginTop: '45px',
  },
  tabs: {
    paddingLeft: '5px',
  },
  tab: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  buttonContainer: {
    position: 'relative',
    bottom: '5px',
    width: '100%',
    textAlign: 'right'
  },
  button: {
    display: 'inline',
  },
  backButtonContainer: {
    display: 'inline',
    widht: '100%',
    bottom: '10px',
  },
  backArrow: {
    cursor: 'pointer',
    left: -15,
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    position: 'relative',
  },
  backButton: {
    cursor: 'pointer',
    left: -15,
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    position: 'relative',
    textDecoration: 'underline',
  },
  container: {
    display: 'inline',
    float: 'right',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class MainTab extends React.Component {

  render() {
    const {
      classes,
    } = this.props;
    return (
      <Fragment>
        <Grid className={classes.container}>
          <Grid container className={classes.mainTabContainer}>
            <Grid className={classes.buttonContainer}>
              <Grid className={classes.backButtonContainer}>
                <span
                  className={classes.backArrow}
                  onClick={async () => {
                    await this.props.onGoToUrl(
                      `/agent/${this.props.agent.id}/dialogue`,
                    );
                  }}
                  key="backArrow"
                >
                  {'< '}
                </span>
                <a
                  key="backLink"
                  className={classes.backButton}
                  onClick={async () => {
                    await this.props.onGoToUrl(
                      `/agent/${this.props.agent.id}/dialogue`,
                    );
                  }}
                >
                  <FormattedMessage {...messages.backButton} />
                </a>
              </Grid>
            </Grid>
          </Grid>
          {this.props.trainingTestSummaryForm}
        </Grid>
      </Fragment>
    );
  }
}

MainTab.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  isReadOnly: PropTypes.bool,
  onGoToUrl: PropTypes.func
};

MainTab.defaultProps = {
  isReadOnly: false,
};

export default injectIntl(withStyles(styles)(MainTab));
