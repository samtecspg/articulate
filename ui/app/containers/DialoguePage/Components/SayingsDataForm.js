import {
  Grid,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import { useShallowEqual } from 'shouldcomponentupdate-children';

import _ from 'lodash';

import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Immutable from 'seamless-immutable';

import addActionIcon from '../../../images/add-action-icon.svg';

import trashIcon from '../../../images/trash-icon.svg';

import messages from '../messages';

import SayingRow from './SayingRow';
import FilterSelect from '../../../components/FilterSelect';

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
  deleteCell: {
    width: '20px',
  },
  deleteIcon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
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
    borderBottom: '1px solid #4e4e4e',
  },
  searchCategoryField: {
    width: '200px',
    paddingLeft: '5px',
    fontSize: '14px',
  },
  categoryDataContainer: {
    display: 'inline',
  },
  editCategoryIcon: {
    '&:hover': {
      filter: 'invert(1)',
    },
    position: 'relative',
    top: '2px',
    marginLeft: '10px',
  },
  clearIconContainer: {
    display: 'inline',
    width: '100px',
  },
  clearIcon: {
    position: 'relative',
    top: '15px',
    left: '60px',
  },
  sayingInputContainer: {
    border: '1px solid #a2a7b1',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  addActionIcon: {
    cursor: 'pointer',
    marginRight: '10px',
    height: '15px',
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
    width: 'max-content',
  },
  actionLabel: {
    textDecoration: 'none',
    color: 'inherit',
  },
  deleteActionX: {
    '&:hover': {
      fontWeight: 'bold',
    },
    paddingLeft: '5px',
    fontWeight: 300,
    cursor: 'pointer',
  },
  sayingEnter: {
    color: '#4e4e4e',
    fontSize: '10px',
    paddingRight: '15px',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  sayingInputContainer: {
    border: '1px solid #a2a7b1',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class SayingsDataForm extends React.Component {
  state = {
    filterInput: '',
    filteringCategories: false,
    categoriesDropdownOpen: false,
    errorCategory: false,
    openActions: false,
    anchorEl: null,
    changedPage: false,
    currentNewSaying: '',
  };

  constructor(props) {
    super(props);
    this.handleNewSayingTextFieldChange = this.handleNewSayingTextFieldChange.bind(
      this,
    );
  }

  scrollToNextPageCursor() {
    const pageControl = document.querySelector('#pageControl');
    if (pageControl) {
      pageControl.scrollIntoView(true);
    }
  }

  componentWillUpdate(nextProps) {
    if (
      this.props.currentSayingsPage !== nextProps.currentSayingsPage ||
      this.props.sayingsPageSize !== nextProps.sayingsPageSize
    ) {
      this.setState({
        changedPage: true,
      });
    } else if (
      !_.isEqual(
        Immutable.asMutable(this.props.sayings, { deep: true }),
        Immutable.asMutable(nextProps.sayings, { deep: true }),
      )
    ) {
      this.setState({
        changedPage: false,
      });
    }
  }

  componentDidUpdate() {
    if (this.state.changedPage) {
      this.scrollToNextPageCursor();
    }
  }

  handleNewSayingTextFieldChange(e) {
    this.setState({
      currentNewSaying: e.target.value,
    });
  }

  render() {
    const { classes, intl, sayings, category, userSays } = this.props;
    return (
      <Grid className={classes.formContainer} container item xs={12}>
        <Grid
          className={classes.formSubContainer}
          id="formContainer"
          container
          item
          xs={12}
        >
          <Grid container item xs={12}>
            <Grid item lg={2} md={2} sm={4} xs={4}>
              <FilterSelect
                value={category}
                valueDisplayField="categoryName"
                valueField="id"
                thresholdField="actionThreshold"
                onSelect={this.props.onSelectCategory}
                onSearch={this.props.onSearchCategory}
                onGoToUrl={({ isEdit = false, url = '' }) => {
                  if (isEdit) {
                    this.props.onGoToUrl(url);
                  } else {
                    this.props.onGoToUrl(
                      `/agent/${this.props.agentId}/addCategory`,
                    );
                  }
                }}
                onEditRoutePrefix={`/agent/${this.props.agentId}/category/`}
                onCreateRoute={`/agent/${this.props.agentId}/addCategory`}
                filteredValues={this.props.agentFilteredCategories}
                values={this.props.agentCategories}
                inputLabelMessage={messages.categorySelect}
                displayThreshold
                displayEdit
                helperText={
                  this.state.errorCategory
                    ? intl.formatMessage(messages.requiredField)
                    : ''
                }
                error={this.state.errorCategory}
              />
            </Grid>
            <Grid item lg={10} md={10} sm={8} xs={8}>
              <TextField
                id="newSaying"
                defaultValue={userSays || undefined}
                onChange={this.handleNewSayingTextFieldChange}
                value={this.state.currentNewSaying}
                label={intl.formatMessage(messages.sayingTextField)}
                placeholder={intl.formatMessage(
                  messages.sayingTextFieldPlaceholder,
                )}
                onKeyPress={ev => {
                  if (
                    ev.key === 'Enter' &&
                    this.state.currentNewSaying.trim() !== ''
                  ) {
                    if (!category || category === '' || category === 'select') {
                      this.setState({
                        errorCategory: true,
                      });
                    } else {
                      this.setState({
                        errorCategory: false,
                      });
                      ev.preventDefault();
                      this.props.onAddSaying(this.state.currentNewSaying);
                      this.setState({
                        currentNewSaying: '',
                      });
                    }
                  }
                }}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  className: classes.sayingInput,
                  style: {
                    border: 'none',
                  },
                }}
                InputProps={{
                  className: classes.sayingInputContainer,
                  endAdornment: (
                    <InputAdornment position="end">
                      {this.props.newSayingActions.map((action, index) => {
                        let actionId = this.props.agentActions.filter(
                          agentAction => agentAction.actionName === action,
                        );
                        actionId = actionId
                          ? Array.isArray(actionId) && actionId.length > 0
                            ? actionId[0].id
                            : 2
                          : null;
                        return (
                          <div
                            key={`newSayingAction_${index}`}
                            className={classes.actionBackgroundContainer}
                          >
                            <span
                              className={classes.actionLabel}
                              onClick={() => {
                                this.props.onClearSayingToAction();
                                this.props.onGoToUrl(
                                  `/agent/${
                                    this.props.agentId
                                  }/action/${actionId}`,
                                );
                              }}
                            >
                              {action.length > 15 ? (
                                <Tooltip title={action} placement="top">
                                  <span>{`${action.substring(0, 15)}...`}</span>
                                </Tooltip>
                              ) : (
                                action
                              )}
                            </span>
                            <a
                              onClick={() => {
                                this.props.onDeleteNewSayingAction(action);
                              }}
                              className={classes.deleteActionX}
                            >
                              x
                            </a>
                          </div>
                        );
                      })}
                      <img
                        id="addActions"
                        className={classes.addActionIcon}
                        src={addActionIcon}
                        onClick={evt => {
                          this.setState({
                            changedPage: false,
                            openActions: true,
                            anchorEl: evt.currentTarget,
                          });
                        }}
                      />
                      <span
                        className={classes.sayingEnter}
                        onClick={ev => {
                          if (this.state.currentNewSaying.trim() !== '') {
                            if (
                              !category ||
                              category === '' ||
                              category === 'select'
                            ) {
                              this.setState({
                                errorCategory: true,
                              });
                            } else {
                              this.setState({
                                errorCategory: false,
                              });
                              ev.preventDefault();
                              this.props.onAddSaying(
                                this.state.currentNewSaying,
                              );
                              this.setState({
                                currentNewSaying: '',
                              });
                            }
                          }
                        }}
                      >
                        {intl.formatMessage(messages.sayingEnter)}
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
              <FilterSelect
                showRecent
                value="select"
                valueDisplayField="actionName"
                valueField="actionName"
                onSelect={value => {
                  if (value) {
                    // Then add the saying for the new action
                    this.props.onAddNewSayingAction(value);
                  }
                  this.setState({
                    changedPage: false,
                    openActions: false,
                    anchorEl: null,
                  });
                }}
                onSearch={this.props.onSearchActions}
                onGoToUrl={({ isEdit = false, url = '' }) => {
                  this.props.onClearSayingToAction();
                  if (isEdit) {
                    this.props.onGoToUrl(url);
                  } else {
                    this.props.onGoToUrl(
                      `/agent/${this.props.agentId}/action/create`,
                    );
                  }
                }}
                onEditRoutePrefix={`/agent/${this.props.agentId}/action/`}
                onCreateRoute={`/agent/${this.props.agentId}/action/create`}
                filteredValues={this.props.agentFilteredActions}
                values={this.props.agentActions}
                SelectProps={{
                  open: this.state.openActions,
                  onClose: () => {
                    this.setState({
                      changedPage: false,
                      openActions: false,
                      anchorEl: null,
                    });
                  },
                  onOpen: () => {
                    this.setState({
                      changedPage: false,
                      openActions: true,
                    });
                  },
                  MenuProps: {
                    anchorEl: this.state.anchorEl,
                  },
                }}
                style={{
                  display: 'none',
                }}
                displayEdit
              />
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            {sayings.length > 0 ? (
              <Grid container>
                <Typography className={classes.highlightLabel}>
                  <FormattedMessage {...messages.highlightTooltip} />
                </Typography>
                <Table>
                  <TableBody>
                    {sayings.map((saying, index) => (
                      <TableRow key={`${saying}_${index}`}>
                        <TableCell>
                          <SayingRow
                            agentId={this.props.agentId}
                            saying={saying}
                            onDeleteAction={this.props.onDeleteAction}
                            agentKeywords={this.props.agentKeywords}
                            agentActions={this.props.agentActions}
                            agentCategories={this.props.agentCategories}
                            onChangeSayingCategory={
                              this.props.onChangeSayingCategory
                            }
                            onTagKeyword={this.props.onTagKeyword}
                            onUntagKeyword={this.props.onUntagKeyword}
                            onAddAction={this.props.onAddAction}
                            onGoToUrl={this.props.onGoToUrl}
                            onSendSayingToAction={
                              this.props.onSendSayingToAction
                            }
                            agentFilteredActions={
                              this.props.agentFilteredActions
                            }
                            onSearchActions={this.props.onSearchActions}
                          />
                        </TableCell>
                        <TableCell className={classes.deleteCell}>
                          <img
                            onClick={() => {
                              this.props.onDeleteSaying(
                                saying.id,
                                saying.category,
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
                <Grid
                  id="pageControl"
                  className={classes.pageControl}
                  item
                  xs={12}
                >
                  <Grid className={classes.pageSubControl}>
                    <Typography className={classes.pageSizeLabels}>
                      <FormattedMessage {...messages.show} />
                    </Typography>
                    <TextField
                      select
                      className={classes.pageTextfield}
                      id="pageSize"
                      value={this.props.sayingsPageSize}
                      onChange={evt => {
                        this.props.changeSayingsPageSize(evt.target.value);
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
                      onClick={
                        this.props.currentSayingsPage > 1
                          ? this.props.moveSayingsPageBack
                          : null
                      }
                      className={
                        this.props.currentSayingsPage > 1
                          ? classes.pageCursors
                          : classes.pageCursorsDisabled
                      }
                    >
                      <FormattedMessage {...messages.backPage} />
                    </Typography>
                    <TextField
                      id="page"
                      margin="normal"
                      value={this.props.currentSayingsPage}
                      onChange={evt => {
                        evt.target.value === ''
                          ? this.props.changeSayingsPage(1)
                          : evt.target.value <=
                              this.props.numberOfSayingsPages &&
                            evt.target.value >= 0
                          ? this.props.changeSayingsPage(evt.target.value)
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
                        max: this.props.numberOfSayingsPages,
                        step: 1,
                      }}
                      className={classes.pageTextfield}
                      type="number"
                    />
                    <Typography className={classes.pagesLabel}>
                      / {this.props.numberOfSayingsPages}
                    </Typography>
                    <Typography
                      onClick={
                        this.props.currentSayingsPage <
                        this.props.numberOfSayingsPages
                          ? this.props.moveSayingsPageForward
                          : null
                      }
                      className={
                        this.props.currentSayingsPage <
                        this.props.numberOfSayingsPages
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
    );
  }
}

SayingsDataForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  sayings: PropTypes.array,
  agentId: PropTypes.string,
  sayingsPageSize: PropTypes.number,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  agentCategories: PropTypes.array,
  agentFilteredCategories: PropTypes.array,
  agentFilteredActions: PropTypes.array,
  onAddSaying: PropTypes.func.isRequired,
  onDeleteSaying: PropTypes.func.isRequired,
  onDeleteAction: PropTypes.func.isRequired,
  onTagKeyword: PropTypes.func,
  onUntagKeyword: PropTypes.func,
  onAddAction: PropTypes.func,
  onGoToUrl: PropTypes.func,
  onSendSayingToAction: PropTypes.func,
  currentSayingsPage: PropTypes.number,
  numberOfSayingsPages: PropTypes.number,
  changeSayingsPage: PropTypes.func,
  moveSayingsPageBack: PropTypes.func,
  moveSayingsPageForward: PropTypes.func,
  changeSayingsPageSize: PropTypes.func,
  onSelectCategory: PropTypes.func,
  category: PropTypes.string,
  userSays: PropTypes.string,
  onSearchCategory: PropTypes.func,
  onSearchActions: PropTypes.func,
  newSayingActions: PropTypes.array,
  onAddNewSayingAction: PropTypes.func,
  onDeleteNewSayingAction: PropTypes.func,
  onClearSayingToAction: PropTypes.func,
  onChangeSayingCategory: PropTypes.func,
};

export default useShallowEqual(injectIntl(withStyles(styles)(SayingsDataForm)));
