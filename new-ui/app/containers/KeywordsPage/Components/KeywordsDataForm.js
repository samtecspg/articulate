import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, TextField, Table, TableBody, TableRow, TableCell, Typography, Button, MenuItem  } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';
import trashIcon from '../../../images/trash-icon.svg';

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
    keywordsLabel: {
        marginTop: '20px',
        marginBottom: '10px',
        color: '#a2a7b1',
        fontWeight: 400,
        fontSize: '12px'
    },
    pagesLabel: {
        color: '#a2a7b1',
        display: 'inline',
        padding: '5px',
        top: '39px',
        position: 'relative'
    },
    pageControl: {
        webkitTouchCallout: 'none',
        webkitUserSelect: 'none',
        khtmlUserSelect: 'none',
        mozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
    },
    pageSubControl: {
        display: 'inline'
    },
    pageNumberSubControl: {
        display: 'inline',
        float: 'right'
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
        padding: '5px',
        top: '39px',
        position: 'relative'
    },
    pageCursorsDisabled: {
        display: 'inline',
        padding: '5px',
        color: '#a2a7b1',
        top: '39px',
        position: 'relative'
    },
    pageSizeLabels: {
        display: 'inline',
        margin: '0px 5px',
        top: '39px',
        position: 'relative'
    },
    keywordLink: {
        textDecoration: 'none',
        color: '#4e4e4e'
    },
    dot: {
      marginRight: 5,
      height: 10,
      width: 10,
      borderRadius: '50%',
      display: 'inline-block',
    }
}

/* eslint-disable react/prefer-stateless-function */
class KeywordsDataForm extends React.Component {

    constructor(){
        super();
    }

    state = {
        agentNameError: false,
    }

    render(){
        const { classes, keywords } = this.props;
        return (
            <Grid className={classes.formContainer} container item xs={12}>
                <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
                    <Grid container spacing={24} item xs={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Button
                                variant='contained'
                                onClick={() => {this.props.onCreateKeyword(`/agent/${this.props.agentId}/keyword/create`)}}
                            >
                                <FormattedMessage {...messages.create} />
                            </Button>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            {keywords.length > 0 ?
                                <Grid container>
                                    <Typography className={classes.keywordsLabel}>
                                        <FormattedMessage {...messages.keywordsLabel} />
                                    </Typography>
                                    <Table>
                                        <TableBody>
                                            {keywords.map((keyword, index) => {
                                                return (
                                                <TableRow key={`${keyword}_${index}`}>
                                                    <TableCell>
                                                        <Link className={classes.keywordLink} to={`/agent/${this.props.agentId}/keyword/${keyword.id}`}>
                                                            <span style={{backgroundColor: keyword.uiColor}} className={classes.dot}></span>
                                                            <span>{keyword.keywordName}</span>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className={classes.deleteCell}>
                                                        <img onClick={() => { this.props.onDeleteKeyword(keyword.id) }} className={classes.deleteIcon} src={trashIcon} />
                                                    </TableCell>
                                                </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    <Grid className={classes.pageControl} item xs={12}>
                                        <Grid className={classes.pageSubControl}>
                                            <Typography className={classes.pageSizeLabels}>
                                                <FormattedMessage {...messages.show} />
                                            </Typography>
                                            <TextField
                                                select
                                                className={classes.pageTextfield}
                                                id='pageSize'
                                                value={this.props.pageSize}
                                                onChange={(evt) => { this.props.changePageSize(evt.target.value) }}
                                                margin='normal'
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            >
                                                <MenuItem key={5} value={5}>
                                                    5
                                                </MenuItem>
                                                <MenuItem key={10} value={10}>
                                                    10
                                                </MenuItem>
                                                <MenuItem key={25} value={25}>
                                                    25
                                                </MenuItem>
                                                <MenuItem key={50} value={50}>
                                                    50
                                                </MenuItem>
                                            </TextField>
                                            <Typography className={classes.pageSizeLabels}>
                                                <FormattedMessage {...messages.entries} />
                                            </Typography>
                                        </Grid>
                                        <Grid className={classes.pageNumberSubControl}>
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

KeywordsDataForm.propTypes = {
    classes: PropTypes.object.isRequired,
    keywords: PropTypes.array,
    agentId: PropTypes.string,
    onDeleteKeyword: PropTypes.func.isRequired,
    onCreateKeyword: PropTypes.func.isRequired,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    numberOfPages: PropTypes.number,
    changePage: PropTypes.func,
    changePageSize: PropTypes.func,
    movePageBack: PropTypes.func,
    movePageForward: PropTypes.func,
};

export default withStyles(styles)(KeywordsDataForm);