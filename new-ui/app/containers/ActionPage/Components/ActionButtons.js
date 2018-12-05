import React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Button, Hidden, Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

const styles = {
    container: {
        display: 'inline',
        float: 'right'
    },
    buttonContainer: {
        position: 'relative',
        bottom: '10px'
    },
    icon: {
        padding: '0px 10px',
        cursor: 'pointer'
    },
    link: {
        color: '#4e4e4e',
        textDecoration: 'none'
    }
}

/* eslint-disable react/prefer-stateless-function */
class ActionButtons extends React.Component {

    render(){
        const { classes } = this.props;
        return (
            <Grid className={classes.container}>
                <Hidden only={['xl', 'lg', 'md']}>
                    {this.props.hideFinishButton ?
                        (
                            <a key='btnNext' onClick={this.props.onNextAction} className={`${classes.icon} ${classes.link}`}>
                                <Icon>arrow_forward</Icon>
                            </a>
                        )
                    :
                        (
                            this.props.isLastTab ?
                                <a style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} className={`${classes.icon} ${classes.link}`}>
                                    <Icon>save</Icon>
                                </a>
                            :
                                [<a style={{color: this.props.formError ? '#f44336' : ''}} key='btnFinish' onClick={this.props.onFinishAction} className={`${classes.icon} ${classes.link}`}>
                                    <Icon>save</Icon>
                                </a>,
                                <a key='btnNext' onClick={this.props.onNextAction} className={`${classes.icon} ${classes.link}`}>
                                    <Icon>arrow_forward</Icon>
                                </a>]
                        )
                    }
                </Hidden>
                <Hidden only={['sm', 'xs']}>
                    <Grid className={classes.buttonContainer}>
                        {this.props.hideFinishButton ?
                            (
                                <Button onClick={this.props.onNextAction} key='btnNext' variant='contained'>
                                    <FormattedMessage {...messages.nextButton} />
                                </Button>
                            )
                        :
                            (
                                this.props.isLastTab ?
                                    <Button style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} key='btnFinish' variant='contained'>
                                        <FormattedMessage {...messages.finishButton} />
                                    </Button>
                                :
                                    [<Button style={{color: this.props.formError ? '#f44336' : ''}} onClick={this.props.onFinishAction} key='btnFinish'>
                                        <FormattedMessage {...messages.finishButton} />
                                    </Button>,
                                    <Button onClick={this.props.onNextAction} key='btnNext' variant='contained'>
                                        <FormattedMessage {...messages.nextButton} />
                                    </Button>]
                            )
                        }
                    </Grid>
                </Hidden>
            </Grid>
        );
    }
}

ActionButtons.propTypes = {
    classes: PropTypes.object.isRequired,
    onFinishAction: PropTypes.func.isRequired,
    onNextAction: PropTypes.func.isRequired,
    hideFinishButton: PropTypes.bool,
    isLastTab: PropTypes.bool,
    formError: PropTypes.bool,
};

export default withStyles(styles)(ActionButtons);