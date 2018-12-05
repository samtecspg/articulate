import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import systemKeywords from 'systemKeywords';

import PropTypes from 'prop-types';
import {
    Grid,
    TextField,
    Table,
    TableBody,
    TableRow,
    TableCell,
    MenuItem,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
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
    table: {
        marginTop: '10px'
    },
    deleteCell: {
        width: '20px'
    },
    deleteIcon: {
        cursor: 'pointer'
    },
    userSaying: {
        margin: '10px 0px',
        color: '#a2a7b1',
    },
    userSayingSlot: {
        color: '#4e4e4e',
    }
}

/* eslint-disable react/prefer-stateless-function */
class SlotForm extends React.Component {

    constructor(props){
        super(props);
        this.replaceValuesWithSlotName = this.replaceValuesWithSlotName.bind(this);
    }

    state = {
        agentNameError: false,
    }

    replaceValuesWithSlotName(saying){
        let newUserSays = [];
        let newStart = 0;
        saying.keywords.forEach((keyword, index) => {
            if (newStart !== keyword.start){
            newUserSays.push(<span key={`preSlotText_${index}`}>{saying.userSays.substring(newStart, keyword.start)}</span>);
            }
            newUserSays.push(
                <span className={this.props.classes.userSayingSlot} key={`slotKeyword_${index}`}>
                    {`{{slots.${keyword.keyword.indexOf(' ') !== -1 ? `[${keyword.keyword}]` : keyword.keyword}.value}}`}
                </span>
            );
            newStart = keyword.end;
        });
        newUserSays.push(<span key={'finaText'}>{saying.userSays.substring(newStart)}</span>);
        return newUserSays;
    };

    render(){
        const { classes, intl, slot, agentKeywords } = this.props;
        return (
            <Grid className={classes.formContainer} container item xs={12}>
                <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
                    <Grid container spacing={24} item xs={12}>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                id='slotName'
                                label={intl.formatMessage(messages.slotNameTextField)}
                                value={slot.slotName}
                                placeholder={intl.formatMessage(messages.slotNameTextFieldPlaceholder)}
                                onChange={(evt) => { this.props.onChangeSlotName(evt.target.value) }}
                                margin='normal'
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={intl.formatMessage(messages.requiredField)}
                                error={this.props.errorState ? this.props.errorState.slotName : false}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                select
                                id='keyword'
                                value={`${slot.uiColor}~${slot.keyword}`}
                                label={intl.formatMessage(messages.keywordSelect)}
                                onChange={(evt) => {
                                    const keywordValue = evt.target.value.split('~');
                                    this.props.onChangeSlotData('uiColor', keywordValue[0]);
                                    this.props.onChangeSlotData('keyword', keywordValue[1]);
                                }}
                                margin='normal'
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={intl.formatMessage(messages.requiredField)}
                                error={this.props.errorState ? this.props.errorState.keyword : false}
                            >
                                {agentKeywords.map((keyword, index) => {
                                    return (
                                        <MenuItem key={`keyword_${index}`} value={`${keyword.uiColor}~${keyword.keywordName}`}>
                                            <span style={{color: keyword.uiColor}} >{keyword.keywordName}</span>
                                        </MenuItem>
                                    );
                                })}
                                {systemKeywords.map((keyword, index) => {
                                    return (
                                        <MenuItem key={`keyword_${index}`} value={`${keyword.uiColor}~${keyword.keywordName}`}>
                                            <span style={{color: keyword.uiColor}} >{keyword.keywordName}</span>
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} item xs={12}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                    checked={slot.isRequired}
                                    onChange={(evt, value) => { this.props.onChangeSlotData('isRequired', value) }}
                                    value='anything'
                                    color='primary'
                                    />
                                }
                                label={intl.formatMessage(messages.slotIsRequired)}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                    checked={slot.isList}
                                    onChange={(evt, value) => { this.props.onChangeSlotData('isList', value) }}
                                    value='anything'
                                    color='primary'
                                    />
                                }
                                label={intl.formatMessage(messages.slotIsList)}
                            />
                        </Grid>
                    </Grid>
                    { slot.isRequired ? 
                        <Grid container spacing={24} item xs={12}>
                            <Grid item xs={12}>
                                <TextField
                                    id='newTextPrompt'
                                    label={intl.formatMessage(messages.textpromptTextField)}
                                    placeholder={intl.formatMessage(messages.textpromptTextFieldPlaceholder)}
                                    onKeyPress={(ev) => {
                                        if (ev.key === 'Enter') {
                                            ev.preventDefault();
                                            if (ev.target.value !== ''){
                                                this.props.onAddTextPrompt(ev.target.value)
                                                ev.target.value = '';
                                            }
                                        }
                                    }}
                                    margin='normal'
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        disabled: !slot.isRequired
                                    }}
                                    helperText={intl.formatMessage(messages.textpromptHelperText)}
                                    error={this.props.errorState ? this.props.errorState.textPrompts : false}
                                />
                                {slot.textPrompts.length > 0 ?
                                    <Table className={classes.table}>
                                        <TableBody>
                                            {slot.textPrompts.map((textPrompt, index) => {
                                                return (
                                                <TableRow key={`${textPrompt}_${index}`}>
                                                    <TableCell>
                                                        {textPrompt}
                                                    </TableCell>
                                                    <TableCell className={classes.deleteCell}>
                                                        <img onClick={() => { this.props.onDeleteTextPrompt(index) }} className={classes.deleteIcon} src={trashIcon} />
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
                        : null 
                    }
                </Grid>
            </Grid>
        );
    }
}

SlotForm.propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    slot: PropTypes.object,
    saying: PropTypes.object,
    agentKeywords: PropTypes.array,
    onChangeSlotData: PropTypes.func.isRequired,
    onAddTextPrompt: PropTypes.func.isRequired,
    onDeleteTextPrompt: PropTypes.func.isRequired,
    onChangeSlotName: PropTypes.func.isRequired,
    errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(SlotForm));