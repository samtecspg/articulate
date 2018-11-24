import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import ta from 'time-ago'

import PropTypes from 'prop-types';
import { Grid, Button, Hidden, Icon, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

const styles = {
    container: {
        display: 'inline',
    },
    trainContainer: {
        display: 'inline',
        marginLeft: '15px',
        position: 'relative',
        bottom: '5px'
    },
    button: {
        display: 'inline'
    },
    trainingStatusLabel: {
        fontWeight: 300,
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
class ActionButtons extends React.Component {

    render(){
        const { classes, agentStatus, lastTraining } = this.props;
        return (
            <Grid className={classes.container}>
                <Grid item className={classes.trainContainer}>
                    <Button className={classes.button} onClick={this.props.onTrain} key='btnFinish' variant='raised'>
                        <FormattedMessage {...messages.trainButton} />
                    </Button>
                    <Typography className={classes.trainingStatusLabel}>
                        {agentStatus === 'Training' ?
                            <span className={classes.trainingLabel}>Status: updating agent…</span> :
                            (agentStatus === 'Error' ?
                                <span className={classes.errorLabel}>Status: error on training</span> :
                                agentStatus === 'Out of Date' ?
                                    <span className={classes.errorLabel}>Status: out of date</span> :
                                    <span className={classes.readyLabel}>{`Last Trained: ${getLastTrainingTime(lastTraining)}`}</span>)}
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

ActionButtons.propTypes = {
    classes: PropTypes.object.isRequired,
    onTrain: PropTypes.func,
    agentStatus: PropTypes.string,
    lastTraining: PropTypes.string,
};

export default withStyles(styles)(ActionButtons);