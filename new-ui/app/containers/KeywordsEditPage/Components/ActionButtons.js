import React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Button, Hidden, Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    display: 'inline',
    float: 'right',
  },
  buttonContainer: {
    display: 'inline',
    position: 'relative',
    bottom: '10px',
  },
  icon: {
    padding: '0px 10px',
    cursor: 'pointer',
  },
  link: {
    color: '#4e4e4e',
    textDecoration: 'none',
  },
  backArrow: {
    display: 'inline',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
  },
  backButton: {
    display: 'inline',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    textDecoration: 'underline',
  },
  backButtonContainer: {
    display: 'inline',
    paddingRight: '10px',
    position: 'relative',
    bottom: '10px',
  }
};

/* eslint-disable react/prefer-stateless-function */
class ActionButtons extends React.Component {

  render(){
    const { classes } = this.props;
    return (
      <Grid className={classes.container}>
        <Hidden only={['xl', 'lg', 'md']}>
          <Link className={`${classes.icon} ${classes.link}`} to='/'>
            <Icon>arrow_back</Icon>
          </Link>
          <a  style={{color: this.props.formError ? '#f44336' : ''}}key='btnFinish' onClick={this.props.onFinishAction} className={`${classes.icon} ${classes.link}`}>
            <Icon>save</Icon>
          </a>
        </Hidden>
        <Hidden only={['sm', 'xs']}>
          {this.props.backButton ?
            <Grid className={classes.backButtonContainer}>
              <span className={classes.backArrow} onClick={this.props.goBack} key='backArrow'>{'< '}</span>
              <a key='backLink' className={classes.backButton} onClick={this.props.goBack}>
                <FormattedMessage {...this.props.backButton} />
              </a>
            </Grid> :
            null}
          <Grid className={classes.buttonContainer}>
            <Button style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} key='btnFinish' variant='contained'>
              <FormattedMessage {...messages.finishButton} />
            </Button>
          </Grid>
        </Hidden>
      </Grid>
    );
  }
}

ActionButtons.propTypes = {
  classes: PropTypes.object.isRequired,
  onFinishAction: PropTypes.func.isRequired,
  agentId: PropTypes.string,
  formError: PropTypes.bool,
  goBack: PropTypes.func,
};

export default withStyles(styles)(ActionButtons);
