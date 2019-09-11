import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  Button,
  Modal,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { PROXY_ROUTE_PREFIX } from '../../../../common/constants';

import messages from '../messages';

import playHelpIcon from '../../../images/play-help-icon.svg';
import DeleteFooter from '../../../components/DeleteFooter';
import actionsJSON from './actions.json';
import ChannelCard from './ChannelCard';
import gravatars from '../../../components/Gravatar';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/terminal';

const styles = {
  headerContainer: {
    backgroundColor: '#f6f7f8',
    border: '1px solid #c5cbd8',
    borderRadius: '5px',
    marginBottom: '60px',
  },
  titleContainer: {
    padding: '25px',
  },
  titleTextHelpContainer: {
    display: 'inline',
    position: 'relative',
    bottom: '6px',
  },
  title: {
    display: 'inline',
    paddingRight: '25px',
  },
  formDescriptionContainer: {
    margin: '15px 0px',
  },
  formDescription: {
    fontSize: '14px',
    fontWeight: 300,
  },
  helpButton: {
    display: 'inline',
    width: '50px',
    height: '20px',
  },
  playIcon: {
    height: '10px',
  },
  helpText: {
    fontSize: '9px',
    fontWeight: 300,
    position: 'relative',
    bottom: '2px',
    paddingLeft: '2px',
  },
  modalContent: {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    boxShadow:
      '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '40px 25px',
  },
  uiColorLabel: {
    marginTop: '13px',
    marginBottom: '10px',
    color: '#a2a7b1',
    fontWeight: 400,
    fontSize: '12px',
  },
  disabledFields: {
    backgroundColor: '#eaeaea',
  },
  cardsLabel: {
    marginTop: '20px',
    marginBottom: '10px'
  },
  agentIcon: {
    marginRight: '5px',
    height: '20px',
  },
  agentName: {
    position: 'relative',
    bottom: '3px',
    fontWeight: '500',
  },
  editorLabel: {
    marginTop: '20px',
  },
  editor: {
    marginTop: '30px',
  }
};

/* eslint-disable react/prefer-stateless-function */
class ConnectionForm extends React.Component {
  constructor(props) {
    super(props);
    this.generateActionExport = this.generateActionExport.bind(this);
  }

  state = {
    openModal: false,
    actionExport: null,
  };

  generateActionExport() {
    const { newConnection, connection } = this.props;
    if (!newConnection && connection.channel === 'google-home') {
      const { queryPatterns } = connection.details;
      const clonedAction = _.cloneDeep(actionsJSON);
      clonedAction.actions[0].intent.trigger.queryPatterns = queryPatterns;
      clonedAction.conversations.articulate_intent.url = `${
        window.location.protocol
      }//${window.location.hostname}${window.location.port === 80 ? null : (window.location.port ? `:${window.location.port}` : '')}${PROXY_ROUTE_PREFIX}/connection/${
        connection.id
      }/external`;
      this.setState({
        actionExport: clonedAction,
      });
    }
  }

  componentWillMount() {
    this.generateActionExport();
  }

  componentDidUpdate(prevProps) {
    const { newConnection } = this.props;
    if (!newConnection && newConnection !== prevProps.newConnection) {
      this.generateActionExport();
    }
  }

  handleOpen = () => {
    this.setState({
      openModal: true,
    });
  };

  handleClose = () => {
    this.setState({
      openModal: false,
    });
  };

  fillEmptyCards() {
    const numberOfPrebuiltChannels = Object.keys(
      this.props.channels,
    ).length;
    const numberOfEmptyCardsNeeded = 4 - (numberOfPrebuiltChannels % 4);
    const emptyCards = [];
    for (let index = 0; index < numberOfEmptyCardsNeeded; index++) {
      emptyCards.push(<ChannelCard key={`empty_${index}`} isEmpty />);
    }
    return emptyCards;
  }

  render() {
    const { classes, intl, connection, channels, agents } = this.props;

    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
              <FormattedMessage {...messages.connectionFormTitle} />
            </Typography>
            <Button
              className={classes.helpButton}
              variant="outlined"
              onClick={this.handleOpen}
            >
              <img
                className={classes.playIcon}
                src={playHelpIcon}
                alt={intl.formatMessage(messages.playHelpAlt)}
              />
              <span className={classes.helpText}>
                <FormattedMessage {...messages.help} />
              </span>
            </Button>
            <Modal open={this.state.openModal} onClose={this.handleClose}>
              <Grid className={classes.modalContent} container>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/Gus06Z1-cNw"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Grid>
            </Modal>
          </Grid>
          <Grid className={classes.formDescriptionContainer} container>
            <Typography className={classes.formDescription}>
              <FormattedMessage {...messages.connectionFormDescription} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid className={classes.formContainer} container item xs={12}>
            <Grid
              className={classes.formSubContainer}
              id="formContainer"
              container
              item
              xs={12}
            >
              <Grid container item xs={12}>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    select
                    id="agent"
                    value={connection.agent || 'select'}
                    label={intl.formatMessage(messages.agentSelect)}
                    onChange={evt => {
                      if (evt.target.value === 'select') {
                        this.props.onChangeConnectionData('agent', '');
                        this.props.onResetActions();
                      } else {
                        this.props.onChangeConnectionData(
                          'agent',
                          parseInt(evt.target.value),
                        );
                        this.props.onLoadActions(evt.target.value);
                      }
                    }}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText={intl.formatMessage(messages.requiredField)}
                    error={this.props.errorState.agent}
                  >
                    <MenuItem key="select" value="select">
                      <FormattedMessage {...messages.selectAValue} />
                    </MenuItem>
                    {agents.map(agent => (
                      <MenuItem key={agent.id} value={agent.id}>
                        <span>
                          {gravatars[agent.gravatar - 1]({
                            color: agent.uiColor,
                            className: classes.agentIcon,
                          })}
                          <span style={{
                            color: agent.uiColor,
                          }} className={classes.agentName}>
                            {agent.agentName}
                          </span>
                        </span>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <InputLabel className={classes.cardsLabel} shrink>Pick a chat platform:</InputLabel>
                <Grid container spacing={16} justify="space-between" item md={12} sm={12} xs={12}>
                  {Object.keys(channels).map(
                    (channel, index) => (
                      <ChannelCard
                        disabled={!connection.agent || !this.props.newConnection}
                        selected={channel === connection.channel}
                        channelKey={channel}
                        key={`channel_${index}`}
                        channel={channels[channel]}
                        onClick={() => {
                          if (connection.agent && this.props.newConnection){
                            this.props.onChangeConnectionData(
                              'channel',
                              channel,
                            );
                          }
                        }}
                      />
                    ),
                  )}
                  {this.fillEmptyCards()}
                </Grid>
              </Grid>
              {!this.props.newConnection ? (connection.channel === 'web-demo' ? 
                <Grid container item xs={12}>
                  <Grid item xs={12}>
                    <TextField
                      id="shareLink"
                      value={`${window.location.protocol}//${
                        window.location.hostname
                      }${window.location.port === 80 ? null : (window.location.port ? `:${window.location.port}` : '')}/demo/${
                        connection.id
                      }`}
                      label={intl.formatMessage(messages.shareUrl)}
                      margin="normal"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                      inputProps={{
                        className: classes.disabledFields,
                      }}
                    />
                  </Grid>
                </Grid> : 
                (connection.channel === 'chat-widget' ?
                  <Grid container item xs={12}>
                    <Grid item xs={12}>
                      <TextField
                        id="socketUrl"
                        value={`ws://${
                          window.location.hostname
                        }:7500`}
                        label={intl.formatMessage(messages.socketUrl)}
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        inputProps={{
                          className: classes.disabledFields,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="socketPath"
                        value={`/connection/${
                          connection.id
                        }/external`}
                        label={intl.formatMessage(messages.socketPath)}
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        inputProps={{
                          className: classes.disabledFields,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="converseUrl"
                        value={`${window.location.protocol}//${
                          window.location.hostname
                        }${window.location.port === 80 ? null : (window.location.port ? `:${window.location.port}` : '')}${PROXY_ROUTE_PREFIX}/connection/${
                          connection.id
                        }/external`}
                        label={intl.formatMessage(messages.converseUrl)}
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        inputProps={{
                          className: classes.disabledFields,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl className={classes.editorLabel} fullWidth>
                        <InputLabel shrink>{intl.formatMessage(messages.copySnippet)}</InputLabel>
                      </FormControl>
                      <AceEditor
                        className={classes.editor}
                        width="100%"
                        height="550px"
                        mode="html"
                        theme="terminal"
                        name="snippet"
                        readOnly={true}
                        fontSize={14}
                        showPrintMargin
                        showGutter
                        highlightActiveLine
                        value={`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no">
    <title>Dev Widget</title>
    <link href="https://cdn.jsdelivr.net/gh/samtecspg/articulate-webchat@0.0.1/lib/articulate-webchat.css" rel="stylesheet" type="text/css">
    <script src="https://cdn.jsdelivr.net/gh/samtecspg/articulate-webchat@0.0.1/lib/articulate-webchat.js"></script>
  </head>
  <body>
    <div id="webchat"></div>
    <script>
      WebChat.default.init({
        selector: '#webchat',
        socketUrl: 'ws://${window.location.hostname}:7500',
        socketPath: '/connection/${connection.id}/external',
        converseUrl: '${window.location.protocol}//${window.location.hostname}${window.location.port === 80 ? null : (window.location.port ? `:${window.location.port}` : '')}${PROXY_ROUTE_PREFIX}/connection/${connection.id}/external',
        title: '${connection.details.title}',
        subtitle: '${connection.details.subtitle}',
        senderPlaceHolder: 'Type a message...',
        titleAvatar: 'https://static.thenounproject.com/png/815603-200.png',
        profileAvatar: 'https://static.thenounproject.com/png/815603-200.png'
      });
    </script>
  </body>
</html>                                              
                        `}
                        setOptions={{
                          useWorker: false,
                          showLineNumbers: true,
                          tabSize: 2,
                        }}
                        editorProps={{
                          $blockScrolling: Infinity,
                        }}
                      />
                    </Grid>
                  </Grid> :
                  (<Grid container item xs={12}>
                    <Grid item xs={12}>
                      <TextField
                        id="callbackUrl"
                        value={`${window.location.protocol}//${
                          window.location.hostname
                        }${window.location.port === 80 ? null : (window.location.port ? `:${window.location.port}` : '')}${PROXY_ROUTE_PREFIX}/connection/${
                          connection.id
                        }/external`}
                        label={intl.formatMessage(messages.callbackUrl)}
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        inputProps={{
                          className: classes.disabledFields,
                        }}
                      />
                    </Grid>
                    {connection.channel === 'facebook' ? (
                      <Grid item xs={12}>
                        <TextField
                          id="verifyToken"
                          value={connection.details.verifyToken}
                          label={intl.formatMessage(messages.verifyToken)}
                          margin="normal"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          inputProps={{
                            className: classes.disabledFields,
                          }}
                        />
                      </Grid>
                    ) : null}
                    {connection.channel === 'google-home' ? (
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          href={`data: text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(this.state.actionExport, null, 2),
                          )}`}
                          download="actions.json"
                          style={{
                            marginTop: '20px',
                          }}
                        >
                          <FormattedMessage {...messages.download} />
                        </Button>
                      </Grid>
                    ) : null}
                  </Grid>
                ))) : null}
            </Grid>
          </Grid>
        </Grid>
        {this.props.newConnection ? null : (
          <DeleteFooter
            onDelete={this.props.onDelete}
            type={intl.formatMessage(messages.instanceName)}
          />
        )}
      </Grid>
    );
  }
}

ConnectionForm.propTypes = {
  channels: PropTypes.object,
  agents: PropTypes.array,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  connection: PropTypes.object,
  onChangeConnectionData: PropTypes.func,
  errorState: PropTypes.object,
  onDelete: PropTypes.func,
  newConnection: PropTypes.bool,
  onLoadActions: PropTypes.func,
  onResetActions: PropTypes.func,
};

export default injectIntl(withStyles(styles)(ConnectionForm));
