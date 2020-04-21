import React, { Fragment } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Popover, Grid, Input, TextField, MenuItem, InputAdornment, FormControl, FormGroup, FormControlLabel, Checkbox, Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { includes } from 'lodash';

import searchIcon from '../../images/search-icon.svg';
import filterIcon from '../../images/filter-icon.svg';
import blackFilterIcon from '../../images/filter-black-icon.svg';
import hyphenIcon from '../../images/hyphen-icon.svg';
import xIcon from '../../images/x-icon2.svg';
import checkboxCheckedIcon from '../../images/checkbox-checked-icon.svg';
import checkboxUncheckedIcon from '../../images/checkbox-unchecked-icon.svg';
import messages from './messages';
import ChipGroup from './components/ChipGroup';

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
        width: '600px',
        display: 'flex',
        flexDirection: 'column',
    },
    searchImageGrid: {
        borderRight: 'none',
        borderLeft: 'none',
        borderTop: 'none',
        border: 'solid 1px',
        height: '50px'
    },
    searchImage: {
        padding: '12px',
        height: '100%',
        width: '100%'

    },
    textFilter: {
        height: '100%',
        width: '100%',
        border: 'solid 1px',
        borderRadius: '0%',
        borderRight: 'none',
        borderLeft: 'none',
        borderTop: 'none',
    },
    textFilterInput: {
        border: 'none',
        opacity: '100%',
        marginLeft: '-8px'
    },
    dropDown: {
        marginTop: '0px',
        marginBottom: '0px',
        paddingLeft: '16px',
        paddingRight: '16px'
    },
    dropDownInput: {
        borderRadius: '5px',
        borderColor: '#A2A7B1',
        height: '100%',
        color: '#A2A7B1',
        '&:focus': {
            borderRadius: '5px',
            borderColor: '#A2A7B1',
            height: '100%',
            color: '#A2A7B1',
        }
    },
    dropDownMainOption: {
        '&:hover': {
            textDecoration: 'none',
            backgroundColor: '#fff',
        },
        minWidth: '335px',
        borderBottom: '1px solid #4e4e4e',
        cursor: 'default',
    },

    chipBackgroundContainer: {
        cursor: 'pointer',
        margin: '5px 0px 5px 10px',
        fontSize: '12px',
        padding: '4px 8px 4px 10px',
        backgroundColor: '#e2e5e7',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '5px',
    },
    chipBackgroundContainerSelected: {
        cursor: 'pointer',
        margin: '5px 5px 5px 5px',
        fontSize: '12px',
        padding: '4px 8px 4px 10px',
        backgroundColor: '#e2e5e7',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '5px',
        backgroundColor: '#4e4e4e',
        color: '#fff',
    },
    chipLabel: {
        textDecoration: 'none',
        fontSize: '12px',
        color: '#4e4e4e',
        fontFamily: 'Montserrat',
        marginBottom: '2px',
        display: 'inline-block'
    },
    chipLabelSelected: {
        textDecoration: 'none',
        color: '#ffffff',
        fontFamily: 'Montserrat',
        fontSize: '12px',
        marginBottom: '2px',
        display: 'inline-block'
    },
    chipLabelSelectedX: {
        textDecoration: 'none',
        color: '#ffffff',
        fontFamily: 'Montserrat',
        fontSize: '12px',
        display: 'inline-block',
        marginLeft: '5px'
    },
    filterNamesLabels: {
        color: '#A2A7B1',
        fontSize: '12px',
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
    },
    clearAllFiltersLabel: {
        textDecoration: 'underline',
        color: '#4e4e4e',
        fontFamily: 'Montserrat',
        fontSize: '10pt',
        marginRight: '5px',
        paddingTop: '20px',
        display: 'inline-block'
    },
    clearAllFiltersLabelX: {
        color: '#4e4e4e',
        fontFamily: 'Montserrat',
        fontSize: '10pt',
        fontWeight: 'Bold',
        cursor: 'pointer',
        paddingTop: '16px',
        display: 'inline-block'
    },
    minInput: {
        color: '#979797',
        fontSize: '12pt',
        fontFamily: 'Montserrat',
        marginRight: '10px'
    },
    maxInput: {
        color: '#979797',
        fontSize: '12pt',
        fontFamily: 'Montserrat',
        marginLeft: '10px',
    },
    hyphenImage: {
        marginTop: '30px'
    },
    minMaxContainer: {
        border: '1px solid #a2a7b1',
        borderRadius: '5px'
    },
    minMaxPercentage: {
        paddingRight: '10px',
        fontSize: '14px',
        focolor: '#C5CBD8',
    },
    titleLabel: {
        color: '#4E4E4E',
        fontSize: '18px',
        paddingTop: '16px',
        paddingLeft: '16px',
        display: 'inline-block',
        fontFamily: 'Montserrat',
    },
    xIconImage: {
        paddingTop: '16px',
        marginRight: '10px',
        cursor: 'pointer'
    },
    filtersDescriptionLabel: {
        color: '#4E4E4E',
        fontSize: '14px',
        paddingLeft: '16px',
        display: 'inline-block',
        fontFamily: 'Montserrat',
    },
    minMaxWarning: {
        color: '#A2A7B1',
        fontSize: '10px',
        fontWeight: '100',
        fontFamily: 'Montserrat',
        paddingLeft: '16px',
        marginBottom: '16px'
    },
    headerGrid: {
        backgroundColor: '#F6F7F8',
        borderBottom: 'solid 1px',
        paddingBottom: '16px'
    },
    formControlLabel: {
        marginRight: '20px'
    },
    checkboxLabel: {
        color: '#A2A7B1',
        fontSize: '12px',
        fontFamily: 'Montserrat',
    },
    justMaxLabel: {
        color: '#A2A7B1',
        fontSize: '12px',
        fontFamily: 'Montserrat',
        marginTop: '15px',
        display: 'inline-block'
    },
    checkboxImage: {
        marginLeft: '-5px',
        marginTop: '-5px'
    },
    justMaxInput: {
        color: '#979797',
        fontSize: '12pt',
        fontFamily: 'Montserrat',
        marginRight: '10px',
        marginTop: '-15px'
    },
};

/* eslint-disable react/prefer-stateless-function */
export class PopoverFilter extends React.Component {

    constructor(props) {
        super(props);

        this.initialState = {
            popOverAnchorEl: null,
        };
        this.state = this.initialState;

        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
        this.checkboxIsSelected = this.checkboxIsSelected.bind(this);
        this.handleDropDownValuePicked = this.handleDropDownValuePicked.bind(this);
        this.handleCurrentTextFilterValueChange = this.handleCurrentTextFilterValueChange.bind(this);
        this.handleFiltersChange = this.handleFiltersChange.bind(this);
        this.handleMinChange = this.handleMinChange.bind(this);
        this.handleMaxChange = this.handleMaxChange.bind(this);
        this.handleMinValidation = this.handleMinValidation.bind(this);
        this.handleMaxValidation = this.handleMaxValidation.bind(this);
        this.handleJustMaxChange = this.handleJustMaxChange.bind(this);
        this.handleJustMaxValidation = this.handleJustMaxValidation.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async handleDropDownValuePicked(value) {
        await this.props.onChangeDropDownValuePicked(value);
    }

    async handleTextFilterValueChanged(value) {
        await this.props.onChangeCurrentTextFilterValue(value);
    }

    async handleCurrentTextFilterValueChange(newValue) {
        await this.setStateAsync({
            currentTextFilterValue: newValue
        })
    }

    async handleCheckboxClick(value) {
        if (this.checkboxIsSelected(value)) {
            await this.props.onChangeCheckboxValuesPicked(this.props.checkboxValuesPicked.filter(function (valueToRemove) {
                return value !== valueToRemove
            }));
        } else {
            await this.props.onChangeCheckboxValuesPicked([...this.props.checkboxValuesPicked, value]);
        }
    }

    checkboxIsSelected(value) {
        return includes(this.props.checkboxValuesPicked, value);
    }

    async handleFiltersChange() {
        await this.props.processSelectedFilters();
        await this.updateFilterNumber();
    }

    async updateFilterNumber() {
        var numFilters = 0;
        if (this.props.showDropDownFilter && this.props.dropDownValuePicked != '' && this.props.dropDownValuePicked != this.props.dropDownMainOptionLabel) {
            numFilters++;
        }
        if (this.props.showChipsG1 && this.props.chipValuesPickedG1) {
            numFilters += this.props.chipValuesPickedG1.length;
        }
        if (this.props.showChipsG2 && this.props.chipValuesPickedG2) {
            numFilters += this.props.chipValuesPickedG2.length;
        }
        if (this.props.showTextFilter && this.props.textFilterValue != '') {
            numFilters++;
        }
        if (this.props.showMinMaxFilter && ((this.props.currentMax !== this.props.absoluteMax) ||
            (this.props.currentMin !== this.props.absoluteMin))) {
            numFilters++;
        }
        if (this.props.showCheckboxFilter && this.props.checkboxValuesPicked) {
            numFilters += this.props.checkboxValuesPicked.length;
        }
        if (this.props.showCheckboxFilter && Number(this.props.currentJustMax) !== this.props.initialJustMax) {
            numFilters++;
        }
        if (this.props.issuesChipValuePickedG1) {
            numFilters++;
        }
        if (this.props.issuesChipValuePickedG2) {
            numFilters++;
        }
        await this.props.onChangeNumberFiltersApplied(numFilters);
    }

    handlePopoverClose = () => {
        this.setState({
            popOverAnchorEl: null
        });
    };

    handleMinChange = async (ev) => {
        if (ev.target.value < this.props.absoluteMin) {
            await this.props.onChangeCurrentMin(this.props.absoluteMin);
        }
        else {
            await this.props.onChangeCurrentMin(Number(ev.target.value) === 0 ? ev.target.value : ev.target.value.replace(/^0+/, ''));
        }
    }

    handleMinValidation = async () => {
        if (this.props.currentMin === '') {
            await this.props.onChangeCurrentMin(this.props.absoluteMin);
        } else if (this.props.currentMin > this.props.currentMax) {
            await this.props.onChangeCurrentMin(this.props.absoluteMax);
        }
    }

    handleMaxChange = async (ev) => {
        if (ev.target.value > this.props.absoluteMax) {
            await this.props.onChangeCurrentMax(this.props.absoluteMax);
        }
        else {
            await this.props.onChangeCurrentMax(Number(ev.target.value) === 0 ? ev.target.value : ev.target.value.replace(/^0+/, ''));
        }
    }

    handleMaxValidation = async () => {
        if (this.props.currentMax === '') {
            await this.props.onChangeCurrentMax(this.props.absoluteMax);
        } else if (this.props.currentMax < this.props.currentMin) {
            await this.props.onChangeCurrentMax(this.props.currentMin);
        }
    }

    handleJustMaxChange = async (ev) => {
        if (ev.target.value > this.props.absoluteJustMax) {
            await this.props.onChangeCurrentJustMax(this.props.absoluteJustMax);
        } else if (ev.target.value < 0) {
            await this.props.onChangeCurrentJustMax(0);
        }
        else {
            await this.props.onChangeCurrentJustMax(Number(ev.target.value) === 0 ? ev.target.value : ev.target.value.replace(/^0+/, ''));
        }
    }

    handleJustMaxValidation = async () => {
        if (this.props.currentJustMax === '') {
            await this.props.onChangeCurrentJustMax(1000);
        }
    }

    async resetState(exit) {
        if (exit) {
            await this.props.onResetFilters();
            await this.setStateAsync(this.initialState);
        } else {
            await this.props.onResetFilters();
        }
        await this.handleFiltersChange();
    }

    renderNumberFiltersApplied(classes, intl) {
        return <React.Fragment>
            <Grid
                style={{ marginRight: '14px', marginTop: '15px' }}
            >
                <span className={classes.numberFiltersAppliedLabel}>
                    {this.props.numberFiltersApplied} {this.props.numberFiltersApplied > 1 ?
                        intl.formatMessage(messages.filters) :
                        intl.formatMessage(messages.filter)}
                </span>
                <a onClick={() => { this.resetState(true) }} >
                    <span className={classes.numberFiltersAppliedLabelX}>
                        x
                    </span>
                </a>
            </Grid>
        </React.Fragment>
    }

    renderMainHeader(classes, intl) {
        return <React.Fragment>
            <Grid
                container
                direction="row"
                alignItems="stretch"
                style={{
                    marginTop: "15px",
                    marginBottom: "15px"
                }}
            >
                <Grid item xs={4}>
                    <span className={classes.titleLabel}>
                        {intl.formatMessage(messages.applyFilter)}
                    </span>
                </Grid>
                <Grid item xs={4}
                    style={{
                        textAlign: 'left'
                    }}>
                    {this.props.numberFiltersApplied > 0 &&
                        <Fragment >
                            <span className={classes.clearAllFiltersLabel}>
                                {intl.formatMessage(messages.clearAllFilters)}
                            </span>
                            <a onClick={() => { this.resetState(false) }}>
                                <span className={classes.clearAllFiltersLabelX}> x </span>
                            </a>
                        </Fragment>
                    }
                </Grid>
                <Grid item xs={4}
                    style={{
                        textAlign: 'end'
                    }} >
                    <a onClick={() => { this.handlePopoverClose(); }}>
                        <img
                            src={xIcon}
                            className={classes.xIconImage}
                        />
                    </a>
                </Grid>
            </Grid>
        </React.Fragment>
    }

    renderHeaderDescription(classes, intl) {
        return <Grid
            container
            item xs={12}
            direction="row"
            alignItems="stretch"
        >
            <Grid item xs
                style={{
                    paddingBottom: '25px'
                }}>
                <span
                    className={classes.filtersDescriptionLabel}>
                    {this.props.filtersDescription}
                </span>
            </Grid>
        </Grid>
    }

    renderCheckboxes(classes, intl) {
        return <Grid
            container
            item xs={12}
            direction="row"
            alignItems="stretch">
            {this.props.checkBoxesValues.map(container => {
                return <FormControlLabel
                    key={container}
                    className={classes.formControlLabel}
                    classes={{ label: classes.checkboxLabel }}
                    control={<Checkbox
                        icon={<Icon className={classes.checkboxImage} ><img src={checkboxUncheckedIcon} /></Icon>}
                        checkedIcon={<Icon className={classes.checkboxImage}><img src={checkboxCheckedIcon} /></Icon>}
                        checked={this.checkboxIsSelected(container)}
                        onChange={async () => {
                            await this.handleCheckboxClick(container);
                            await this.handleFiltersChange()
                        }}
                        value={container} />}
                    label={container + ':'}
                    labelPlacement="start"
                />
            })}
        </Grid>
    }

    renderJustMax(classes, intl) {
        return <Grid
            container
            item xs={12}
            direction="row"
            alignItems="stretch"
            style={{ paddingLeft: '16px', marginBottom: '10px' }}
        >
            <Grid item xs={3} >
                <span className={classes.justMaxLabel}>
                    {this.props.checkBoxesFilterLabel}
                </span>
                <TextField
                    id="standard-number-just-max"
                    type="number"
                    value={this.props.currentJustMax}
                    onChange={async (ev) => { await this.handleJustMaxChange(ev) }}
                    onKeyPress={async ev => {
                        if (ev.key === 'Enter' && ev.target.value.trim() !== '') {
                            ev.preventDefault();
                            await this.handleJustMaxValidation();
                            await this.handleFiltersChange();
                        }
                    }}
                    onBlur={async () => {
                        await this.handleJustMaxValidation();
                        await this.handleFiltersChange();
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        style: {
                            border: 'none',
                            paddingRight: '0px',
                            color: '#C5CBD8'
                        },
                    }}
                    InputProps={{
                        className: classes.minMaxContainer
                    }}
                    className={classes.justMaxInput}
                />
            </Grid>
        </Grid>
    }

    renderTextFilter(classes, intl) {
        return <Fragment>
            <Grid
                item xs={12}
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid
                    item xs={1}
                    className={classes.searchImageGrid}
                >
                    <img
                        src={searchIcon}
                        className={classes.searchImage} />
                </Grid>
                <Grid
                    item xs={11}
                >
                    <Input
                        className={classes.textFilter}
                        inputProps={{
                            className: classes.textFilterInput
                        }}
                        value={this.props.currentTextFilterValue}
                        placeholder={this.props.textFilterPlaceholder}
                        onKeyPress={async ev => {
                            if (ev.key === 'Enter' && ev.target.value.trim() !== '') {
                                ev.preventDefault();
                                await this.handleTextFilterValueChanged(ev.target.value);
                                await this.handleFiltersChange();
                                await this.handleCurrentTextFilterValueChange("");
                            }
                        }}
                        onChange={
                            async ev => {
                                await this.handleCurrentTextFilterValueChange(ev.target.value);
                            }
                        }
                    />
                </Grid>
            </Grid>
        </Fragment>
    }

    renderTextFilterAppliedLabel(classes, intl) {
        return <span
            className={classes.filterNamesLabels}
        >
            <FormattedMessage {...messages.filterApplied} />
        </span>

    }

    renderTextFilterAppliedChip(classes, intl) {
        return <Grid style={{ 'marginLeft': '10px' }}>
            <div
                key={this.props.textFilterValue}
                className={classes.chipBackgroundContainerSelected}
            >
                <span
                    className={classes.chipLabelSelected}
                >
                    {this.props.textFilterValue}
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

    renderDropDownFilter(classes, intl) {
        return <Fragment>
            <span
                className={classes.filterNamesLabels}
            >
                {this.props.dropDownFilterLabel}
            </span>
            <Grid
                container
                item xs={12}
                direction="row"
                alignItems="stretch"
                style={{ marginTop: '-10px' }}
            >
                <Grid
                    item xs={12}
                    container
                    direction="row"
                    alignItems="stretch"
                    justify="center">
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        className={classes.dropDown}
                        inputProps={{
                            className: classes.dropDownInput
                        }}
                        value={this.props.dropDownValuePicked === '' ? this.props.dropDownMainOptionLabel : this.props.dropDownValuePicked}
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
                            this.props.dropDownValues && this.props.dropDownValues.map(option => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                </Grid>
            </Grid>
        </Fragment>
    }

    renderChipsFilterLabel(classes, intl) {
        return <Fragment>
            <span
                className={classes.filterNamesLabels}
            >
                {this.props.chipsFilterLabel}
            </span>
            <br />
        </Fragment>

    }

    renderChipGroup(classes, intl, parameters) {
        return <ChipGroup
            chipsFilterLabel={parameters.chipsFilterLabel}
            showChips={parameters.showChips}
            showCustomFirstChip={parameters.showCustomFirstChip}
            handleFiltersChange={this.handleFiltersChange.bind(this)}
            customFirstChipLabel={parameters.customFirstChipLabel}
            chipValues={parameters.chipValues}
            chipValuesPicked={parameters.chipValuesPicked}
            onChangeChipValuesPicked={parameters.onChangeChipValuesPicked}
            showIssuesChip={parameters.showIssuesChip}
            issuesChipValuePicked={parameters.issuesChipValuePicked}
            onChangeIssuesChipValuesPicked={parameters.onChangeIssuesChipValuesPicked}
        />
    }

    renderFilterIcon(classes, intl) {
        return <Grid>
            <img className={classes.filterIcon} src={this.props.numberFiltersApplied > 0 ? blackFilterIcon : filterIcon}
                onClick={ev => {
                    this.setState({
                        popOverAnchorEl: ev.currentTarget
                    })
                }}
            />
        </Grid>
    }

    renderMinMax(classes, intl) {
        return <Fragment>
            <span
                className={classes.filterNamesLabels}
            >
                {this.props.minMaxFilterLabel}
            </span>
            <Grid
                container
                item xs={12}
                direction="row"
                alignItems="stretch"
                style={{ paddingLeft: '16px', marginBottom: '10px' }}
            >
                <Grid item xs={3} >
                    <TextField
                        id="standard-number-min"
                        type="number"
                        value={this.props.currentMin}
                        onChange={async (ev) => { await this.handleMinChange(ev) }}
                        onKeyPress={async ev => {
                            if (ev.key === 'Enter' && ev.target.value.trim() !== '') {
                                ev.preventDefault();
                                await this.handleMinValidation();
                                await this.handleFiltersChange();
                            }
                        }}
                        onBlur={async () => {
                            await this.handleMinValidation();
                            await this.handleFiltersChange();
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            style: {
                                border: 'none',
                                paddingRight: '0px',
                                color: '#C5CBD8'
                            },
                        }}
                        InputProps={{
                            className: classes.minMaxContainer,
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    className={classes.minMaxPercentage}>
                                    %
                            </InputAdornment>
                            ),
                        }}
                        className={classes.minInput}
                    />
                </Grid>
                <img
                    src={hyphenIcon}
                    className={classes.hyphenImage}
                />
                <Grid item xs={3} >
                    <TextField
                        id="standard-number-max"
                        type="number"
                        value={this.props.currentMax}
                        onChange={async (ev) => { await this.handleMaxChange(ev) }}
                        onKeyPress={async ev => {
                            if (ev.key === 'Enter' && ev.target.value.trim() !== '') {
                                ev.preventDefault();
                                await this.handleMaxValidation();
                                await this.handleFiltersChange();
                            }
                        }}
                        onBlur={async () => {
                            await this.handleMaxValidation();
                            await this.handleFiltersChange();
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            style: {
                                border: 'none',
                                paddingRight: '0px',
                                color: '#C5CBD8'
                            },
                        }}
                        InputProps={{
                            className: classes.minMaxContainer,
                            endAdornment: (
                                <InputAdornment
                                    className={classes.minMaxPercentage}
                                    position="end">
                                    %
                            </InputAdornment>
                            ),
                        }}
                        className={classes.maxInput}
                    />
                </Grid>
            </Grid>
            <span
                className={classes.minMaxWarning}
            >
                {this.props.minMaxIntervalsWarning}
            </span>
        </Fragment>
    }

    render() {
        const { classes, intl } = this.props;
        return (
            <React.Fragment>
                {this.props.numberFiltersApplied > 0 && this.renderNumberFiltersApplied(classes, intl)}
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
                            className={classes.headerGrid}>
                            {this.renderMainHeader(classes, intl)}
                            {this.renderHeaderDescription(classes, intl)}
                        </Grid>
                        {this.props.showCheckboxFilter && this.renderCheckboxes(classes, intl)}
                        {this.props.showCheckboxFilter && this.renderJustMax(classes, intl)}
                        {this.props.showTextFilter && this.renderTextFilter(classes, intl)}
                        {this.props.showTextFilter && this.renderTextFilterAppliedLabel(classes, intl)}
                        {this.props.showTextFilter && this.props.textFilterValue != '' && this.renderTextFilterAppliedChip(classes, intl)}
                        {this.props.showDropDownFilter && this.renderDropDownFilter(classes, intl)}
                        {this.props.showChipsG1 && this.renderChipGroup(classes, intl, {
                            chipsFilterLabel: this.props.chipsFilterLabelG1,
                            showChips: this.props.showChipsG1,
                            showCustomFirstChip: this.props.showCustomFirstChipG1,
                            customFirstChipLabel: this.props.customFirstChipLabelG1,
                            chipValues: this.props.chipValuesG1,
                            chipValuesPicked: this.props.chipValuesPickedG1,
                            onChangeChipValuesPicked: this.props.onChangeChipValuesPickedG1,
                            showIssuesChip: this.props.showIssuesChipG1,
                            issuesChipValuePicked: this.props.issuesChipValuePickedG1,
                            onChangeIssuesChipValuesPicked: this.props.onChangeIssuesChipValuesPickedG1
                        })}
                        {this.props.showChipsG2 && this.renderChipGroup(classes, intl, {
                            chipsFilterLabel: this.props.chipsFilterLabelG2,
                            showChips: this.props.showChipsG2,
                            showCustomFirstChip: this.props.showCustomFirstChipG2,
                            customFirstChipLabel: this.props.customFirstChipLabelG2,
                            chipValues: this.props.chipValuesG2,
                            chipValuesPicked: this.props.chipValuesPickedG2,
                            onChangeChipValuesPicked: this.props.onChangeChipValuesPickedG2,
                            showIssuesChip: this.props.showIssuesChipG2,
                            issuesChipValuePicked: this.props.issuesChipValuePickedG2,
                            onChangeIssuesChipValuesPicked: this.props.onChangeIssuesChipValuesPickedG2
                        })}
                        {this.props.showMinMaxFilter && this.renderMinMax(classes, intl)}
                    </Grid>
                </Popover >
                {this.renderFilterIcon(classes, intl)}
            </React.Fragment>
        );
    }
}

PopoverFilter.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    anchorOrigin: PropTypes.object,
    transformOrigin: PropTypes.object,
    showCategoryFilter: PropTypes.bool,
    showCheckboxFilter: PropTypes.bool,
    showChips: PropTypes.bool,
    showCustomFirstChip: PropTypes.bool,
    showDropDownFilter: PropTypes.bool,
    showMinMaxFilter: PropTypes.bool,
    showTextFilter: PropTypes.bool,
    dropDownValues: PropTypes.array,
    chipValuesG1: PropTypes.array,
    chipsFilterLabelG1: PropTypes.string,
    filtersDescription: PropTypes.string,
    textFilterPlaceholder: PropTypes.string,
    dropDownMainOptionLabel: PropTypes.string,
    dropDownFilterLabel: PropTypes.string,
    minMaxFilterLabel: PropTypes.string,
    filtersDescription: PropTypes.string,
    minMaxIntervalsWarning: PropTypes.string,
    processSelectedFilters: PropTypes.func.isRequired,
    customFirstChipLabel: PropTypes.string,
    absoluteMax: PropTypes.number,
    absoluteMin: PropTypes.number,
    initialJustMax: PropTypes.number,
    checkBoxesFilterLabel: PropTypes.string,
    onChangeCurrentTextFilterValue: PropTypes.func,
    textFilterValue: PropTypes.string,
    onChangeDropDownValuePicked: PropTypes.func,
    dropDownValuePicked: PropTypes.string,
    onChangeChipValuesPicked: PropTypes.func,
    chipValuesPickedG1: PropTypes.array,
    onChangeNumberFiltersApplied: PropTypes.func,
    numberFiltersApplied: PropTypes.number,
    onChangeCurrentMax: PropTypes.func,
    onChangeCurrentMin: PropTypes.func,
    onChangeCurrentJustMax: PropTypes.func,
    onChangeCheckboxValuesPicked: PropTypes.func,
    checkboxValuesPicked: PropTypes.array,
    onResetFilters: PropTypes.func
};

export default injectIntl(withStyles(styles)(PopoverFilter));