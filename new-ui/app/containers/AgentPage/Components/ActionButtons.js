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
    actionContainer: {
        display: 'inline',
        float: 'right'
    },
    trainContainer: {
        display: 'inline',
        marginLeft: '15px',
        position: 'relative',
        bottom: '5px'
    },
    buttonContainer: {
        position: 'relative',
        bottom: '5px'
    },
    icon: {
        padding: '0px 10px',
        cursor: 'pointer'
    },
    link: {
        color: '#4e4e4e',
        textDecoration: 'none'
    },
    button: {
        display: 'inline'
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
                                    agentStatus === 'Ready' ?
                                    <span className={classes.readyLabel}>{`Last Trained: ${getLastTrainingTime(lastTraining)}`}</span> :
                                    null)}
                    </Typography>
                </Grid>
                <Grid item className={classes.actionContainer}>
                    <Hidden only={['xl', 'lg', 'md']}>
                        <Link className={`${classes.icon} ${classes.link}`} to='/'>
                            <Icon>arrow_back</Icon>
                        </Link>
                        <a onClick={this.props.onFinishAction} className={`${classes.icon} ${classes.link}`}>
                            <Icon>save</Icon>
                        </a>
                    </Hidden>
                    <Hidden only={['sm', 'xs']}>
                        <Grid className={classes.buttonContainer}>
                            <Button key='btnCancel'>
                                <Link className={classes.link} to='/'>
                                    <FormattedMessage {...messages.cancelButton} />
                                </Link>
                            </Button>
                            <Button style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} key='btnFinish' variant='raised'>
                                <FormattedMessage {...messages.finishButton} />
                            </Button>
                        </Grid>
                    </Hidden>
                </Grid>
            </Grid>
        );
    }
}

ActionButtons.propTypes = {
    classes: PropTypes.object.isRequired,
    onFinishAction: PropTypes.func.isRequired,
    onTrain: PropTypes.func,
    agentStatus: PropTypes.string,
    lastTraining: PropTypes.string,
    formError: PropTypes.bool,
};

export default withStyles(styles)(ActionButtons);