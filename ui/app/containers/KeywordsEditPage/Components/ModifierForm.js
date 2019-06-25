import {
  Grid,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import trashIcon from '../../../images/trash-icon.svg';

import messages from '../messages';
import ModifierSayingRow from './ModifierSayingRow';

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
  userSayingModifier: {
    color: '#4e4e4e',
  },
  sayingInputContainer: {
    border: '1px solid #a2a7b1',
    borderRadius: '5px',
  },
  sayingEnter: {
    color: '#4e4e4e',
    fontSize: '12px',
    paddingRight: '15px',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  highlightLabel: {
    marginTop: '20px',
    marginBottom: '10px',
    color: '#a2a7b1',
    fontWeight: 400,
    fontSize: '12px',
  },
  pagesLabel: {
    color: '#a2a7b1',
    display: 'inline',
    padding: '5px',
    top: '39px',
    position: 'relative',
  },
  pageControl: {
    marginTop: '5px',
    webkitTouchCallout: 'none',
    webkitUserSelect: 'none',
    khtmlUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  pageSubControl: {
    display: 'inline',
  },
  pageNumberSubControl: {
    display: 'inline',
    float: 'right',
  },
  pageTextfield: {
    width: '75px',
    margin: '5px',
    marginTop: '0px !important',
    direction: 'ltr',
  },
  pageCursors: {
    cursor: 'pointer',
    display: 'inline',
    padding: '5px',
    top: '39px',
    position: 'relative',
  },
  pageCursorsDisabled: {
    display: 'inline',
    padding: '5px',
    color: '#a2a7b1',
    top: '39px',
    position: 'relative',
  },
  pageSizeLabels: {
    display: 'inline',
    margin: '0px 5px',
    top: '39px',
    position: 'relative',
  },
};

/* eslint-disable react/prefer-stateless-function */
class ModifierForm extends React.Component {
  constructor(props) {
    super(props);
    this.replaceValuesWithModifierName = this.replaceValuesWithModifierName.bind(
      this,
    );
  }

  state = {
    currentPage: 1,
    pageSize: this.props.modifierSayingsPageSize,
    numOfPages: Math.ceil(
      this.props.modifier.sayings.length / this.props.modifierSayingsPageSize,
    ),
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.numOfPages !==
      Math.ceil(
        this.props.modifier.sayings.length / this.props.modifierSayingsPageSize,
      )
    ) {
      this.setState({
        numOfPages: Math.ceil(
          this.props.modifier.sayings.length /
            this.props.modifierSayingsPageSize,
        ),
      });
    }
  }

  replaceValuesWithModifierName(saying) {
    const newUserSays = [];
    let newStart = 0;
    saying.keywords.forEach((keyword, index) => {
      if (newStart !== keyword.start) {
        newUserSays.push(
          <span key={`preModifierText_${index}`}>
            {saying.userSays.substring(newStart, keyword.start)}
          </span>,
        );
      }
      newUserSays.push(
        <span
          className={this.props.classes.userSayingModifier}
          key={`modifierKeyword_${index}`}
        >
          {`{{modifiers.${
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

  render() {
    const { classes, intl, modifier, settings } = this.props;
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
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                id="modifierName"
                label={intl.formatMessage(messages.modifierNameTextField)}
                value={modifier.modifierName}
                placeholder={intl.formatMessage(
                  messages.modifierNameTextFieldPlaceholder,
                )}
                onChange={evt => {
                  this.props.onChangeModifierName(evt.target.value);
                }}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={intl.formatMessage(messages.requiredField)}
                error={
                  this.props.errorState
                    ? this.props.errorState.modifierName
                    : false
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={24} item xs={12}>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <TextField
                select
                id="action"
                value={modifier.action}
                label={intl.formatMessage(messages.actionSelect)}
                onChange={evt => {
                  this.props.onChangeModifierData('action', evt.target.value);
                }}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={intl.formatMessage(messages.requiredField)}
                error={
                  this.props.errorState ? this.props.errorState.action : false
                }
              >
                {settings.modifierActions.map(action => (
                  <MenuItem key={action.value} value={action.value}>
                    {action.text}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <TextField
                select
                id="valueSource"
                value={modifier.valueSource}
                label={intl.formatMessage(messages.valueSourceSelect)}
                onChange={evt => {
                  this.props.onChangeModifierData(
                    'valueSource',
                    evt.target.value,
                  );
                  if (evt.target.value === 'keyword') {
                    this.props.onChangeModifierData('staticValue', '');
                  }
                }}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={intl.formatMessage(messages.requiredField)}
                error={
                  this.props.errorState
                    ? this.props.errorState.valueSource
                    : false
                }
              >
                {settings.modifierValueSources.map(valueSource => (
                  <MenuItem key={valueSource.value} value={valueSource.value}>
                    {valueSource.text}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {modifier.valueSource === 'static' ? (
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextField
                  id="staticValue"
                  label={intl.formatMessage(messages.staticValueTextField)}
                  value={modifier.staticValue}
                  placeholder={intl.formatMessage(
                    messages.staticValueTextFieldPlaceholder,
                  )}
                  onChange={evt => {
                    this.props.onChangeModifierData(
                      'staticValue',
                      evt.target.value,
                    );
                  }}
                  margin="normal"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={intl.formatMessage(messages.requiredField)}
                  error={
                    this.props.errorState
                      ? this.props.errorState.staticValue
                      : false
                  }
                />
              </Grid>
            ) : null}
          </Grid>
          <Grid container spacing={24} item xs={12}>
            <Grid item lg={12} md={12} sm={8} xs={8}>
              <TextField
                id="newSaying"
                label={intl.formatMessage(messages.sayingTextField)}
                placeholder={intl.formatMessage(
                  messages.sayingTextFieldPlaceholder,
                )}
                onKeyPress={ev => {
                  if (ev.key === 'Enter' && ev.target.value !== '') {
                    ev.preventDefault();
                    this.props.onAddModifierSaying(ev.target.value);
                    ev.target.value = '';
                  }
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
                  className: classes.sayingInputContainer,
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className={classes.sayingEnter}>
                        {intl.formatMessage(messages.sayingEnter)}
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={24} item xs={12}>
            <Grid container item xs={12}>
              {modifier.sayings.length > 0 ? (
                <Grid container>
                  <Typography className={classes.highlightLabel}>
                    <FormattedMessage {...messages.highlightTooltip} />
                  </Typography>
                  <Table>
                    <TableBody>
                      {modifier.sayings
                        .slice(
                          (this.state.currentPage - 1) * this.state.pageSize,
                          this.state.currentPage * this.state.pageSize,
                        )
                        .map((saying, index) => (
                          <TableRow key={`${saying}_${index}`}>
                            <TableCell>
                              <ModifierSayingRow
                                saying={saying}
                                agentKeywords={this.props.agentKeywords}
                                onTagModifierKeyword={this.props.onTagModifierKeyword.bind(
                                  null,
                                  (this.state.currentPage - 1) *
                                    this.state.pageSize +
                                    index,
                                )}
                                onUntagModifierKeyword={this.props.onUntagModifierKeyword.bind(
                                  null,
                                  (this.state.currentPage - 1) *
                                    this.state.pageSize +
                                    index,
                                )}
                              />
                            </TableCell>
                            <TableCell className={classes.deleteCell}>
                              <img
                                onClick={() => {
                                  this.props.onDeleteModifierSaying(
                                    (this.state.currentPage - 1) *
                                      this.state.pageSize +
                                      index,
                                  );
                                }}
                                className={classes.deleteIcon}
                                src={trashIcon}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
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
                        id="pageSize"
                        value={this.state.pageSize}
                        onChange={evt => {
                          this.setState({
                            pageSize: evt.target.value,
                          });
                          this.props.onChangeModifiersSayingsPageSize(
                            evt.target.value,
                          );
                        }}
                        margin="normal"
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
                      <Typography
                        onClick={() => {
                          this.state.currentPage > 1
                            ? this.setState({
                                currentPage: this.state.currentPage - 1,
                              })
                            : null;
                        }}
                        className={
                          this.state.currentPage > 1
                            ? classes.pageCursors
                            : classes.pageCursorsDisabled
                        }
                      >
                        <FormattedMessage {...messages.backPage} />
                      </Typography>
                      <TextField
                        id="page"
                        margin="normal"
                        value={this.state.currentPage}
                        onChange={evt => {
                          evt.target.value === ''
                            ? this.setState({ currentPage: 0 })
                            : evt.target.value <= this.state.numOfPages &&
                              evt.target.value >= 0
                            ? this.setState({ currentPage: evt.target.value })
                            : false;
                        }}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          style: {
                            textAlign: 'center',
                          },
                          min: 1,
                          max: this.state.numOfPages,
                          step: 1,
                        }}
                        className={classes.pageTextfield}
                        type="number"
                      />
                      <Typography className={classes.pagesLabel}>
                        / {this.state.numOfPages}
                      </Typography>
                      <Typography
                        onClick={() => {
                          this.state.currentPage < this.state.numOfPages
                            ? this.setState({
                                currentPage: this.state.currentPage + 1,
                              })
                            : null;
                        }}
                        className={
                          this.state.currentPage < this.state.numOfPages
                            ? classes.pageCursors
                            : classes.pageCursorsDisabled
                        }
                      >
                        <FormattedMessage {...messages.nextPage} />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

ModifierForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  modifier: PropTypes.object,
  saying: PropTypes.object,
  onChangeModifierData: PropTypes.func.isRequired,
  onAddModifierSaying: PropTypes.func.isRequired,
  onDeleteModifierSaying: PropTypes.func.isRequired,
  onChangeModifierName: PropTypes.func.isRequired,
  errorState: PropTypes.object,
  settings: PropTypes.object,
  agentKeywords: PropTypes.array,
  onUntagModifierKeyword: PropTypes.func,
  onTagModifierKeyword: PropTypes.func,
  modifierSayingsPageSize: PropTypes.number,
  onChangeModifiersSayingsPageSize: PropTypes.func,
};

export default injectIntl(withStyles(styles)(ModifierForm));
