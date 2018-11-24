import React from 'react';
import Immutable from 'seamless-immutable';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, TextField, MenuItem, Typography  } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ColorPicker from 'components/ColorPicker';
import ChipInput from 'components/ChipInput'

import messages from '../messages';

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
    uiColorLabel: {
        marginTop: '13px',
        marginBottom: '10px',
        color: '#a2a7b1',
        fontWeight: 400,
        fontSize: '12px'
    },
    keywordValueInputContainer: {
        padding: '0px 12px !important',
    },
    keywordValueInput: {
        marginTop: '0px'
    },
    chipInputRootFirst: {
        marginTop: 16,
        marginBottom: 8
    },
    chipInputRoot: {
        marginBottom: 8
    },
    chipContainer: {
        border: '1px solid #a2a7b1',
        borderRadius: '5px',
        marginTop: '25px !important',
    },
    inputRoot: {
        display: 'block',
        marginTop: '0px !important',
    },
    chip: {
        margin: '8px 0px 8px 8px',
    },
    chipInput: {
        border: 'none'
    },
}

/* eslint-disable react/prefer-stateless-function */
class KeywordDataForm extends React.Component {

    state = {
        newKeyword: '',
        newSyonynm: '',
        keywordNameError: false,
        displayColorPicker: false,
    }

    handleOpen = () => {
        this.setState({
            displayColorPicker: true
        });
    };

    handleClose = () => {
        this.setState({
            displayColorPicker: false
        });
    };

    render(){
        const { classes, intl, keyword } = this.props;
        return (
            <Grid className={classes.formContainer} container item xs={12}>
                <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
                    <Grid container spacing={24} item xs={12}>
                        <Grid item md={9} sm={8} xs={12}>
                            <TextField
                                id='keywordName'
                                label={intl.formatMessage(messages.keywordNameTextField)}
                                value={keyword.keywordName}
                                placeholder={intl.formatMessage(messages.keywordNameTextFieldPlaceholder)}
                                onChange={(evt) => { this.props.onChangeKeywordData('keywordName', evt.target.value) }}
                                margin='normal'
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={intl.formatMessage(messages.requiredField)}
                                error={this.props.errorState.keywordName}
                            />
                        </Grid>
                        <Grid item md={3} sm={4} xs={12}>
                            <Typography className={classes.uiColorLabel}>
                                <FormattedMessage {...messages.uiColorLabel} />
                            </Typography>
                            <ColorPicker
                                handleClose={this.handleClose}
                                handleOpen={this.handleOpen}
                                handleColorChange={
                                    (color) => {
                                        this.setState({ displayColorPicker: false });
                                        this.props.onChangeKeywordData('uiColor', color.hex)
                                    }
                                }
                                color={keyword.uiColor}
                                displayColorPicker={this.state.displayColorPicker}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify='space-between' spacing={24} item xs={12}>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            <TextField
                                select
                                id='type'
                                value={keyword.type}
                                label={intl.formatMessage(messages.typeSelect)}
                                onChange={(evt) => { this.props.onChangeKeywordData('type', evt.target.value) }}
                                margin='normal'
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={intl.formatMessage(messages.requiredField)}
                            >
                                <MenuItem key={'learned'} value={'learned'}>
                                    <FormattedMessage {...messages.learned}/>
                                </MenuItem>
                                <MenuItem key={'regex'} value={'regex'}>
                                    <FormattedMessage {...messages.regex}/>
                                </MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            <TextField
                                id='keywordName'
                                label={intl.formatMessage(messages.regexTextField)}
                                value={keyword.regex}
                                placeholder={intl.formatMessage(messages.regexTextFieldPlaceholder)}
                                onChange={(evt) => { this.props.onChangeKeywordData('regex', evt.target.value) }}
                                margin='normal'
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                    {keyword.examples.map((example, exampleIndex) => {
                        return (
                            <Grid key={`value_${exampleIndex}`} container justify='space-between' spacing={24} item xs={12}>
                                <Grid className={classes.keywordValueInputContainer} item xs={3}>
                                    <TextField
                                        id='exampleValue'
                                        className={exampleIndex !== 0 ? classes.keywordValueInput : ''}
                                        value={example.value}
                                        label={exampleIndex === 0 ? intl.formatMessage(messages.newKeywordValueTextField) : null}
                                        placeholder={intl.formatMessage(messages.newKeywordValueTextFieldPlaceholder)}
                                        onChange={(evt) => { this.props.onChangeExampleName(exampleIndex, evt.target.value) }}
                                        margin='normal'
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid className={classes.keywordValueInputContainer} item xs={9}>
                                    <ChipInput
                                        defaultValue={Immutable.asMutable(example.synonyms, {deep:true})}
                                        onChange={(synonyms) => { this.props.onChangeExampleSynonyms(exampleIndex, synonyms) } }
                                        fullWidth
                                        disableUnderline
                                        classes={{
                                            root: exampleIndex !== 0 ? classes.chipInputRoot : classes.chipInputRootFirst,
                                            chipContainer: classes.chipContainer,
                                            inputRoot: classes.inputRoot,
                                            chip: classes.chip,
                                            input: classes.chipInput,
                                        }}
                                        onDeleteAll={() => {
                                            this.props.onDeleteKeywordExample(exampleIndex);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        )
                    })}
                    <Grid container justify='space-between' spacing={24} item xs={12}>
                        <Grid className={classes.keywordValueInputContainer} item xs={3}>
                            <TextField
                                id='newExampleValue'
                                value={this.state.newKeyword}
                                className={classes.keywordValueInput}
                                placeholder={intl.formatMessage(messages.newKeywordValueTextFieldPlaceholder)}
                                onKeyPress={(evt) => {
                                    if(evt.key === 'Enter'){
                                        evt.preventDefault();
                                        this.props.onAddKeywordExample({ value: evt.target.value, synonyms: [evt.target.value] });
                                        this.setState({
                                            newKeyword: '',
                                        })
                                    }
                                }}
                                onChange={(evt) => {
                                    this.setState({
                                        newKeyword: evt.target.value,
                                    });
                                }}
                                margin='normal'
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={this.props.errorState.keywordName ? intl.formatMessage(messages.keywordValuesError) : ''}
                                error={this.props.errorState.examples}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

KeywordDataForm.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    keyword: PropTypes.object,
    onChangeKeywordData: PropTypes.func.isRequired,
    onChangeKeywordData: PropTypes.func,
    onAddKeywordExample: PropTypes.func,
    onDeleteKeywordExample: PropTypes.func,
    onChangeExampleSynonyms: PropTypes.func,
    onChangeExampleName: PropTypes.func,
    errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(KeywordDataForm));