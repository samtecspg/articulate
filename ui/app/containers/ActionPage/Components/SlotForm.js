import {
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Icon,
  InputAdornment,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import systemKeywords from 'systemKeywords';

import trashIcon from '../../../images/trash-icon.svg';

import messages from '../messages';
import TextPromptRow from './TextPromptRow';

const styles = {
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '40px 25px',
  },
  table: {
    marginTop: '10px',
  },
  deleteCell: {
    width: '20px',
  },
  deleteIcon: {
    cursor: 'pointer',
  },
  userSaying: {
    margin: '10px 0px',
    color: '#a2a7b1',
  },
  userSayingSlot: {
    color: '#4e4e4e',
  },
  infoIcon: {
    color: '#4e4e4e',
    position: 'relative',
    top: '4px',
    fontSize: '16px !important',
  },
  responseEnter: {
    color: '#4e4e4e',
    fontSize: '12px',
    paddingRight: '15px',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  newQuickResponseInputContainer: {
    border: '1px solid #a2a7b1',
    borderRadius: '5px',
  },
  newCurrentSlotInputContainer: {
    border: '1px solid #a2a7b1',
    borderRadius: '5px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class SlotForm extends React.Component {
  constructor(props) {
    super(props);
    this.replaceValuesWithSlotName = this.replaceValuesWithSlotName.bind(this);
    this.addNewCurrentSayingToListFromEvent = this.addNewCurrentSayingToListFromEvent.bind(this);
  }

  state = {
    remember: this.props.slot.remainingLife === undefined || this.props.slot.remainingLife === '' || this.props.slot.remainingLife === null ? false : true,
    rememberForever: this.props.slot.remainingLife === 0 ? true : false,
    limitPrompt: this.props.slot.promptCountLimit === undefined || this.props.slot.promptCountLimit === '' || this.props.slot.promptCountLimit === null ? false : true,
    newQuickResponseKey: '',
    newQuickResponseKeyValue: '',
    currentNewQuickResponse: '',
    currentNewSlotPrompt: '',
    lastQuickResponseEdited: false,
  };



  replaceValuesWithSlotName(saying) {
    const newUserSays = [];
    let newStart = 0;
    saying.keywords.forEach((keyword, index) => {
      if (newStart !== keyword.start) {
        newUserSays.push(
          <span key={`preSlotText_${index}`}>
            {saying.userSays.substring(newStart, keyword.start)}
          </span>,
        );
      }
      newUserSays.push(
        <span
          className={this.props.classes.userSayingSlot}
          key={`slotKeyword_${index}`}
        >
          {`{{slots.${
            keyword.keyword.indexOf(' ') !== -1
              ? `[${keyword.keyword}]`
              : keyword.keyword
            }.value}}`}
        </span>,
      );
      newStart = keyword.end;
    });
    newUserSays.push(
      <span key="finaText">{saying.userSays.substring(newStart)}</span>,
    );
    return newUserSays;
  }

  addNewCurrentSayingToListFromEvent(ev) {
    ev.preventDefault();
    if (this.state.currentNewQuickResponse.trim() !== '') {
      this.props.onAddNewQuickResponse(this.state.currentNewQuickResponse);
      this.setState({ currentNewQuickResponse: '' });
    }
  }

  addNewCurrentSlotPromptToListFromEvent(ev) {
    ev.preventDefault();
    if (this.state.currentNewSlotPrompt.trim() !== '') {
      this.props.onAddTextPrompt(this.state.currentNewSlotPrompt);
      this.setState({ currentNewSlotPrompt: '' });
    }
  }

  render() {
    const { classes, intl, slot, agentKeywords } = this.props;

    return (
      <Grid className={classes.formContainer} container item xs={12}>
        <Grid
          className={classes.formSubContainer}
          id="formContainer"
          container
          item
          xs={12}
        >
          <Grid container spacing={24} item xs={12}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                id="slotName"
                label={intl.formatMessage(messages.slotNameTextField)}
                value={slot.slotName}
                placeholder={intl.formatMessage(
                  messages.slotNameTextFieldPlaceholder,
                )}
                onChange={evt => {
                  this.props.onChangeSlotName(evt.target.value);
                }}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={intl.formatMessage(messages.requiredField)}
                error={
                  this.props.errorState ? this.props.errorState.slotName : false
                }
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                select
                id="keyword"
                value={slot.keywordId ? slot.keywordId : slot.keyword}
                label={intl.formatMessage(messages.keywordSelect)}
                onChange={evt => {
                  let selectedKeyword = agentKeywords.filter(
                    agentKeyword => agentKeyword.id === evt.target.value,
                  );
                  if (selectedKeyword.length === 0) {
                    selectedKeyword = systemKeywords.filter(
                      systemKeyword =>
                        systemKeyword.keywordName === evt.target.value,
                    );
                    this.props.onChangeSlotData(
                      'uiColor',
                      selectedKeyword[0].uiColor,
                    );
                    this.props.onChangeSlotData(
                      'keyword',
                      selectedKeyword[0].keywordName,
                    );
                    this.props.onChangeSlotData('keywordId', 0);
                  } else {
                    this.props.onChangeSlotData(
                      'uiColor',
                      selectedKeyword[0].uiColor,
                    );
                    this.props.onChangeSlotData(
                      'keyword',
                      selectedKeyword[0].keywordName,
                    );
                    this.props.onChangeSlotData(
                      'keywordId',
                      selectedKeyword[0].id,
                    );
                  }
                }}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={intl.formatMessage(messages.requiredField)}
                error={
                  this.props.errorState ? this.props.errorState.keyword : false
                }
              >
                {agentKeywords.map((keyword, index) => (
                  <MenuItem key={`keyword_${index}`} value={keyword.id}>
                    <span style={{ color: keyword.uiColor }}>
                      {keyword.keywordName}
                    </span>
                  </MenuItem>
                ))}
                {systemKeywords.map((keyword, index) => (
                  <MenuItem
                    key={`keyword_${index}`}
                    value={keyword.keywordName}
                  >
                    <span style={{ color: keyword.uiColor }}>
                      {keyword.keywordName}
                    </span>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid style={{ marginTop: 0 }} container spacing={24} item xs={12}>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.remember}
                    onChange={(evt, value) => {
                      this.setState({
                        remember: value
                      });
                      if (!value) {
                        this.props.onChangeSlotData(
                          'remainingLife',
                          null,
                        );
                      }
                    }}
                    value="anything"
                    color="primary"
                  />
                }
                label={intl.formatMessage(messages.rememberSlot)}
                style={{
                  marginRight: '5px'
                }}
              />
              <Tooltip
                placement="top"
                title={intl.formatMessage(messages.rememberSlotInfo)}
                style={{
                  marginRight: '15px'
                }}
              >
                <Icon className={classes.infoIcon}>info</Icon>
              </Tooltip>
              {this.state.remember ?
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.rememberForever}
                      onChange={(evt, value) => {
                        this.setState({
                          rememberForever: value
                        });
                        if (value) {
                          this.props.onChangeSlotData(
                            'remainingLife',
                            0,
                          );
                        }
                        else {
                          this.props.onChangeSlotData(
                            'remainingLife',
                            null,
                          );
                        }
                      }}
                      value="anything"
                      color="primary"
                    />
                  }
                  label={intl.formatMessage(messages.rememberSlotForever)}
                />
                : null}
            </Grid>
          </Grid>
          {this.state.remember && !this.state.rememberForever ? (
            <Grid container spacing={24} item xs={12}>
              <Grid item xs={12}>
                <TextField
                  id="remainingLife"
                  label={intl.formatMessage(messages.remainingLifeTextField)}
                  value={slot.remainingLife === 0 ? '' : slot.remainingLife}
                  placeholder={intl.formatMessage(
                    messages.remainingLifeTextFieldPlaceholder,
                  )}
                  onChange={evt => {
                    this.props.onChangeSlotData(
                      'remainingLife',
                      evt.target.value ? parseInt(evt.target.value) : null,
                    );
                  }}
                  margin="normal"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="number"
                />
              </Grid>
            </Grid>
          ) : null}
          <Grid style={{ marginTop: 0 }} container spacing={24} item xs={12}>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={slot.isRequired}
                    onChange={(evt, value) => {
                      this.props.onChangeSlotData('isRequired', value);
                    }}
                    value="anything"
                    color="primary"
                  />
                }
                label={intl.formatMessage(messages.slotIsRequired)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={slot.isList}
                    onChange={(evt, value) => {
                      this.props.onChangeSlotData('isList', value);
                    }}
                    value="anything"
                    color="primary"
                  />
                }
                label={intl.formatMessage(messages.slotIsList)}
              />
            </Grid>
          </Grid>
          {slot.isRequired ? (
            <Fragment>
              <Grid style={{ marginTop: 0 }} container spacing={24} item xs={12}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.limitPrompt}
                        onChange={(evt, value) => {
                          this.setState({
                            limitPrompt: value
                          });
                          if (!value) {
                            this.props.onChangeSlotData(
                              'promptCountLimit',
                              null,
                            );
                          }
                        }}
                        value="anything"
                        color="primary"
                      />
                    }
                    label={intl.formatMessage(messages.limitPrompt)}
                    style={{
                      marginRight: '5px'
                    }}
                  />
                  <Tooltip
                    placement="top"
                    title={intl.formatMessage(messages.limitPromptInfo)}
                  >
                    <Icon className={classes.infoIcon}>info</Icon>
                  </Tooltip>
                </Grid>
              </Grid>
              {this.state.limitPrompt ? (
                <Grid container spacing={24} item xs={12}>
                  <Grid item xs={12}>
                    <TextField
                      id="promptCountLimit"
                      label={intl.formatMessage(messages.promptCountLimitTextField)}
                      value={slot.promptCountLimit ? slot.promptCountLimit : ''}
                      placeholder={intl.formatMessage(
                        messages.promptCountLimitTextFieldPlaceholder,
                      )}
                      onChange={evt => {
                        this.props.onChangeSlotData(
                          'promptCountLimit',
                          evt.target.value ? parseInt(evt.target.value) : null,
                        );
                      }}
                      margin="normal"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      type="number"
                    />
                  </Grid>
                </Grid>
              ) : null}
              <Grid container spacing={24} item xs={12}>
                <Grid item xs={12}>
                  <TextField
                    id="newTextPrompt"
                    label={intl.formatMessage(messages.textpromptTextField)}
                    value={this.state.currentNewSlotPrompt}
                    placeholder={intl.formatMessage(
                      messages.textpromptTextFieldPlaceholder,
                    )}
                    onKeyPress={ev => {
                      if (ev.key === 'Enter') {
                        this.addNewCurrentSlotPromptToListFromEvent(ev);
                      }
                    }}
                    onChange={ev => {
                      this.setState({ currentNewSlotPrompt: ev.target.value });
                    }
                    }
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      style: {
                        border: 'none',
                      },
                    }}
                    InputProps={{
                      disabled: !slot.isRequired,
                      className: classes.newCurrentSlotInputContainer,
                      endAdornment: (
                        <InputAdornment position="end">
                          <span
                            className={classes.responseEnter}
                            onClick={ev => {
                              this.addNewCurrentSlotPromptToListFromEvent(ev);
                            }}
                          >
                            {intl.formatMessage(messages.responseEnter)}
                          </span>
                        </InputAdornment>
                      )
                    }}
                    helperText={intl.formatMessage(messages.textpromptHelperText)}
                    error={
                      this.props.errorState
                        ? this.props.errorState.textPrompts
                        : false
                    }
                  />
                  {slot.textPrompts.length > 0 ? (
                    <Table className={classes.table}>
                      <TableBody>
                        {slot.textPrompts.map((textPrompt, textPromptIndex) => (
                          <TableRow key={`${textPrompt}_${textPromptIndex}`}>
                            <TableCell>
                              <TextPromptRow
                                agentId={this.props.agentId}
                                textPrompt={textPrompt}
                                textPromptIndex={textPromptIndex}
                                onEditSlotTextPrompt={this.props.onEditSlotTextPrompt}
                                onDeleteTextPrompt={this.props.onDeleteTextPrompt}
                                onCopyTextPrompt={this.props.onCopyTextPrompt}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : null}
                </Grid>
              </Grid>


              <Grid container spacing={24} item xs={12}>
                <Grid item xs={12}>
                  <TextField
                    id="newQuickResponse"
                    label={intl.formatMessage(messages.quickResponseValue)}
                    value={this.state.currentNewQuickResponse}
                    placeholder={intl.formatMessage(
                      messages.newQuickResponsePlaceholder,
                    )}
                    onKeyPress={ev => {
                      if (ev.key === 'Enter') {
                        this.addNewCurrentSayingToListFromEvent(ev);
                      }
                    }}
                    onChange={ev => {
                      this.setState({ currentNewQuickResponse: ev.target.value });
                    }}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      style: {
                        border: 'none',
                      },
                    }}
                    InputProps={{
                      disabled: !slot.isRequired,
                      className: classes.newQuickResponseInputContainer,
                      endAdornment: (
                        <InputAdornment position="end">
                          <span
                            className={classes.responseEnter}
                            onClick={ev => {
                              this.addNewCurrentSayingToListFromEvent(ev);
                            }}
                          >
                            {intl.formatMessage(messages.responseEnter)}
                          </span>
                        </InputAdornment>
                      ),
                    }}
                    error={
                      this.props.errorState
                        ? this.props.errorState.quickResponses
                        : false
                    }
                  />
                  {slot.quickResponses && slot.quickResponses.length > 0 ? (
                    <Table className={classes.table}>
                      <TableBody>
                        {slot.quickResponses.map((quickResponse, index) => (
                          <TableRow key={`${quickResponse}_${index}`}>
                            <TableCell>{quickResponse}</TableCell>
                            <TableCell className={classes.deleteCell}>
                              <img
                                onClick={() => {
                                  this.props.onDeleteQuickResponse(index);
                                }}
                                className={classes.deleteIcon}
                                src={trashIcon}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : null}
                </Grid>
              </Grid>
            </Fragment>
          ) : null}
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
  onEditSlotTextPrompt: PropTypes.func.isRequired,
  onChangeSlotName: PropTypes.func.isRequired,
  errorState: PropTypes.object,
  onChangeQuickResponse: PropTypes.func.isRequired,
  onDeleteQuickResponse: PropTypes.func.isRequired,
  onAddNewQuickResponse: PropTypes.func.isRequired,
  onCopyTextPrompt: PropTypes.func.isRequired
};

export default injectIntl(withStyles(styles)(SlotForm));
