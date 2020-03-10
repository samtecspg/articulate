import { Grid, InputAdornment, MenuItem, Table, TableBody, TableCell, TableRow, TextField, Tooltip, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Immutable from 'seamless-immutable';
import { useShallowEqual } from 'shouldcomponentupdate-children';
import FilterSelect from '../../../components/FilterSelect';
import addActionIcon from '../../../images/add-action-icon.svg';
import trashIcon from '../../../images/trash-icon.svg';
import messages from '../messages';
import SayingRow from './SayingRow';

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
    currentlyDeletingSaying: false,
  };

  constructor(props) {
    super(props);
  }

  scrollToNextPageCursor() {
    const pageControl = document.querySelector('#pageControl');
    if (pageControl) {
      pageControl.scrollIntoView(true);
    }
  }

  componentWillUpdate(nextProps) {
    if (this.state.currentlyDeletingSaying) {
      this.setState({
        currentlyDeletingSaying: false,
      });
    }
  }

  componentDidUpdate() {
  }

  render() {
    const { classes, intl, sayings, category, userSays, isReadOnly } = this.props;
    return (

      <Grid className={classes.formContainer} container item xs={12}>
        <Grid className={classes.formSubContainer} id="formContainer" container item xs={12}>
          <Grid container item xs={12}>
            {sayings.length > 0 ? (
              <Grid container>
                <Table>
                  <TableBody>
                    {sayings.map((saying, index) => (
                      <TableRow key={`${saying}_${index}`}>
                        <TableCell>
                          <SayingRow
                            isReadOnly={isReadOnly}
                            agentId={this.props.agentId}
                            saying={saying.saying}
                            onDeleteAction={this.props.onDeleteAction}
                            agentKeywords={this.props.agentKeywords}
                            agentActions={this.props.agentActions}
                            agentCategories={this.props.agentCategories}
                            onChangeSayingCategory={this.props.onChangeSayingCategory}
                            onTagKeyword={this.props.onTagKeyword}
                            onUntagKeyword={this.props.onUntagKeyword}
                            onAddAction={this.props.onAddAction}
                            onGoToUrl={this.props.onGoToUrl}
                            onSendSayingToAction={this.props.onSendSayingToAction}
                            agentFilteredActions={this.props.agentFilteredActions}
                            onSearchActions={this.props.onSearchActions}
                            onUpdateSayingData={this.props.onUpdateSayingData}
                          />
                        </TableCell>
                        {!isReadOnly && (
                          <TableCell className={classes.deleteCell}>
                            <img
                              onClick={() => {
                                if (!this.state.currentlyDeletingSaying) {
                                  this.setState({
                                    currentlyDeletingSaying: true,
                                  });
                                  debugger;
                                  this.props.onDeleteSaying(saying.saying.id, saying.saying.Category[0].id);
                                }
                              }}
                              className={classes.deleteIcon}
                              src={trashIcon}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
  onAddSaying: PropTypes.func,
  onDeleteSaying: PropTypes.func,
  onDeleteAction: PropTypes.func,
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
  onUpdateSayingData: PropTypes.func,
  isReadOnly: PropTypes.bool,
};

SayingsDataForm.defaultProps = {
  isReadOnly: false,
};
export default useShallowEqual(injectIntl(withStyles(styles)(SayingsDataForm)));
