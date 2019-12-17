import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Button, Hidden, Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import SaveButton from '../../../components/SaveButton';
import ExitModal from '../../../components/ExitModal';

import messages from '../messages';

const styles = {
  container: {
    display: 'inline',
    float: 'right',
  },
  buttonContainer: {
    position: 'relative',
    bottom: '10px',
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
  backButtonContainer: {
    display: 'inline',
  },
  icon: {
    padding: '0px 10px',
    cursor: 'pointer',
  },
  link: {
    color: '#4e4e4e',
    textDecoration: 'underline',
  },
  backArrow: {
    cursor: 'pointer',
    left: -15,
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    position: 'relative',
  },
};

/* eslint-disable react/prefer-stateless-function */
class ActionButtons extends React.Component {
  state = {
    openExitModal: false,
  };

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.container}>
        <ExitModal
          open={this.state.openExitModal}
          onExit={() => {
            this.props.onExit();
          }}
          onSaveAndExit={() => {
            this.props.onSaveAndExit();
          }}
          onClose={() => {
            this.setState({ openExitModal: false });
          }}
          type={intl.formatMessage(messages.instanceName)}
        />
        <Hidden only={['xl', 'lg', 'md']}>
          <Link className={`${classes.icon} ${classes.link}`} to="/">
            <Icon>arrow_back</Icon>
          </Link>
          <a
            style={{ color: this.props.formError ? '#f44336' : '' }}
            onClick={this.props.onFinishAction}
            className={`${classes.icon} ${classes.link}`}
          >
            <Icon>save</Icon>
          </a>
        </Hidden>
        <Hidden only={['sm', 'xs']}>
          <Grid className={classes.buttonContainer}>
            <Grid className={classes.backButtonContainer}>
              <span
                className={classes.backArrow}
                onClick={() => {
                  this.props.touched
                    ? this.setState({ openExitModal: true })
                    : this.props.onExit();
                }}
                key="backArrow"
              >
                {'< '}
              </span>
              <a
                key="backLink"
                className={classes.backButton}
                onClick={() => {
                  this.props.touched
                    ? this.setState({ openExitModal: true })
                    : this.props.onExit();
                }}
              >
                <FormattedMessage {...messages.backButton} />
              </a>
            </Grid>
            <SaveButton
              touched={this.props.touched}
              formError={this.props.error}
              success={this.props.success}
              loading={this.props.loading}
              label={messages.finishButton}
              onClick={this.props.onFinishAction}
            />
          </Grid>
        </Hidden>
      </Grid>
    );
  }
}

ActionButtons.propTypes = {
  classes: PropTypes.object.isRequired,
  onFinishAction: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(withStyles(styles)(ActionButtons));
