import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import FilterSelect from '../../../components/FilterSelect';
import Star from '../../../components/Star';

import addActionIcon from '../../../images/add-action-icon.svg';

import messages from '../messages';

import HighlightedSaying from './HighlightedSaying';

const styles = {
  userSays: {
    paddingRight: '5px',
    lineHeight: '1.5',
  },
  addActionIcon: {
    height: '15px',
    '&:hover': {
      filter: 'invert(1)',
    },
    cursor: 'pointer',
    verticalAlign: 'middle',
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
    marginTop: '2px',
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
  categoryBackgroundContainer: {
    margin: '0px 5px 0px 0px',
    fontSize: '12px',
    padding: '4px 8px 4px 10px',
    backgroundColor: '#f6f7f8',
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5px',
    marginTop: '2px',
  },
  categoryLabel: {
    textDecoration: 'none',
    color: 'inherit',
    fontSize: '12px',
  },
  categorySelectContainer: {
    margin: '0px',
  },
  categorySelectInputContainer: {
    margin: '0px !important',
  },
  categorySelect: {
    paddingRight: '22px',
    padding: '5px',
    backgroundColor: '#f6f7f8',
    border: 'none',
  },
};

/* eslint-disable react/prefer-stateless-function */
class SayingRow extends React.Component {
  constructor() {
    super();
    this.onHighlight = this.onHighlight.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    openActions: false,
    openKeywords: false,
    anchorEl: null,
    highlightedValue: null,
    start: null,
    end: null,
    menuLocation: {
      left: 0,
      top: 0,
    },
    starHovered: false,
  };

  handleClose = selectName => {
    if (selectName === 'actions') {
      this.setState({
        openActions: false,
        anchorEl: null,
      });
    }
    if (selectName === 'keywords') {
      this.setState({
        openKeywords: false,
        anchorEl: null,
      });
    }
  };

  handleOpen = (selectName, target) => {
    if (selectName === 'actions') {
      this.setState({
        anchorEl: target,
        openActions: true,
      });
    }
    if (selectName === 'keywords') {
      this.setState({
        anchorEl: target,
        openKeywords: true,
      });
    }
  };

  handleChange(selectName, selectedValue) {
    if (selectName === 'actions') {
      if (selectedValue === 'create') {
        this.props.onSendSayingToAction(this.props.saying);
        this.props.onGoToUrl(`/agent/${this.props.agentId}/action/create`);
      }
      else {
        this.props.onAddAction(this.props.saying, selectedValue);
      }
    }
    if (selectName === 'keywords') {
      if (selectedValue === 'create') {
        this.props.onGoToUrl(`/agent/${this.props.agentId}/keyword/create`);
      }
      else {
        const keyword = selectedValue.split(',');
        const keywordId = keyword[0]; // TODO: change this to parseInt(keyword[0]) when the id of the keyword transforms into an integer
        const keywordName = keyword[1];
        this.props.onTagKeyword(
          this.props.saying,
          this.state.highlightedValue,
          this.state.start,
          this.state.end,
          keywordId,
          keywordName,
        );
      }
    }
  }

  onHighlight(evt) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const highlightedValue = selection.toString();
    const offset = this.props.saying.userSays.indexOf(
      selection.anchorNode.textContent,
    ); // calculates where the chunk starts in the saying
    const start = range.startOffset + offset;
    const end = range.endOffset + offset;

    const highlightRectangle = range.getClientRects();

    if (highlightedValue.trim()) {
      this.setState({
        menuLocation: {
          left: highlightRectangle[0].right + 5, // The menu is going to open just to the right of the highlight,
          top: highlightRectangle[0].top,
        },
        highlightedValue,
        start,
        end,
      });
      this.handleOpen('keywords', evt.target);
    }
  }

  render() {
    const { classes, saying, agentKeywords, isReadOnly } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={16}>
            <div style={{ width: '100px', marginTop: '5px' }}>
              <TextField
                disabled={isReadOnly}
                className={classes.categorySelectContainer}
                select
                id="category"
                value={saying.category}
                onChange={evt => {
                  this.props.onChangeSayingCategory(saying, evt.target.value);
                }}
                margin="normal"
                fullWidth
                InputProps={{
                  className: classes.categorySelectInputContainer,
                }}
                inputProps={{
                  className: classes.categorySelect,
                }}
              >
                {this.props.agentCategories.map((category, index) => (
                  // TODO: return the category id in the API to be able to select the category id of the saying in
                  <MenuItem
                    key={`category_${index}`}
                    style={{ minWidth: '150px' }}
                    value={category.id}
                  >
                    <span className={classes.categoryLabel}>
                      {category.categoryName}
                    </span>
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <Star
              style={{ width: '15px', height: '15px', position: 'relative', top: '12px', marginLeft: '5px', cursor: `${isReadOnly ? 'default' : 'pointer'}` }}
              starred={saying.starred}
              hovered={this.state.starHovered}
              onMouseEnter={() => !isReadOnly && this.setState({ starHovered: true })}
              onMouseLeave={() => !isReadOnly && this.setState({ starHovered: false })}
              onClick={() => !isReadOnly && this.props.onUpdateSayingData(saying, 'starred', !saying.starred)}
            />
            <Grid item md={10} xs={8}>
              <span
                className={classes.userSays}
                onMouseUp={evt => {
                  this.onHighlight(evt);
                }}
              >
                <HighlightedSaying
                  isReadOnly={isReadOnly}
                  agentKeywords={agentKeywords}
                  keywords={saying.keywords}
                  text={saying.userSays}
                  keywordIndex={0}
                  lastStart={0}
                  onUntagKeyword={this.props.onUntagKeyword.bind(null, saying)}
                />
              </span>
              {saying.actions.map((action, index) => {
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
                    key={`sayingAction_${index}`}
                    className={classes.actionBackgroundContainer}
                  >
                    <span
                      className={classes.actionLabel}
                      onClick={() => {
                        this.props.onSendSayingToAction(saying);
                        this.props.onGoToUrl(
                          `/agent/${this.props.agentId}/action/${actionId}`,
                        );
                      }}
                    >
                      {action}
                    </span>
                    {!isReadOnly && (
                      <a
                        onClick={() => {
                          this.props.onDeleteAction(saying, action);
                        }}
                        className={classes.deleteActionX}
                      >
                        x
                      </a>
                    )}
                  </div>
                );
              })}
              {!isReadOnly && (
                <img
                  onClick={evt => this.handleOpen('actions', evt.target)}
                  className={classes.addActionIcon}
                  src={addActionIcon}
                />
              )}
              <FilterSelect
                showRecent
                value="select"
                valueDisplayField="actionName"
                valueField="actionName"
                onSelect={value => {
                  if (value) {
                    this.handleChange('actions', value);
                  }
                }}
                onSearch={this.props.onSearchActions}
                onGoToUrl={({ isEdit = false, url = '' }) => {
                  this.props.onSendSayingToAction(this.props.saying);
                  if (isEdit) {
                    this.props.onGoToUrl(url);
                  }
                  else {
                    this.props.onGoToUrl(
                      `/agent/${this.props.agentId}/action/create`,
                    );
                  }
                }}
                onEditRoutePrefix={`/agent/${this.props.agentId}/action/`}
                onCreateRoute={`/agent/${this.props.agentId}/action/create`}
                filteredValues={this.props.agentFilteredActions.filter(
                  agentFilteredAction =>
                    saying.actions.indexOf(agentFilteredAction.actionName) ===
                    -1,
                )}
                values={this.props.agentActions.filter(
                  agentAction =>
                    saying.actions.indexOf(agentAction.actionName) === -1,
                )}
                SelectProps={{
                  open: this.state.openActions,
                  onClose: () => this.handleClose('actions'),
                  onOpen: evt => this.handleOpen('actions', evt.target),
                  MenuProps: {
                    anchorEl: this.state.anchorEl,
                  },
                }}
                style={{
                  display: 'none',
                }}
                displayEdit
              />
              {!isReadOnly && (
                <FormControl>
                  <Select
                    style={{
                      display: 'none',
                    }}
                    open={this.state.openKeywords}
                    onClose={() => this.handleClose('keywords')}
                    value={10}
                    onChange={evt => {
                      evt.preventDefault();
                      this.handleChange('keywords', evt.target.value);
                    }}
                    MenuProps={{
                      anchorPosition: {
                        left: this.state.menuLocation.left,
                        top: this.state.menuLocation.top,
                      },
                      anchorReference: 'anchorPosition',
                    }}
                  >
                    <MenuItem value="create">
                      <FormattedMessage {...messages.newKeyword} />
                    </MenuItem>
                    {agentKeywords.map((keyword, index) => (
                      <MenuItem
                        key={`keyword_${index}`}
                        value={`${keyword.id},${keyword.keywordName}`}
                      >
                        <span style={{ color: keyword.uiColor }}>
                          {keyword.keywordName}
                        </span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

SayingRow.propTypes = {
  classes: PropTypes.object,
  saying: PropTypes.object,
  agentId: PropTypes.string,
  agentKeywords: PropTypes.array,
  agentActions: PropTypes.array,
  agentCategories: PropTypes.array,
  onDeleteAction: PropTypes.func,
  onUntagKeyword: PropTypes.func,
  onTagKeyword: PropTypes.func,
  onAddAction: PropTypes.func,
  onGoToUrl: PropTypes.func,
  onSendSayingToAction: PropTypes.func,
  onChangeSayingCategory: PropTypes.func,
  onSearchActions: PropTypes.func,
  agentFilteredActions: PropTypes.array,
  onUpdateSayingData: PropTypes.func,
  isReadOnly: PropTypes.bool,
};
SayingRow.defaultProps = {
  isReadOnly: false,
};

export default withStyles(styles)(SayingRow);
