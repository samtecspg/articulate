import React, { Fragment } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Popover, Grid, Input, TextField, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { includes } from 'lodash';

import searchIcon from '../../images/search-icon.svg';
import filterIcon from '../../images/filter-icon.svg';
import blackFilterIcon from '../../images/filter-black-icon.svg';
import messages from './messages';

const styles = {

    filterIcon: {
        display: 'inline',
        paddingRight: '10px',
        height: '20px',
        cursor: 'pointer',
        marginTop: '15px'
    },
    popover: {
        borderColor: '#4E4E4E',
        borderRight: 'none'
    },
    mainGrid: {
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
    },
    searchImageGrid: {
        borderColor: '#4E4E4E',
        borderRight: 'none',
        borderTop: 'none',
        borderLeft: 'none',
        border: 'solid 1px',
    },
    searchImage: {
        width: '50%',
        height: '50%',
        marginLeft: '10px'
    },
    textFilter: {
        height: '100%',
        width: '100%',
        borderColor: '#4E4E4E',
        border: 'solid 1px',
        borderRadius: '0%',
        borderRight: 'none',
        borderLeft: 'none',
        borderTop: 'none'
    },
    textFilterInput: {
        border: 'none',
        opacity: '100%',
        marginLeft: '-8px'
    },
    dropDown: {
        marginTop: '-25px',
        marginBottom: '-26px'
    },
    dropDownInput: {
        borderRadius: '0%',
        borderRight: 'none',
        borderTop: 'none',
        borderColor: '#4E4E4E',
        height: '100%',
        color: '#A2A7B1',
        marginLeft: '40px',
        '&:focus': {
            borderRadius: '0%',
            borderRight: 'none',
            borderTop: 'none',
            borderColor: '#4E4E4E',
            height: '100%',
            color: '#A2A7B1',
            marginLeft: '40px'
        }
    },
    dropDownMainOption: {
        '&:hover': {
            textDecoration: 'none',
            backgroundColor: '#fff',
        },
        minWidth: '335px',
        borderBottom: '1px solid #4e4e4e',
        position: 'relative',
        bottom: '8px',
        cursor: 'default',
        padding: '14px'
    },
    chipBackgroundContainer: {
        cursor: 'pointer',
        margin: '0px 5px 10px 5px',
        fontSize: '12pt',
        padding: '4px 14px 4px 14px',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '50px',
        width: 'max-content',
        backgroundColor: '#ffffff',
        border: 'solid 1px',
    },
    chipBackgroundContainerSelected: {
        cursor: 'pointer',
        margin: '0px 5px 10px 5px',
        fontSize: '12px',
        padding: '4px 14px 4px 14px',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '50px',
        width: 'max-content',
        backgroundColor: '#4e4e4e',
        border: 'solid 1px',
    },
    chipLabel: {
        textDecoration: 'none',
        color: '#4e4e4e',
        fontFamily: 'Montserrat',
        fontSize: '14pt',
        marginBottom: '2px',
        display: 'inline-block'
    },
    chipLabelSelected: {
        textDecoration: 'none',
        color: '#ffffff',
        fontFamily: 'Montserrat',
        fontSize: '14pt',
        marginBottom: '2px',
        display: 'inline-block'
    },
    chipLabelSelectedX: {
        textDecoration: 'none',
        color: '#ffffff',
        fontFamily: 'Montserrat',
        fontSize: '10pt',
        display: 'inline-block',
        marginLeft: '5px'
    },
    filterNamesLabels: {
        color: '#979797',
        fontSize: '12pt',
        paddingTop: '16px',
        paddingLeft: '16px',
        display: 'inline-block',
        fontFamily: 'Montserrat',
    },
    numberFiltersAppliedLabel: {
        textDecoration: 'underline',
        color: '#4e4e4e',
        fontFamily: 'Montserrat',
        fontSize: '10pt',
        marginRight: '5px'
    },
    numberFiltersAppliedLabelX: {
        color: '#4e4e4e',
        fontFamily: 'Montserrat',
        fontSize: '10pt',
        fontWeight: 'Bold',
        cursor: 'pointer'
    }
};

/* eslint-disable react/prefer-stateless-function */
export class PopoverFilter extends React.Component {

    constructor(props) {
        super(props);

        this.initialState = {
            popOverAnchorEl: null,
            textFilterValue: '',
            dropDownValuePicked: this.props.dropDownMainOptionLabel,
            chipValuesPicked: [],
            numberFiltersApplied: 0,
        };
        this.state = this.initialState;

        this.handleChipClick = this.handleChipClick.bind(this);
        this.handleDropDownValuePicked = this.handleDropDownValuePicked.bind(this);
        this.handleFiltersChange = this.handleFiltersChange.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async handleDropDownValuePicked(value) {
        await this.setStateAsync({ dropDownValuePicked: value });
    }

    async handleTextFilterValueChanged(value) {
        await this.setStateAsync({ textFilterValue: value });
    }

    async handleChipClick(value) {
        if (this.chipIsSelected(value)) {
            await this.setStateAsync({
                chipValuesPicked: this.state.chipValuesPicked.filter(function (valueToRemove) {
                    return value !== valueToRemove
                })
            });
        } else {
            await this.setStateAsync(prevState => ({
                chipValuesPicked: [...prevState.chipValuesPicked, value]
            })
            )
        }
    }

    chipIsSelected(value) {
        return includes(this.state.chipValuesPicked, value);
    }

    async handleFiltersChange() {
        const { dropDownValuePicked, chipValuesPicked, textFilterValue } = this.state;
        this.props.processSelectedFilters(dropDownValuePicked, chipValuesPicked, textFilterValue);
        await this.updateFilterNumber();
    }

    async updateFilterNumber() {
        var numFilters = 0;
        if (this.state.dropDownValuePicked != this.props.dropDownMainOptionLabel) {
            numFilters++;
        }
        numFilters += this.state.chipValuesPicked.length;
        if (this.state.textFilterValue != '') {
            numFilters++;
        }
        await this.setStateAsync({ numberFiltersApplied: numFilters });
        this.props.updateNumberFiltersApplied(numFilters);
    }

    handlePopoverClose = () => {
        this.setState({
            popOverAnchorEl: null
        });
    };

    async resetState() {
        await this.setStateAsync(this.initialState);
        await this.handleFiltersChange();
    }

    componentWillUnmount() {
        const { dropDownValuePicked, chipValuesPicked, textFilterValue } = this.initialState
        this.props.processSelectedFilters(dropDownValuePicked, chipValuesPicked, textFilterValue);
        this.props.updateNumberFiltersApplied(0);
    }

    render() {
        const { classes, intl } = this.props;
        return (
            <React.Fragment>
                {this.state.numberFiltersApplied > 0 &&
                    <React.Fragment>
                        <Grid
                            style={{ marginRight: '14px', marginTop: '15px' }}
                        >
                            <span
                                className={classes.numberFiltersAppliedLabel}
                            >
                                {this.state.numberFiltersApplied} {this.state.numberFiltersApplied > 1 ?
                                    intl.formatMessage(messages.filters) :
                                    intl.formatMessage(messages.filter)}
                            </span>
                            <a
                                onClick={
                                    this.resetState
                                }
                            >
                                <span className={classes.numberFiltersAppliedLabelX}>
                                    x
                                </span>
                            </a>
                        </Grid>
                    </React.Fragment>
                }
                <Popover
                    anchorEl={this.state.popOverAnchorEl}
                    open={Boolean(this.state.popOverAnchorEl)}
                    onClose={this.handlePopoverClose}
                    anchorOrigin={this.props.anchorOrigin}
                    transformOrigin={this.props.transformOrigin}
                    className={classes.popover}
                    elevation={3}
                >
                    <Grid
                        className={classes.mainGrid}>
                        <Grid
                            container
                            item xs={12}
                            direction="row"
                            alignItems="stretch">
                            <Grid
                                item xs={1}
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                                className={classes.searchImageGrid}
                            >
                                <img
                                    src={searchIcon}
                                    className={classes.searchImage} />
                            </Grid>
                            <Grid
                                item xs={7}
                                container
                                direction="row"
                                alignItems="stretch"
                                justify="center"
                            >
                                <Input
                                    className={classes.textFilter}
                                    inputProps={{
                                        className: classes.textFilterInput
                                    }}
                                    placeholder={this.props.textFilterPlaceholder}
                                    onKeyPress={async ev => {
                                        if (ev.key === 'Enter' && ev.target.value.trim() !== '') {
                                            ev.preventDefault();
                                            await this.handleTextFilterValueChanged(ev.target.value);
                                            await this.handleFiltersChange();
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid
                                container
                                item xs={4}
                                alignItems="stretch"
                                style={{
                                    border: 'solid 1px',
                                    borderColor: '#4e4e4e',
                                    borderLeft: 'none',
                                    borderRight: 'none',
                                    borderTop: 'none'
                                }}
                            >
                                <TextField
                                    select
                                    fullWidth
                                    margin="normal"
                                    className={classes.dropDown}
                                    inputProps={{
                                        className: classes.dropDownInput
                                    }}
                                    value={this.state.dropDownValuePicked}
                                    onChange={async ev => {
                                        await this.handleDropDownValuePicked(ev.target.value)
                                        await this.handleFiltersChange();
                                    }}
                                >
                                    <MenuItem key={this.props.dropDownMainOptionLabel} value={this.props.dropDownMainOptionLabel}
                                        className={classes.dropDownMainOption}
                                    >
                                        {this.props.dropDownMainOptionLabel}
                                    </MenuItem>
                                    {
                                        this.props.dropDownValues.map(option => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            </Grid>
                        </Grid>
                        <span
                            className={classes.filterNamesLabels}
                        >
                            <FormattedMessage {...messages.filterApplied} />
                        </span>
                        <br />
                        {this.state.textFilterValue != '' &&
                            <Grid style={{ 'marginLeft': '10px' }}>
                                <div
                                    key={this.state.textFilterValue}
                                    className={classes.chipBackgroundContainerSelected}
                                >
                                    <span
                                        className={classes.chipLabelSelected}
                                    >
                                        {this.state.textFilterValue}
                                    </span>
                                    <a
                                        onClick={async () => {
                                            await this.handleTextFilterValueChanged('');
                                            await this.handleFiltersChange();
                                        }}
                                    >
                                        <span className={classes.chipLabelSelectedX}>x</span>
                                    </a>
                                </div>
                            </Grid>
                        }
                        <span
                            className={classes.filterNamesLabels}
                        >
                            {this.props.chipsFilterLabel}
                        </span>
                        <br />
                        <Grid style={{ marginLeft: '10px', marginBottom: '40px' }}>
                            {this.props.chipValues.map(data => {
                                return (
                                    <div
                                        key={data}
                                        className={this.chipIsSelected(data) ? classes.chipBackgroundContainerSelected : classes.chipBackgroundContainer}
                                        onClick={async () => {
                                            await this.handleChipClick(data);
                                            await this.handleFiltersChange();
                                        }}
                                    >
                                        <span
                                            className={this.chipIsSelected(data) ? classes.chipLabelSelected : classes.chipLabel}
                                        >
                                            {data}
                                        </span>
                                    </div>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Popover >
                <Grid>
                    <img className={classes.filterIcon} src={this.state.numberFiltersApplied > 0 ? blackFilterIcon : filterIcon}
                        onClick={ev => {
                            this.setState({
                                popOverAnchorEl: ev.currentTarget
                            })
                        }}
                    />
                </Grid>
            </React.Fragment>
        );
    }
}

PopoverFilter.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    anchorOrigin: PropTypes.object,
    transformOrigin: PropTypes.object,
    dropDownValues: PropTypes.array.isRequired,
    chipValues: PropTypes.array.isRequired,
    textFilterPlaceholder: PropTypes.string,
    dropDownMainOptionLabel: PropTypes.string,
    chipsFilterLabel: PropTypes.string,
    processSelectedFilters: PropTypes.func.isRequired,
    updateNumberFiltersApplied: PropTypes.func.isRequired,
};

export default injectIntl(withStyles(styles)(PopoverFilter));