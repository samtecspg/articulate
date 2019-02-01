import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Hidden, Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';
import { Link } from 'react-router-dom';
import SaveButton from "../../../components/SaveButton";
import ExitModal from "../../../components/ExitModal";

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

  state = {
    openExitModal: false,
  }

  render(){
    const { classes, intl } = this.props;
    return (
      <Grid className={classes.container}>
        <ExitModal
          open={this.state.openExitModal}
          onExit={() => {this.props.goBack()}}
          onSaveAndExit={() => { this.props.onSaveAndExit() }}
          onClose={() => {this.setState({ openExitModal: false })}}
          type={intl.formatMessage(messages.instanceName)}
        />
        <Hidden only={['xl', 'lg', 'md']}>
          <Link className={`${classes.icon} ${classes.link}`} to={`/agent/${this.props.agentId}/sayings?filter=${this.props.filter}&page=${this.props.page}`}>
            <Icon>arrow_back</Icon>
          </Link>
          <a style={{color: this.props.formError ? '#f44336' : ''}} key='btnFinish' onClick={this.props.onFinishAction} className={`${classes.icon} ${classes.link}`}>
            <Icon>save</Icon>
          </a>
        </Hidden>
        <Hidden only={['sm', 'xs']}>
          {this.props.backButton ?
            <Grid className={classes.backButtonContainer}>
              <span 
                className={classes.backArrow}
                onClick={() => {
                  this.props.touched ? this.setState({ openExitModal : true }) : this.props.goBack()
                }}
                key='backArrow'
              >
                {'< '}
              </span>
              <a key='backLink' className={classes.backButton} 
                onClick={() => {
                  this.props.touched ? this.setState({ openExitModal : true }) : this.props.goBack()
                }}>
                <FormattedMessage {...messages.backButton} />
              </a>
            </Grid> :
            null}
          <Grid className={classes.buttonContainer}>
            <SaveButton touched={this.props.touched} formError={this.props.formError} success={this.props.success} loading={this.props.loading} label={messages.finishButton} onClick={this.props.onFinishAction} />
          </Grid>
        </Hidden>
      </Grid>
    );
  }
}

ActionButtons.propTypes = {
  intl: intlShape,
  classes: PropTypes.object.isRequired,
  onFinishAction: PropTypes.func.isRequired,
  agentId: PropTypes.string,
  formError: PropTypes.bool,
  goBack: PropTypes.func,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  touched: PropTypes.bool,
};

export default injectIntl(withStyles(styles)(ActionButtons));
