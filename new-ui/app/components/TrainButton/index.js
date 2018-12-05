import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import messages from './messages';

import ta from 'time-ago'

const styles = {
  button: {
      display: 'inline'
  },
  trainContainer: {
      display: 'inline',
      marginLeft: '15px',
      position: 'relative',
      bottom: '5px'
  },
  trainingStatusLabel: {
      fontSize: '12px',
      marginLeft: '15px',
      display: 'inline'
  },
  trainingLabel: {
      color: '#4e4e4e',
      fontWeight: 'bold'
  },
  errorLabel: {
      color: '#de5e56',
      fontWeight: 'bold'
  },
  readyLabel: {
      color: '#00ca9f',
      fontWeight: 'bold'
  }
}

const getLastTrainingTime = (lastTraining) => {

  if (lastTraining){
      const timeAgo = ta.ago(lastTraining);
      if (timeAgo.indexOf('second') !== -1 || timeAgo.indexOf(' ms ') !== -1){
          return 'just now';
      }
      return timeAgo;
  }
  return 'never trained';
}

/* eslint-disable react/prefer-stateless-function */
export class TrainButton extends React.Component {

  componentDidMount() {
    this.interval = setInterval(() => {this.setState({ time: Date.now() })}, 10000); //update the component every 10 seconds
  }

  render() {
    const { classes, agentStatus, lastTraining, onTrain } = this.props;
    return (
      <Grid item className={classes.trainContainer}>
        <Button className={classes.button} onClick={onTrain} key='btnFinish' variant='contained'>
          <FormattedMessage {...messages.trainButton} />
        </Button>
        <Typography className={classes.trainingStatusLabel}>
          {agentStatus === 'Training' ?
            <span className={classes.trainingLabel}><FormattedMessage {...messages.statusTraining} /></span> :
            (agentStatus === 'Error' ?
              <span className={classes.errorLabel}><FormattedMessage {...messages.statusError} /></span> :
              agentStatus === 'Out of Date' ?
                <span className={classes.errorLabel}><FormattedMessage {...messages.statusOutOfDate} /></span> :
                agentStatus === 'Ready' ?
                <span className={classes.readyLabel}><FormattedMessage {...messages.statusReady} />{getLastTrainingTime(lastTraining)}</span> :
                null)}
        </Typography>
      </Grid>
    );
  }
}

TrainButton.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  onTrain: PropTypes.func,
  agentStatus: PropTypes.string,
  lastTraining: PropTypes.string,
};

export default injectIntl(withStyles(styles)(TrainButton));
