import React from 'react';

import PropTypes from 'prop-types';
import { Grid, Tooltip, Select, MenuItem, Menu, Dialog, DialogContent, DialogTitle, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ContentEditable from 'react-contenteditable';

import { intlShape, injectIntl } from 'react-intl';
import addActionIcon from '../../../images/add-action-icon.svg';
import trashIcon from '../../../images/trash-icon.svg';
import copyIcon from '../../../images/icon-copy.svg';
import richResponsesIcon from '../../../images/rich-responses-icon.svg';
import pencilIcon from '../../../images/pencil-icon.svg';
import FilterSelect from '../../../components/FilterSelect';
import RichResponsesIcons from '../../../components/RichResponsesIcons';
import messages from '../messages';
import _ from 'lodash';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/mode/json';
import 'brace/theme/terminal';

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
  richResponsesActions: {
    float: 'right',
  },
  responseTypeActiveIndicator: {
    height: '10px',
    width: '10px',
    borderRadius: '50px',
    display: 'inline-flex',
    marginRight: '5px'
  },
  dialogRichResponse: {
    borderRadius: '5px',
    border: "1px solid #4e4e4e",
    width: '550px'
  },
  dialogTitleContainer: {
    backgroundColor: "#f6f7f8",
    borderBottom: "1px solid #4e4e4e",
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
  },
  dialogContentContainer: {
    paddingTop: '20px'
  },
  dialogRichResponseIcon: {
    height: '20px'
  },
  dialogRichResponseTitle: {
    fontSize: '18px',
    marginLeft: '5px',
    position: 'relative',
    bottom: '2px'
  },
  dialogRichResponseDescription: {
    fontSize: '14px'
  },
  dialogEditor: {
    borderRadius: '5px'
  },
  addButton: {
    float: 'right'
  },
  hintText: {
    color: '#a2a7b1',
    marginTop: '20px',
    fontSize: '12px'
  },
  hintBorder: {
    border: '1px solid #c5cbd8',
    borderRadius: '5px',
    padding: '2px 3px'
  },
  dropdownRichResponseIcon: {
    height: '15px',
    position: 'relative',
    top: '2px',
    marginLeft: '5px'
  }
};

/* eslint-disable react/prefer-stateless-function */
class ResponseRow extends React.Component {
  constructor() {
    super();
    this.contentEditable = React.createRef();
    this.toggleRichResponseEditor = this.toggleRichResponseEditor.bind(this);
  }

  state = {
    openActions: false,
    openRichResponses: false,
    openRichResponseEditor: false,
    anchorEl: null,
    anchorRichResponsesEl: null,
    editingRichResponse: false,
    richResponseType: '',
    richResponseTitle: '',
    richResponseDescription: '',
    richResponsePayload: ''
  };

  toggleRichResponseEditor = (value, richResponse) => {
    const { richResponses, response } = this.props;
    this.setState({
      openRichResponseEditor: value
    })
    if (value){
      const existingRichResponse = response.richResponses.filter((richResponseTemp) => {

        return richResponseTemp.type === richResponses[richResponse].type;
      });
      let payload = JSON.stringify(richResponses[richResponse].defaultPayload, null, 2);
      if (existingRichResponse.length > 0){
        payload = existingRichResponse[0].data;
      }
      this.setState({
        editingRichResponse: existingRichResponse.length > 0,
        richResponseType: richResponses[richResponse].type,
        richResponseTitle: richResponses[richResponse].name,
        richResponseDescription: richResponses[richResponse].description,
        richResponsePayload: payload
      });
    }
    else {
      this.setState({
        editingRichResponse: false,
        richResponseType: '',
        richResponseTitle: '',
        richResponseDescription: '',
        richResponsePayload: null
      });
    }
  }

  render() {
    const { classes, action, response, responseIndex, intl, richResponses, onAddRichResponse, onDeleteRichResponse, onEditRichResponse } = this.props;
    const usedRichResponses = _.map(response.richResponses, 'type');
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
          {richResponses &&
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
          }
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
          {
            richResponses &&
            <Select
              value=''
              open={this.state.openRichResponses}
              onClose={() => {
                this.setState({
                  openRichResponses: false,
                  anchorRichResponsesEl: null
                });
              }}
              MenuProps={{
                anchorEl: this.state.anchorRichResponsesEl,
                PaperProps: {
                  style: {
                    minWidth: '250px',
                  }
                }
              }}
              style={{
                display: 'none'
              }}
              onChange={(evt) => {
                evt.preventDefault();
                if (
                  !evt._targetInst ||
                  (evt._targetInst && evt._targetInst.type !== 'img')
                ) {
                  this.toggleRichResponseEditor(true, evt.target.value);
                }
              }}
            >
              {
                Object.keys(richResponses).map((richResponse, index) => {
                  return (
                    <MenuItem value={richResponse} key={`richResponseType_${index}`}>
                      <Grid container>
                        {
                          usedRichResponses.length > 0 &&
                          <Grid item xs={1}>
                            {usedRichResponses.indexOf(richResponses[richResponse].type) > -1 &&
                              <div className={classes.responseTypeActiveIndicator} style={{ backgroundColor: "#00c582" }}></div>
                            }
                          </Grid>
                        }
                        <Grid item xs={2}>
                          <RichResponsesIcons className={classes.dropdownRichResponseIcon} logo={richResponses[richResponse].type} />
                        </Grid>
                        <Grid item xs={usedRichResponses.length > 0 ? 9 : 10}>
                          {richResponses[richResponse].name}
                          {usedRichResponses.indexOf(richResponses[richResponse].type) > -1 &&
                            <div className={classes.richResponsesActions}>
                              <img style={{zIndex: 99999999999 }} onClick={() => { this.toggleRichResponseEditor(true, richResponse); }} className={classes.addActionIcon} src={pencilIcon} />
                              <img style={{zIndex: 99999999999 }} onClick={() => { onDeleteRichResponse(responseIndex, { type: richResponses[richResponse].type } ); }} className={classes.icon} src={trashIcon} />
                            </div>
                          }
                        </Grid>
                      </Grid>
                    </MenuItem>
                  )
                })
              }
            </Select>
          }
          <Dialog
            PaperProps={{
              className: classes.dialogRichResponse
            }}
            open={this.state.openRichResponseEditor}
            onClose={() => { this.toggleRichResponseEditor(false) }}
          >
            <DialogTitle className={classes.dialogTitleContainer}>
              <Grid item xs={12}>
                <RichResponsesIcons className={classes.dialogRichResponseIcon} logo={this.state.richResponseType} />
                <span className={classes.dialogRichResponseTitle}>{this.state.richResponseTitle}</span>
                <Button
                  className={classes.addButton}
                  onClick={() => {
                    this.state.editingRichResponse ?
                    onEditRichResponse(responseIndex, {
                      type: this.state.richResponseType,
                      data: this.state.richResponsePayload
                    })
                    :
                    onAddRichResponse(responseIndex, {
                      type: this.state.richResponseType,
                      data: this.state.richResponsePayload
                    });
                    this.toggleRichResponseEditor(false);
                  }}
                  variant="contained"
                >
                  {intl.formatMessage(this.state.editingRichResponse ? messages.editButton : messages.addButton)}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <span className={classes.dialogRichResponseDescription}>{this.state.richResponseDescription}</span>
                <div className={classes.hintText}>
                  <span>{intl.formatMessage(messages.hint1)}&nbsp;</span>
                  <span className={classes.hintBorder}>{'{{}}'}</span>
                  <span>&nbsp;{intl.formatMessage(messages.hint2)}</span>
                </div>
              </Grid>
            </DialogTitle>
            <DialogContent className={classes.dialogContentContainer}>
              <AceEditor
                className={classes.dialogEditor}
                width="100%"
                height="300px"
                mode="json"
                theme="terminal"
                name="richResponsePayload"
                readOnly={false}
                onChange={value =>
                  this.setState({ richResponsePayload: value })
                }
                fontSize={14}
                showPrintMargin
                showGutter
                highlightActiveLine
                value={typeof this.state.richResponsePayload === 'string' ? this.state.richResponsePayload : ''}
                setOptions={{
                  useWorker: false,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
                editorProps={{
                  $blockScrolling: Infinity,
                }}
              />
            </DialogContent>
          </Dialog>
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
  richResponses: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onAddRichResponse: PropTypes.func.isRequired,
  onDeleteRichResponse: PropTypes.func.isRequired,
  onEditRichResponse: PropTypes.func.isRequired,
};

export default injectIntl(withStyles(styles)(ResponseRow));
