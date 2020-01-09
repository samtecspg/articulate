import React from 'react';

import PropTypes from 'prop-types';
import { Grid, Tooltip, Select, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ContentEditable from 'react-contenteditable';

import { intlShape, injectIntl } from 'react-intl';
import addActionIcon from '../../../images/add-action-icon.svg';
import trashIcon from '../../../images/trash-icon.svg';
import copyIcon from '../../../images/icon-copy.svg';
import richResponsesIcon from '../../../images/rich-responses-icon.svg';
import FilterSelect from '../../../components/FilterSelect';
import messages from '../messages';

const styles = {
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
  addActionIcon: {
    '&:hover': {
      filter: 'invert(1)',
    },
    cursor: 'pointer',
    verticalAlign: 'middle',
    paddingRight: '1px',
    height: '15px',
  },
  icon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    height: '15px',
    cursor: 'pointer',
    verticalAlign: 'middle',
    paddingLeft: '5px',
  },
  response: {
    paddingRight: '5px',
    lineHeight: '1.5',
    '&:focus': {
      outline: '0px solid transparent',
    },
  },
  responseInput: {
    border: 'none',
    padding: '0px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class ResponseRow extends React.Component {
  constructor() {
    super();
    this.contentEditable = React.createRef();
  }

  state = {
    openActions: false,
    openRichResponses: false,
    anchorEl: null,
    anchorRichResponsesEl: null,
  };

  render() {
    const { classes, action, response, responseIndex, intl } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <ContentEditable
            className={classes.response}
            innerRef={this.contentEditable}
            html={response.textResponse} // innerHTML of the editable div
            onChange={evt => {
              this.props.onEditActionResponse(evt.target.value, responseIndex);
            }} // handle innerHTML change
            tagName="span" // Use a custom HTML tag (uses a div by default)
          />
          {response.actions.map((chainedAction, actionIndex) => {
            let actionId = this.props.agentActions.filter(
              agentAction => agentAction.actionName === chainedAction,
            );
            actionId = actionId
              ? Array.isArray(actionId) && actionId.length > 0
                ? actionId[0].id
                : 2
              : null;
            return (
              <div
                key={`responseAction_${actionIndex}`}
                className={classes.actionBackgroundContainer}
              >
                <span
                  className={classes.actionLabel}
                  onClick={() => {
                    this.props.onGoToUrl(
                      `/agent/${
                        this.props.agentId
                      }/actionDummy/${actionId}?ref=action&actionId=${
                        action.id
                      }`,
                    );
                  }}
                >
                  {chainedAction}
                </span>
                <a
                  onClick={() => {
                    this.props.onUnchainActionFromResponse(
                      responseIndex,
                      actionIndex,
                    );
                  }}
                  className={classes.deleteActionX}
                >
                  x
                </a>
              </div>
            );
          })}
          <Tooltip
            key="addAction"
            title={intl.formatMessage(messages.addAction)}
            placement="top"
          >
            <img
              onClick={evt =>
                this.setState({
                  anchorEl: evt.target,
                  openActions: true,
                })
              }
              className={classes.addActionIcon}
              src={addActionIcon}
            />
          </Tooltip>
          <Tooltip
            key="richResponses"
            title={intl.formatMessage(messages.richResponses)}
            placement="top"
          >
            <img
              onClick={evt =>
                this.setState({
                  anchorRichResponsesEl: evt.target,
                  openRichResponses: true,
                })
              }
              className={classes.icon}
              src={richResponsesIcon}
            />
          </Tooltip>
          <Tooltip
            key="copyResponse"
            title={intl.formatMessage(messages.copyResponses)}
            placement="top"
          >
            <img
              onClick={() => {
                this.props.onCopyResponse(response.textResponse);
              }}
              className={classes.icon}
              src={copyIcon}
            />
          </Tooltip>
          <Tooltip
            key="deleteResponse"
            title={intl.formatMessage(messages.deleteResponse)}
            placement="top"
          >
            <img
              key="deleteResponse"
              onClick={() => {
                this.props.onDeleteResponse(responseIndex);
              }}
              className={classes.icon}
              src={trashIcon}
            />
          </Tooltip>
          <Select
            open={this.state.openRichResponses}
            onClose={() => {
              this.setState({
                openRichResponses: false,
                anchorRichResponsesEl: null
              });
            }}
            MenuProps={{
              anchorEl: this.state.anchorRichResponsesEl
            }}
            style={{
              display: 'none'
            }}
          >

          </Select>
          <FilterSelect
            showRecent
            value="select"
            valueDisplayField="actionName"
            valueField="actionName"
            onSelect={value => {
              if (value) {
                this.props.onChainActionToResponse(responseIndex, value);
              }
            }}
            onSearch={this.props.onSearchActions}
            onGoToUrl={({ isEdit = false, url = '' }) => {
              if (isEdit) {
                this.props.onGoToUrl(`${url}?ref=action&actionId=${action.id}`);
              } else {
                this.props.onGoToUrl(
                  `/agent/${
                    this.props.agentId
                  }/actionDummy/create?ref=action&actionId=${action.id}`,
                );
              }
            }}
            onEditRoutePrefix={`/agent/${this.props.agentId}/actionDummy/`}
            onCreateRoute={`/agent/${
              this.props.agentId
            }/actionDummy/create?ref=action&actionId=${action.id}`}
            filteredValues={this.props.agentFilteredActions.filter(
              agentFilteredAction => {
                return (
                  agentFilteredAction.actionName !== action.actionName &&
                  response.actions.indexOf(agentFilteredAction.actionName) ===
                    -1
                );
              },
            )}
            values={this.props.agentActions.filter(agentAction => {
              return (
                agentAction.actionName !== action.actionName &&
                response.actions.indexOf(agentAction.actionName) === -1
              );
            })}
            SelectProps={{
              open: this.state.openActions,
              onClose: () =>
                this.setState({
                  openActions: false,
                  anchorEl: null,
                }),
              onOpen: evt =>
                this.setState({
                  anchorEl: evt.target,
                  openActions: true,
                }),
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
    );
  }
}

ResponseRow.propTypes = {
  intl: intlShape,
  classes: PropTypes.object,
  response: PropTypes.object,
  action: PropTypes.object,
  responseIndex: PropTypes.number,
  agentActions: PropTypes.array,
  onChainActionToResponse: PropTypes.func,
  onUnchainActionFromResponse: PropTypes.func,
  onEditActionResponse: PropTypes.func,
  onCopyResponse: PropTypes.func,
  onDeleteResponse: PropTypes.func,
  agentFilteredActions: PropTypes.array,
  onSearchActions: PropTypes.func,
  onGoToUrl: PropTypes.func,
  agentId: PropTypes.string,
};

export default injectIntl(withStyles(styles)(ResponseRow));
