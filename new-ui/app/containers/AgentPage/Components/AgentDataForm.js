import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Typography, TextField, MenuItem, Paper, Table, TableBody, TableRow, TableCell  } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider'
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

import trashIcon from '../../../images/trash-icon.svg';
import openingQuotes from '../../../images/opening-quotes.svg';
import closingQuotes from '../../../images/closing-quotes.svg';

const styles = {
    formContainer: {
        backgroundColor: '#ffffff',
        borderTop: '1px solid #c5cbd8',
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px'
    },
    formSubContainer: {
        padding: '40px 25px'
    },
    sliderLabel: {
        paddingTop: '20px',
        fontSize: '12px',
        color: '#a2a7b1',
    },
    sliderTextField: {
        width: '100%'
    },
    table: {
        marginTop: '20px'
    },
    deleteCell: {
        width: '20px'
    },
    deleteIcon: {
        cursor: 'pointer'
    },
}

/* eslint-disable react/prefer-stateless-function */
class AgentDataForm extends React.Component {

    state = {
        agentNameError: false
    }

    render(){
        const { classes, intl, agent, settings } = this.props;
        return (
            <Grid className={classes.formContainer} container item xs={12}>
                <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
                    <Grid container spacing={24} item xs={12}>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            <TextField
                                id='agentName'
                                label={intl.formatMessage(messages.agentTextField)}
                                value={agent.agentName}
                                placeholder={intl.formatMessage(messages.agentTextFieldPlaceholder)}
                                onChange={(evt) => { this.props.onChangeAgentName('agentName', evt.target.value) }}
                                margin='normal'
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={intl.formatMessage(messages.requiredField)}
                                error={this.state.agentNameError}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} item xs={12}>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                        <TextField
                            id='name'
                            label={intl.formatMessage(messages.descriptionTextField)}
                            value={agent.description}
                            placeholder={intl.formatMessage(messages.descriptionTextFieldPlaceholder)}
                            onChange={(evt) => { this.props.onChangeAgentData('description', evt.target.value) }}
                            margin='normal'
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            rows={4}
                        />
                        </Grid>
                    </Grid>
                    <Grid container justify='space-between' spacing={24} item xs={12}>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            <TextField
                                select
                                id='name'
                                value={agent.language}
                                label={intl.formatMessage(messages.languageSelect)}
                                onChange={(evt) => { this.props.onChangeAgentData('language', evt.target.value) }}
                                margin='normal'
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={intl.formatMessage(messages.requiredField)}
                            >
                                {
                                    settings.agentLanguages.map((language) => {
                                        return (
                                            <MenuItem key={language.value} value={language.value}>
                                                {language.text}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                        <TextField
                            select
                            id='name'
                            value={agent.timezone}
                            label={intl.formatMessage(messages.timezoneSelect)}
                            onChange={(evt) => { this.props.onChangeAgentData('timezone', evt.target.value) }}
                            margin='normal'
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            helperText={intl.formatMessage(messages.requiredField)}
                        >
                            {
                                this.props.settings.timezones.map((timezone) => {
                                    return (
                                        <MenuItem key={timezone} value={timezone}>
                                            {timezone}
                                        </MenuItem>
                                    )
                                })
                            }
                        </TextField>
                        </Grid>
                    </Grid>
                    {
                        this.props.agent.multiDomain ?
                        <Grid container spacing={24} item xs={12}>
                            <Grid item lg={4} md={10} sm={9} xs={8}>
                                <Typography className={classes.sliderLabel} id='domainClassifierThreshold'>
                                    <FormattedMessage {...messages.sliderDomainRecognitionThresholdLabel} />
                                </Typography>
                                <Slider
                                    value={agent.domainClassifierThreshold}
                                    min={0}
                                    max={100}
                                    step={1}
                                    aria-labelledby='domainClassifierThreshold'
                                    onChange={(evt, value) => { this.props.onChangeDomainClassifierThreshold(value) }} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={3} xs={4}>
                            <TextField
                                id='name'
                                margin='normal'
                                value={agent.domainClassifierThreshold}
                                onChange={(evt) => {
                                    evt.target.value === '' ?
                                    this.props.onChangeDomainClassifierThreshold(0) :
                                    (evt.target.value <= 100 && evt.target.value >= 0 ?
                                        this.props.onChangeDomainClassifierThreshold(evt.target.value) :
                                        false) }}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    style: {
                                        textAlign: 'center'
                                    },
                                    min: 0,
                                    max: 100,
                                    step: 1
                                }}
                                className={classes.sliderTextField}
                                helperText={intl.formatMessage(messages.requiredField)}
                                type='number'
                            />
                            </Grid>
                        </Grid> :
                        null
                    }
                    <Grid container spacing={24} item xs={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            {/*<div style={{display: 'inline'}}>
                                <img style={{
                                height: '15px',
                                width: '20px',
                                transform: 'translate(-52%,409%)',
                                backgroundColor: '#fff'
                                }} src={openingQuotes}/>
                            </div>*/}
                            <TextField
                                id='newFallbackResponses'
                                label={intl.formatMessage(messages.fallbackTextField)}
                                placeholder={intl.formatMessage(messages.fallbackTextFieldPlaceholder)}
                                onKeyPress={(ev) => {
                                    if (ev.key === 'Enter') {
                                        ev.preventDefault();
                                        this.props.onAddFallbackResponse(ev.target.value)
                                        ev.target.value = '';
                                    }
                                }}
                                margin='normal'
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={intl.formatMessage(messages.fallbackHelperText)}
                            />
                            {/*<div style={{display: 'inline'}}>
                                <img style={{
                                display: 'inline',
                                height: '20px',
                                width: '20px',
                                position: 'absolute',
                                transform: 'translate(-56%,207%)',
                                backgroundColor: '#fff',
                                padding: '5px'
                                }} src={closingQuotes}/>
                            </div>*/}
                            {agent.fallbackResponses.length > 0 ?
                                <Table className={classes.table}>
                                    <TableBody>
                                        {agent.fallbackResponses.map((fallbackResponse, index) => {
                                            return (
                                            <TableRow key={`${fallbackResponse}_${index}`}>
                                                <TableCell>
                                                    {fallbackResponse}
                                                </TableCell>
                                                <TableCell className={classes.deleteCell}>
                                                    <img onClick={() => { this.props.onDeleteFallbackResponse(index) }} className={classes.deleteIcon} src={trashIcon} />
                                                </TableCell>
                                            </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table> :
                                null
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

AgentDataForm.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    onChangeAgentData: PropTypes.func.isRequired,
    onChangeAgentName: PropTypes.func.isRequired,
    onChangeDomainClassifierThreshold: PropTypes.func.isRequired,
    onAddFallbackResponse: PropTypes.func.isRequired,
    onDeleteFallbackResponse: PropTypes.func.isRequired,
    agent: PropTypes.object,
    settings: PropTypes.object
};

export default injectIntl(withStyles(styles)(AgentDataForm));