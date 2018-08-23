import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, TextField, Table, TableBody, TableRow, TableCell, Typography  } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

import SayingRow from './SayingRow';

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
    deleteCell: {
        width: '20px'
    },
    deleteIcon: {
        '&:hover': {
            filter: 'invert(0)'
        },
        filter: 'invert(1)',
        cursor: 'pointer'
    },
    highlightLabel: {
        marginTop: '20px',
        marginBottom: '10px',
        color: '#a2a7b1',
        fontWeight: 400,
        fontSize: '12px'
    },
    pagesLabel: {
        color: '#a2a7b1',
        display: 'inline',
        padding: '5px'
    },
    pageControl: {
        direction: 'rtl',
        webkitTouchCallout: 'none',
        webkitUserSelect: 'none',
        khtmlUserSelect: 'none',
        mozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
    },
    pageTextfield: {
        width: '75px',
        margin: '5px',
        height: 0,
        marginTop: '0px !important',
        direction: 'ltr'
    },
    pageCursors: {
        cursor: 'pointer',
        display: 'inline',
        padding: '5px'
    },
    pageCursorsDisabled: {
        display: 'inline',
        padding: '5px',
        color: '#a2a7b1'
    }
}

/* eslint-disable react/prefer-stateless-function */
class SayingsDataForm extends React.Component {

    constructor(){
        super();
    }

    render(){
        const { classes, intl, sayings } = this.props;
        return (
            <Grid className={classes.formContainer} container item xs={12}>
                <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
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
                                icon={<img src={trashIcon} />}
                                id='newSaying'
                                label={intl.formatMessage(messages.sayingTextField)}
                                placeholder={intl.formatMessage(messages.sayingTextFieldPlaceholder)}
                                onKeyPress={(ev) => {
                                    if (ev.key === 'Enter') {
                                        ev.preventDefault();
                                        this.props.onAddSaying(ev.target.value)
                                        ev.target.value = '';
                                    }
                                }}
                                margin='normal'
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                            {sayings.length > 0 ?
                                <Grid container>
                                    <Typography className={classes.highlightLabel}>
                                        <FormattedMessage {...messages.highlightTooltip} />
                                    </Typography>
                                    <Table>
                                        <TableBody>
                                            {sayings.map((saying, index) => {
                                                return (
                                                <TableRow key={`${saying}_${index}`}>
                                                    <TableCell>
                                                        <SayingRow
                                                            agentId={this.props.agentId}
                                                            saying={saying}
                                                            onDeleteAction={this.props.onDeleteAction}
                                                            agentKeywords={this.props.agentKeywords}
                                                            agentActions={this.props.agentActions}
                                                            onTagKeyword={this.props.onTagKeyword}
                                                            onUntagKeyword={this.props.onUntagKeyword}
                                                            onAddAction={this.props.onAddAction}
                                                            onGoToUrl={this.props.onGoToUrl}
                                                            onSendSayingToAction={this.props.onSendSayingToAction}
                                                        />
                                                    </TableCell>
                                                    <TableCell className={classes.deleteCell}>
                                                        <img onClick={() => { this.props.onDeleteSaying(saying.id) }} className={classes.deleteIcon} src={trashIcon} />
                                                    </TableCell>
                                                </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    <Grid className={classes.pageControl} item xs={12}>
                                        <Typography onClick={this.props.currentPage > 1 ? this.props.movePageBack : null} className={this.props.currentPage > 1 ? classes.pageCursors : classes.pageCursorsDisabled}>
                                            <FormattedMessage {...messages.backPage} />
                                        </Typography>
                                        <TextField
                                            id='page'
                                            margin='normal'
                                            value={this.props.currentPage}
                                            onChange={(evt) => {
                                                evt.target.value === '' ?
                                                this.props.changePage(0) :
                                                (evt.target.value <= this.props.numberOfPages && evt.target.value >= 0 ?
                                                    this.props.changePage(evt.target.value) :
                                                    false) }}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                style: {
                                                    textAlign: 'center'
                                                },
                                                min: 1,
                                                max: this.props.numberOfPages,
                                                step: 1
                                            }}
                                            className={classes.pageTextfield}
                                            type='number'
                                        />
                                        <Typography className={classes.pagesLabel}>
                                            / {this.props.numberOfPages}
                                        </Typography>
                                        <Typography onClick={this.props.currentPage < this.props.numberOfPages ? this.props.movePageForward : null} className={this.props.currentPage < this.props.numberOfPages ? classes.pageCursors : classes.pageCursorsDisabled}>
                                            <FormattedMessage {...messages.nextPage} />
                                        </Typography>
                                    </Grid>
                                </Grid> :
                                null
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

SayingsDataForm.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    sayings: PropTypes.array,
    agentId: PropTypes.number,
    agentKeywords: PropTypes.array,
    agentActions: PropTypes.array,
    onAddSaying: PropTypes.func.isRequired,
    onDeleteSaying: PropTypes.func.isRequired,
    onDeleteAction: PropTypes.func.isRequired,
    onTagKeyword: PropTypes.func,
    onUntagKeyword: PropTypes.func,
    onAddAction: PropTypes.func,
    onGoToUrl: PropTypes.func,
    onSendSayingToAction: PropTypes.func,
    currentPage: PropTypes.number,
    numberOfPages: PropTypes.number,
    changePage: PropTypes.func,
    movePageBack: PropTypes.func,
    movePageForward: PropTypes.func,
};

export default injectIntl(withStyles(styles)(SayingsDataForm));