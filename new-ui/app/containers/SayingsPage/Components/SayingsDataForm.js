import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import {
    Grid,
    TextField,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    MenuItem,
    Button,
    Input,
    InputAdornment,
    Select
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

import SayingRow from './SayingRow';

import trashIcon from '../../../images/trash-icon.svg';
import searchIcon from '../../../images/search-icon.svg';
import pencilIcon from '../../../images/pencil-icon.svg';
import clearIcon from '../../../images/clear-icon.svg';
import addActionIcon from '../../../images/add-action-icon.svg';

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
        marginTop: '5px',
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
    },
    categorySelect: {
        '&:hover': {
            backgroundColor: '#fff',
            borderTopRightRadius: '0px',
            borderBottomRightRadius: '0px',
            borderRight: 'none',
        },
        '&:focus': {
            borderTopRightRadius: '0px',
            borderBottomRightRadius: '0px',
            borderRight: 'none',
        },
        backgroundColor: '#f6f7f8',
        borderTopRightRadius: '0px',
        borderBottomRightRadius: '0px',
        borderRight: 'none',
    },
    sayingInput: {
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
    },
    searchCategoryContainer: {
        minWidth: '288px',
        borderBottom: '1px solid #4e4e4e'
    },
    searchCategoryField: {
      width: '200px',
      paddingLeft: '5px',
      fontSize: '14px'
    },
    addCategoryButton: {
        width: '62px',
        height: '26px',
    },
    categoryDataContainer: {
        display: 'inline',
    },
    editCategoryIcon: {
        '&:hover': {
            filter: 'invert(1)'
        },
        position: 'relative',
        top: '2px',
        marginLeft: '10px',
    },
    clearIconContainer: {
        display: 'inline',
        width: '100px'
    },
    clearIcon: {
        position: 'relative',
        top: '15px',
        left: '60px'
    },
    sayingInputContainer: {
        border: '1px solid #a2a7b1',
        borderTopRightRadius: '5px',
        borderBottomRightRadius: '5px',
    },
    addActionIcon: {
        cursor: 'pointer',
        marginTop: '15px',
        marginRight: '10px',
    },
    actionBackgroundContainer: {
        '&:hover': {
            backgroundColor: '#4e4e4e',
            color: '#fff',
        },
        cursor: 'pointer',
        margin: '0px 5px 0px 5px',
        fontSize: '12px',
        padding: '4px 8px 4px 10px',
        backgroundColor: '#e2e5e7',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '5px',
        marginTop: '15px',
    },
    actionLabel: {
        textDecoration: 'none',
        color: 'inherit'
    },
    deleteActionX: {
        '&:hover': {
            fontWeight: 'bold'
        },
        paddingLeft: '5px',
        fontWeight: 300,
        cursor: 'pointer'
    },
}

/* eslint-disable react/prefer-stateless-function */
class SayingsDataForm extends React.Component {

    constructor(){
        super();
    }

    state = {
        filterInput: '',
        filteringDomains: false,
        categoriesDropdownOpen: false,
        errorDomain: false,
        openActions: false,
        anchorEl: null,
    }

    render(){
        const { classes, intl, sayings, domain } = this.props;
        return (
            <Grid className={classes.formContainer} container item xs={12}>
                <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
                    <Grid container item xs={12}>
                        <Grid item lg={2} md={2} sm={4} xs={4}>
                            <TextField
                                select
                                id='category'
                                value={domain}
                                label={intl.formatMessage(messages.categorySelect)}
                                onClick={
                                    () => {
                                        this.setState({
                                            categoriesDropdownOpen: !this.state.categoriesDropdownOpen,
                                        });
                                    }
                                }
                                onChange={(evt) => {
                                    if (['filter', 'create', 'no results'].indexOf(evt.target.value) === -1) {
                                        this.props.onSelectDomain(evt.target.value);
                                    }
                                }}
                                margin='normal'
                                fullWidth
                                inputProps={{
                                    className: classes.categorySelect
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={this.state.errorDomain ? intl.formatMessage(messages.requiredField) : ''}
                                error={this.state.errorDomain}
                            >
                                <MenuItem className={classes.searchCategoryContainer} value={'filter'}>
                                    <Grid container justify='flex-end'>
                                        <img src={searchIcon} />
                                        <Input
                                            inputProps={{
                                                style: {
                                                    border: 'none'
                                                }
                                            }}
                                            value={this.state.filterInput}
                                            onClick={(evt) => { evt.stopPropagation(); return 0; }}
                                            disableUnderline
                                            className={classes.searchCategoryField}
                                            onChange={(evt) => {
                                                this.setState({
                                                    filteringDomains: evt.target.value.length > 0,
                                                    filterInput: evt.target.value,
                                                });
                                                this.props.onSearchDomain(evt.target.value);
                                            }}
                                        />
                                        {
                                            this.state.filteringDomains ?
                                                <div className={classes.clearIconContainer}>
                                                    <img onClick={(evt) => {
                                                        evt.stopPropagation();
                                                        this.props.onSearchDomain('');
                                                        this.setState({
                                                            filteringDomains: false,
                                                            filterInput: '',
                                                        });
                                                        return 0;
                                                    }} className={classes.clearIcon} src={clearIcon} />
                                                </div>
                                            :
                                                <Button onClick={() => { this.props.onGoToUrl(`/agent/${this.props.agentId}/domain/create`); }} className={classes.addCategoryButton} variant='raised'>+ Add</Button>
                                        }
                                    </Grid>
                                </MenuItem>
                                {
                                    this.state.filteringDomains ?
                                        this.props.agentFilteredDomains.length > 0 ?
                                            this.props.agentFilteredDomains.map((filteredDomain, index) => {
                                                return (
                                                    <MenuItem key={`domain_${index}`} value={filteredDomain.id}>
                                                        <Grid container justify='space-between'>
                                                            <div className={classes.categoryDataContainer}>
                                                                <span>{filteredDomain.domainName}</span>
                                                            </div>
                                                            {
                                                                filteredDomain.id === domain && !this.state.categoriesDropdownOpen ?
                                                                null :
                                                                <div className={classes.categoryDataContainer}>
                                                                    <span>{filteredDomain.actionThreshold * 100}%</span>
                                                                    <img onClick={() => { this.props.onGoToUrl(`/agent/${this.props.agentId}/domain/${filteredDomain.id}`); }} className={classes.editCategoryIcon} src={pencilIcon} />
                                                                </div>
                                                            }
                                                        </Grid>
                                                    </MenuItem>
                                                )
                                            })
                                        :
                                            [<MenuItem key='no results' value='no results'>
                                                <span>No results</span>
                                            </MenuItem>,
                                            <MenuItem key='create' value='create'>
                                                <Button onClick={() => { this.props.onGoToUrl(`/agent/${this.props.agentId}/domain/create`); }} className={classes.addCategoryButton} variant='raised'>+ Add</Button>
                                            </MenuItem>]
                                    :
                                        this.props.agentDomains.map((agentDomain, index) => {
                                            return (
                                                <MenuItem key={`domain_${index}`} value={agentDomain.id}>
                                                    <Grid container justify='space-between'>
                                                        <div className={classes.categoryDataContainer}>
                                                            <span>{agentDomain.domainName}</span>
                                                        </div>
                                                        {
                                                            agentDomain.id === domain && !this.state.categoriesDropdownOpen ?
                                                            null :
                                                            <div className={classes.categoryDataContainer}>
                                                                <span>{agentDomain.actionThreshold * 100}%</span>
                                                                <img onClick={() => { this.props.onGoToUrl(`/agent/${this.props.agentId}/domain/${agentDomain.id}`); }} className={classes.editCategoryIcon} src={pencilIcon} />
                                                            </div>
                                                        }
                                                    </Grid>
                                                </MenuItem>
                                            )
                                        })
                                }
                            </TextField>
                        </Grid>
                        <Grid item lg={10} md={10} sm={8} xs={8}>
                            <TextField
                                id='newSaying'
                                label={intl.formatMessage(messages.sayingTextField)}
                                placeholder={intl.formatMessage(messages.sayingTextFieldPlaceholder)}
                                onKeyPress={(ev) => {
                                    if (ev.key === 'Enter') {
                                        if (!domain || domain === ''){
                                            this.setState({
                                                errorDomain: true,
                                            });
                                        }
                                        else {
                                            this.setState({
                                                errorDomain: false,
                                            });
                                            ev.preventDefault();
                                            this.props.onAddSaying(ev.target.value)
                                            ev.target.value = '';
                                        }
                                    }
                                }}
                                margin='normal'
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    className: classes.sayingInput,
                                    style: {
                                        border: 'none'
                                    }
                                }}
                                InputProps={{
                                    className: classes.sayingInputContainer,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {this.props.newSayingActions.map((action, index) => {
                                                let actionId = this.props.agentActions.filter((agentAction) => {
                                                    return agentAction.actionName === action;
                                                });
                                                actionId = actionId ? (Array.isArray(actionId) && actionId.length > 0 ? actionId[0].id : 2) : null;
                                                return (
                                                    <div key={`newSayingAction_${index}`} className={classes.actionBackgroundContainer}>
                                                        <span
                                                            className={classes.actionLabel}
                                                            onClick={() => {
                                                                this.props.onClearSayingToAction();
                                                                this.props.onGoToUrl(`/agent/${this.props.agentId}/action/${actionId}`)
                                                            }}
                                                        >{action}</span>
                                                        <a onClick={() => { this.props.onDeleteNewSayingAction(action) }} className={classes.deleteActionX}>x</a>
                                                    </div>
                                                )
                                            })}
                                            <img
                                                className={classes.addActionIcon}
                                                src={addActionIcon}
                                                onClick={(evt) => {
                                                    this.setState({
                                                        openActions: true,
                                                        anchorEl: evt.currentTarget,
                                                    });
                                                }}
                                            >
                                            </img>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Select
                                style={{
                                    display:'none',
                                }}
                                open={this.state.openActions}
                                onClose={() => {
                                    this.setState({
                                        openActions: false,
                                        anchorEl: null,
                                    });
                                }}
                                onOpen={() => {
                                    this.setState({
                                        openActions: true,
                                    });
                                }}
                                value={1}
                                onChange={(evt) => {
                                    this.setState({
                                        openActions: false,
                                        anchorEl: null,
                                    });
                                    if (evt.target.value === 'create'){
                                        this.props.onClearSayingToAction();
                                        this.props.onGoToUrl(`/agent/${this.props.agentId}/action/create`);
                                    }
                                    else{
                                        this.props.onAddNewSayingAction(evt.target.value);
                                    }
                                }}
                                MenuProps={{
                                    style:{
                                        minHeight: '300px',
                                        maxHeight: '300px',
                                    },
                                    anchorEl: this.state.anchorEl
                                }}
                            >
                                <MenuItem value='create'><FormattedMessage className={classes.newItem} {...messages.newAction}/></MenuItem>
                                {
                                    this.props.agentActions.map((action) => {
                                        return (
                                            this.props.newSayingActions.indexOf(action.actionName) === -1 ?
                                            <MenuItem style={{width: '200px'}} key={`action_${action.id}`} value={action.actionName}>{action.actionName}</MenuItem> :
                                            null
                                        )
                                    })
                                }
                            </Select>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
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
                                                    agentDomains={this.props.agentDomains}
                                                    onTagKeyword={this.props.onTagKeyword}
                                                    onUntagKeyword={this.props.onUntagKeyword}
                                                    onAddAction={this.props.onAddAction}
                                                    onGoToUrl={this.props.onGoToUrl}
                                                    onSendSayingToAction={this.props.onSendSayingToAction}
                                                />
                                            </TableCell>
                                            <TableCell className={classes.deleteCell}>
                                                <img onClick={() => { this.props.onDeleteSaying(saying.id, saying.domain) }} className={classes.deleteIcon} src={trashIcon} />
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
        );
    }
}

SayingsDataForm.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    sayings: PropTypes.array,
    agentId: PropTypes.string,
    agentKeywords: PropTypes.array,
    agentActions: PropTypes.array,
    agentDomains: PropTypes.array,
    agentFilteredDomains: PropTypes.array,
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
    onSelectDomain: PropTypes.func,
    domain: PropTypes.string,
    onSearchDomain: PropTypes.func,
    newSayingActions: PropTypes.array,
    onAddNewSayingAction: PropTypes.func,
    onDeleteNewSayingAction: PropTypes.func,
    onClearSayingToAction: PropTypes.func,
};

export default injectIntl(withStyles(styles)(SayingsDataForm));