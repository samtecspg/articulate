import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import messages from './messages';

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en';
import es from 'javascript-time-ago/locale/es';
import pt from 'javascript-time-ago/locale/pt';
import pl from 'javascript-time-ago/locale/pl';
TimeAgo.addLocale(en);
TimeAgo.addLocale(es);
TimeAgo.addLocale(pt);
TimeAgo.addLocale(pl);

const styles = {
  button: {
    display: 'inline',
  },
  trainContainer: {
    display: 'inline',
    marginLeft: '15px',
    position: 'relative',
    bottom: '5px',
  },
  trainingStatusLabel: {
    fontSize: '12px',
    marginRight: '15px',
    display: 'inline',
  },
  trainingLabel: {
    color: '#4e4e4e',
    fontWeight: 'bold',
  },
  errorLabel: {
    color: '#de5e56',
    fontWeight: 'bold',
  },
  readyLabel: {
    color: '#00ca9f',
    fontWeight: 'bold',
  }
};

/* eslint-disable react/prefer-stateless-function */
export class TrainButton extends React.Component {

  componentDidMount() {
    this.interval = setInterval(() => {this.setState({ time: Date.now() })}, 10000); // update the component every 10 seconds
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getLastTrainingTime(lastTraining) {

    if (lastTraining){
      const timeAgo = new TimeAgo(this.props.locale).format(new Date(lastTraining));
      return timeAgo;
    }
    return this.props.intl.formatMessage(messages.neverTrained);
  };

  render() {
    const { classes, agentStatus, lastTraining, onTrain, locale } = this.props;
    return (
      <Grid item className={classes.trainContainer}>
        <Typography className={classes.trainingStatusLabel}>
          {agentStatus === 'Training' ?
            <span className={classes.trainingLabel}><FormattedMessage {...messages.statusTraining} /></span> :
            (agentStatus === 'Error' ?
              <span className={classes.errorLabel}><FormattedMessage {...messages.statusError} /></span> :
              agentStatus === 'Out of Date' ?
                <span className={classes.errorLabel}><FormattedMessage {...messages.statusOutOfDate} /></span> :
                agentStatus === 'Ready' ?
                  <span className={classes.readyLabel}><FormattedMessage {...messages.statusReady} />{` ${this.getLastTrainingTime(lastTraining)}`}</span> :
                  null)}
        </Typography>
        <Button className={classes.button} onClick={onTrain} key='btnFinish' variant='contained'>
          <FormattedMessage {...messages.trainButton} />
        </Button>
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
  locale: PropTypes.string,
};

export default injectIntl(withStyles(styles)(TrainButton));
