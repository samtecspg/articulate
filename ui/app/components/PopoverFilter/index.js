import React, { Fragment } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Popover, Grid, Input, TextField, Typography, Chip, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import searchIcon from '../../images/search-icon.svg';
import messages from './messages';

const styles = {
    select: {
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
    title: {
        fontSize: '12pt',
        fontWeight: '600',
    },
    chip: {
        margin: 0.5,
        border: '1px solid #a2a7b1',
        borderRadius: '20px',
        marginTop: '10px !important'
    },
    popover: {
        borderColor: '#4E4E4E',
        borderRight: 'none',
    },
    mainGrid: {
        width: '600px'
    },
    categoriesInput: {
        borderRadius: '0%',
        borderRight: 'none',
        borderTop: 'none',
        borderColor: '#4E4E4E',
        height: '100%',
        color: '#A2A7B1',
        '&:focus': {
            borderRadius: '0%',
            borderRight: 'none',
            borderTop: 'none',
            borderColor: '#4E4E4E',
            height: '100%',
            color: '#A2A7B1'
        }
    },
    categoriesLabel: {
        marginTop: '26px',
        marginLeft: '8%',
    },
    categoriesSelect: {
        marginTop: '-25px',
        marginBottom: '-26px'
    },
    sayings: {
        height: '100%',
        width: '100%',
        borderColor: '#4E4E4E',
        border: 'solid 1px',
        borderRadius: '0%',
        borderRight: 'none',
        borderLeft: 'none',
        borderTop: 'none'
    },
    sayingsInput: {
        border: 'none',
        opacity: '100%',
        marginLeft: '-8px'
    },
    searchImage: {
        width: '50%',
        height: '50%',
        marginLeft: '10px'
    },
    searchImageGrid: {
        borderColor: '#4E4E4E',
        borderRight: 'none',
        borderTop: 'none',
        borderLeft: 'none',
        border: 'solid 1px',
    },
    searchValueContainerWithoutHover: {
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
    actionBackgroundContainer: {
        cursor: 'pointer',
        margin: '0px 5px 10px 5px',
        fontSize: '12pt',
        padding: '4px 8px 4px 10px',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '50px',
        width: 'max-content',
        backgroundColor: '#ffffff',
        border: 'solid 1px',
    },
    actionBackgroundContainerSelected: {
        cursor: 'pointer',
        margin: '0px 5px 10px 5px',
        fontSize: '12px',
        padding: '4px 8px 4px 10px',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '50px',
        width: 'max-content',
        backgroundColor: '#4e4e4e',
        border: 'solid 1px',
    },
    actionLabel: {
        textDecoration: 'none',
        color: '#4e4e4e',
        fontFamily: 'Montserrat',
        fontSize: '14pt',
        marginBottom: '2px',
        display: 'inline-block'
    },
    actionLabelSelected: {
        textDecoration: 'none',
        color: '#ffffff',
        fontFamily: 'Montserrat',
        fontSize: '14pt',
        marginBottom: '2px',
        display: 'inline-block'
    },
    actionLabelSelectedX: {
        textDecoration: 'none',
        color: '#ffffff',
        fontFamily: 'Montserrat',
        fontSize: '10pt',
        display: 'inline-block',
        marginLeft: '5px'
    },
    deleteActionX: {
        paddingLeft: '5px',
        cursor: 'pointer',
        fontSize: '1pt !important'
    },
    filterAppliedLabel: {
        color: '#979797',
        fontSize: '12pt',
        padding: '16px',
        display: 'inline-block',
        fontFamily: 'Montserrat',
    },
    chipsLabel: {
        color: '#979797',
        fontSize: '12pt',
        marginLeft: '16px',
        marginTop: '10px',
        display: 'inline-block',
        fontFamily: 'Montserrat',
    }
};

/* eslint-disable react/prefer-stateless-function */
export class PopoverFilter extends React.Component {

    constructor(props) {
        super(props);

        this.initialState = {
            dropDownValuePicked: 'Pick Category',
            chipValuesPicked: [],
            filterValue: '',
            numberFiltersApplied: 0,
        };
        this.state = this.initialState;

        this.handleChipClick = this.handleChipClick.bind(this);
        this.handleDropDownValuePicked = this.handleDropDownValuePicked.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
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
        return _.includes(this.state.chipValuesPicked, value);
    }

    async handleDropDownValuePicked(value) {
        await this.setStateAsync({ dropDownValuePicked: value });
    }

    async handleFilterValueChanged(value) {
        await this.setStateAsync({ filterValue: value });
    }


    async buildFilter() {
        var filter = '';
        if (this.state.filterValue != '') {
            filter = filter + this.state.filterValue + ' ';
        }
        if (this.state.dropDownValuePicked != 'Pick Category') {
            filter = filter + 'category:"' + this.state.dropDownValuePicked + '"';
        }
        if (this.state.chipValuesPicked.length > 0) {
            filter = filter + ' actions:"'
            filter = filter + this.state.chipValuesPicked.join('" actions:"')
            filter = filter + '"';
        }
        await this.updateFilterNumber();
        return filter;
    }

    async updateFilterNumber() {
        var numFilters = 0;
        if (this.state.dropDownValuePicked != 'Pick Category') {
            numFilters++;
        }
        numFilters += this.state.chipValuesPicked.length;
        if (this.state.filterValue != '') {
            numFilters++;
        }
        await this.setStateAsync({ numberFiltersApplied: numFilters });
        this.props.updateNumberFiltersApplied(numFilters);
    }

    async resetState() {
        await this.setStateAsync(this.initialState);
        var filter = await this.buildFilter();
        this.props.filterChangeFunction(filter);
    }

    render() {
        const { classes, intl } = this.props;
        return (
            <React.Fragment>
                {this.state.numberFiltersApplied > 0 &&
                    <React.Fragment>
                        <Grid
                            style={
                                {
                                    marginRight: '20px'
                                }
                            }
                        >
                            <span
                                style={
                                    {
                                        textDecoration: 'underline',
                                        color: '#4e4e4e',
                                        fontFamily: 'Montserrat',
                                        fontSize: '10pt',
                                        marginRight: '5px'
                                    }
                                }
                            >
                                {this.state.numberFiltersApplied} Filter
                </span>
                            <a
                                onClick={
                                    this.resetState
                                }
                            >
                                <span style={
                                    {
                                        color: '#4e4e4e',
                                        fontFamily: 'Montserrat',
                                        fontSize: '10pt',
                                        fontWeight: 'Bold',
                                        cursor: 'pointer'
                                    }
                                }> x </span>

                            </a>
                        </Grid>
                    </React.Fragment>
                }
                <Popover
                    anchorEl={this.props.anchorEl}
                    open={Boolean(this.props.anchorEl)}
                    onClose={this.props.onClose}
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
                                style={{ heigth: '100%' }}
                            >
                                <Input
                                    className={classes.sayings}
                                    inputProps={{
                                        className: classes.sayingsInput
                                    }}
                                    placeholder="Search Sayings"
                                    onKeyPress={async ev => {
                                        if (ev.key === 'Enter' && ev.target.value.trim() !== '') {
                                            ev.preventDefault();
                                            await this.handleFilterValueChanged(ev.target.value);
                                            var filter = await this.buildFilter();
                                            this.props.filterChangeFunction(filter);
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid
                                container
                                item xs={4}
                                alignItems="stretch"
                            >
                                <TextField
                                    select
                                    fullWidth
                                    margin="normal"
                                    className={classes.categoriesSelect}
                                    inputProps={{
                                        className: classes.categoriesInput
                                    }}
                                    value={this.state.dropDownValuePicked}
                                    onChange={async ev => {
                                        await this.handleDropDownValuePicked(ev.target.value)
                                        var filter = await this.buildFilter();
                                        this.props.filterChangeFunction(filter);
                                    }}
                                >
                                    <MenuItem key={'Pick Category'} value={'Pick Category'}
                                        className={classes.searchValueContainerWithoutHover}
                                    >
                                        {'Pick Category'}
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
                            className={classes.filterAppliedLabel}
                        >
                            <FormattedMessage {...messages.filterApplied} />
                        </span>
                        <br />
                        {this.state.filterValue != '' &&
                            <Grid style={{ 'marginLeft': '10px' }}>
                                <div
                                    key={this.state.filterValue}
                                    className={classes.actionBackgroundContainerSelected}
                                >
                                    <span
                                        className={classes.actionLabelSelected}
                                    >
                                        {this.state.filterValue}
                                    </span>
                                    <a
                                        onClick={async () => {
                                            await this.handleFilterValueChanged('');
                                            var filter = await this.buildFilter();
                                            this.props.filterChangeFunction(filter);
                                        }}
                                    >
                                        <span className={classes.actionLabelSelectedX}>x</span>

                                    </a>
                                </div>
                            </Grid>
                        }
                        <span
                            className={classes.filterAppliedLabel}
                        >
                            {this.props.chipsFilterLabel}
                        </span>
                        <br />
                        <Grid style={{ marginLeft: '10px', marginBottom: '40px' }}>
                            {this.props.chipValues.map(data => {
                                return (
                                    <div
                                        key={data}
                                        className={this.chipIsSelected(data) ? classes.actionBackgroundContainerSelected : classes.actionBackgroundContainer}
                                        onClick={async () => {
                                            await this.handleChipClick(data);
                                            var filter = await this.buildFilter();
                                            this.props.filterChangeFunction(filter);
                                        }}
                                    >
                                        <span
                                            className={this.chipIsSelected(data) ? classes.actionLabelSelected : classes.actionLabel}
                                        >
                                            {data}
                                        </span>
                                    </div>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Popover >
            </React.Fragment>
        );
    }
}

PopoverFilter.propTypes = {
    classes: PropTypes.object.isRequired,
    //intl: intlShape.isRequired,
};

export default injectIntl(withStyles(styles)(PopoverFilter));