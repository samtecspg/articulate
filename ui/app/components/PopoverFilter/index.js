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
            textFilterValue: this.props.textFilterValue,
            dropDownValuePicked: this.props.dropDownValuePicked === '' ? this.props.dropDownMainOptionLabel : this.props.dropDownValuePicked,
            chipValuesPicked: this.props.chipValuesPicked,
            checkboxValuesPicked: [],
            numberFiltersApplied: this.props.numberFiltersApplied,
            currentTextFilterValue: '',
            currentMax: 100,
            currentMin: 0,
            currentJustMax: this.props.initialJustMax
        };
        this.state = this.initialState;

        this.handleChipClick = this.handleChipClick.bind(this);
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
        await this.setStateAsync({ dropDownValuePicked: value });
        await this.props.onChangeDropDownValuePicked(value);
    }

    async handleTextFilterValueChanged(value) {
        await this.setStateAsync({ textFilterValue: value });
        await this.props.onChangeCurrentTextFilterValue(value);
    }

    async handleCurrentTextFilterValueChange(newValue) {
        await this.setStateAsync({
            currentTextFilterValue: newValue
        })
    }

    async handleChipClick(value) {
        if (this.chipIsSelected(value)) {
            await this.setStateAsync({
                chipValuesPicked: this.state.chipValuesPicked.filter(function (valueToRemove) {
                    return value !== valueToRemove
                })
            });

            await this.props.onChangeChipValuesPicked(this.state.chipValuesPicked.filter(function (valueToRemove) {
                return value !== valueToRemove
            }));
        } else {
            await this.setStateAsync(prevState => ({
                chipValuesPicked: [...prevState.chipValuesPicked, value]
            }))

            await this.props.onChangeChipValuesPicked([...this.props.chipValuesPicked, value]);
        }
    }

    chipIsSelected(value) {
        //return includes(this.state.chipValuesPicked, value);
        return includes(this.props.chipValuesPicked, value);
    }

    async handleCheckboxClick(value) {
        if (this.checkboxIsSelected(value)) {
            await this.setStateAsync({
                checkboxValuesPicked: this.state.checkboxValuesPicked.filter(function (valueToRemove) {
                    return value !== valueToRemove
                })
            });
        } else {
            await this.setStateAsync(prevState => ({
                checkboxValuesPicked: [...prevState.checkboxValuesPicked, value]
            })
            )
        }
    }

    checkboxIsSelected(value) {
        return includes(this.state.checkboxValuesPicked, value);
    }

    async handleFiltersChange() {
        const { dropDownValuePicked, chipValuesPicked, textFilterValue, currentMin, currentMax, checkboxValuesPicked, currentJustMax } = this.state;
        this.props.processSelectedFilters({ dropDownValuePicked, chipValuesPicked, textFilterValue, actionInterval: [currentMin / 100, currentMax / 100], checkboxValuesPicked, currentJustMax });
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
        if (this.props.showMinMaxFilter && ((this.state.currentMax !== this.props.absoluteMax) ||
            (this.state.currentMin !== this.props.absoluteMin))) {
            numFilters++;
        }
        numFilters += this.state.checkboxValuesPicked.length;
        if (this.props.showCheckboxFilter && this.state.currentJustMax !== this.props.initialJustMax) {
            numFilters++;
        }
        await this.setStateAsync({ numberFiltersApplied: numFilters });
        await this.props.onChangeNumberFiltersApplied(numFilters);
    }

    handlePopoverClose = () => {
        this.setState({
            popOverAnchorEl: null
        });
    };

    handleMinChange = async (ev) => {
        if (ev.target.value < this.props.absoluteMin) {
            await this.setStateAsync({ currentMin: this.props.absoluteMin });
        }
        else {
            await this.setStateAsync({ currentMin: Number(ev.target.value) === 0 ? ev.target.value : ev.target.value.replace(/^0+/, '') });
        }
    }

    handleMinValidation = async () => {
        if (this.state.currentMin === '') {
            await this.setStateAsync({ currentMin: this.props.absoluteMin });
        } else if (this.state.currentMin > this.state.currentMax) {
            await this.setStateAsync({ currentMin: this.state.currentMax });
        }
    }

    handleMaxChange = async (ev) => {
        if (ev.target.value > this.props.absoluteMax) {
            await this.setStateAsync({ currentMax: this.props.absoluteMax });
        }
        else {
            await this.setStateAsync({ currentMax: Number(ev.target.value) === 0 ? ev.target.value : ev.target.value.replace(/^0+/, '') });
        }
    }

    handleMaxValidation = async () => {
        if (this.state.currentMax === '') {
            await this.setStateAsync({ currentMax: this.props.absoluteMax });
        } else if (this.state.currentMax < this.state.currentMin) {
            await this.setStateAsync({ currentMax: this.state.currentMin });
        }
    }

    handleJustMaxChange = async (ev) => {
        if (ev.target.value > this.props.absoluteJustMax) {
            await this.setStateAsync({ currentJustMax: this.props.absoluteJustMax });
        } else if (ev.target.value < 0) {
            await this.setStateAsync({ currentJustMax: 0 });
        }
        else {
            await this.setStateAsync({ currentJustMax: Number(ev.target.value) === 0 ? ev.target.value : ev.target.value.replace(/^0+/, '') });
        }
    }

    handleJustMaxValidation = async () => {
        if (this.state.currentJustMax === '') {
            await this.setStateAsync({ currentJustMax: 1000 });
        }
    }

    async resetState(exit) {
        if (exit) {
            await this.setStateAsync(this.initialState);
        } else {
            await this.setStateAsync({
                textFilterValue: '',
                dropDownValuePicked: this.props.dropDownMainOptionLabel,
                chipValuesPicked: [],
                numberFiltersApplied: 0,
                currentMin: this.props.absoluteMin,
                currentMax: this.props.absoluteMax,
                checkboxValuesPicked: [],
                currentJustMax: this.props.initialJustMax
            })
        }
        await this.handleFiltersChange();
    }

    componentWillUnmount() {
        //const { dropDownValuePicked, chipValuesPicked, textFilterValue, currentMin, currentMax, checkboxValuesPicked, currentJustMax } = this.initialState
        //this.props.processSelectedFilters({ dropDownValuePicked, chipValuesPicked, textFilterValue, actionInterval: [currentMin / 100, currentMax / 100], checkboxValuesPicked, currentJustMax });
    }

    renderNumberFiltersApplied(classes, intl) {
        return <React.Fragment>
            <Grid
                style={{ marginRight: '14px', marginTop: '15px' }}
            >
                <span className={classes.numberFiltersAppliedLabel}>
                    {this.state.numberFiltersApplied} {this.state.numberFiltersApplied > 1 ?
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
                    {this.state.numberFiltersApplied > 0 &&
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
                    value={this.state.currentJustMax}
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
                        value={this.state.currentTextFilterValue}
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

    renderChips(classes, intl) {
        return <Grid style={{ marginLeft: '10px', marginBottom: '10px' }}>
            {this.props.showChips && this.props.showCustomFirstChip === true && this.renderCustomFirstChip(classes, intl)}
            {this.props.showChips && this.renderNormalChips(classes, intl)}
        </Grid>
    }

    renderCustomFirstChip(classes, intl) {
        return <Fragment>
            <div
                key={""}
                className={this.chipIsSelected("") ? classes.chipBackgroundContainerSelected : classes.chipBackgroundContainer}
                onClick={async () => {
                    await this.handleChipClick("");
                    await this.handleFiltersChange();
                }}
            >
                <span
                    className={this.chipIsSelected("") ? classes.chipLabelSelected : classes.chipLabel}
                >
                    {this.props.customFirstChipLabel}
                </span>
            </div>
        </Fragment>
    }

    renderNormalChips(classes, intl) {
        return this.props.chipValues.sort().map(data => {
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
        })
    }

    renderFilterIcon(classes, intl) {
        return <Grid>
            <img className={classes.filterIcon} src={this.state.numberFiltersApplied > 0 ? blackFilterIcon : filterIcon}
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
                        value={this.state.currentMin}
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
                        value={this.state.currentMax}
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
                {this.state.numberFiltersApplied > 0 && this.renderNumberFiltersApplied(classes, intl)}
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
                        {this.state.textFilterValue != '' && this.renderTextFilterAppliedChip(classes, intl)}
                        {this.props.showDropDownFilter && this.renderDropDownFilter(classes, intl)}
                        {this.props.showChips && this.renderChipsFilterLabel(classes, intl)}
                        {this.props.showChips && this.renderChips(classes, intl)}
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
    chipValues: PropTypes.array,
    chipsFilterLabel: PropTypes.string,
    filtersDescription: PropTypes.string,
    textFilterPlaceholder: PropTypes.string,
    dropDownMainOptionLabel: PropTypes.string,
    chipsFilterLabel: PropTypes.string,
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
    chipValuesPicked: PropTypes.array,
    onChangeNumberFiltersApplied: PropTypes.func,
    numberFiltersApplied: PropTypes.number
};

export default injectIntl(withStyles(styles)(PopoverFilter));