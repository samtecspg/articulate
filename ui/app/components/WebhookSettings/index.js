import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/mode/json';
import 'brace/theme/terminal';

import messages from './messages';
import trashIcon from '../../images/trash-icon.svg';

const styles = {
  toggleContainer: {
    display: 'inline',
    marginBottom: '10px'
  },
  toggle: {
    display: 'inline',
    float: 'right',
  },
  panelContent: {
    display: 'inline',
    fontSize: '14px',
    fontWeight: 300,
    color: '#4e4e4e',
    width: '95%',
  },
  errorLabel: {
    color: '#f44336',
    marginTop: '8px',
  },
  headerValueInput: {
    marginTop: '-25px',
  },
  newHeaderValueInput: {
    marginTop: '-15px !important',
  },
  bodyTitleContainer: {
    marginBottom: '40px',
  },
  deleteIcon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    cursor: 'pointer',
    float: 'right',
    marginRight: '24px',
    marginTop: '17px',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class WebhookSettings extends React.Component {
  state = {
    newHeaderKey: '',
    newHeaderKeyValue: '',
    lastHeaderEdited: false,
  };

  render() {
    const { classes, intl, webhook } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid className={classes.toggleContainer} container item xs={12}>
          {this.props.webhookSettingDescription ? (
            <Typography className={classes.panelContent}>
              <FormattedMessage {...this.props.webhookSettingDescription} />
            </Typography>
          ) : null}
        </Grid>
        <Grid
          key="grid-webhook-config"
          container
          spacing={16}
          item
          xs={12}
        >
          <Grid item xs={12}>
            <Typography variant="h2">
              <FormattedMessage {...messages.webhookKeyTitle} />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="webhookKey"
              label={intl.formatMessage(messages.webhookKey)}
              value={webhook.webhookKey}
              placeholder={intl.formatMessage(
                messages.webhookKeyPlaceholder,
              )}
              onChange={evt => {
                this.props.onChangeWebhookData(
                  'webhookKey',
                  evt.target.value,
                );
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              helperText={intl.formatMessage(messages.requiredField)}
              error={this.props.errorState.webhookKey}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2">
              <FormattedMessage {...messages.title} />
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <TextField
              select
              id="webhookVerb"
              value={webhook.webhookVerb}
              label={intl.formatMessage(messages.webhookVerbSelect)}
              onChange={evt => {
                this.props.onChangeWebhookData(
                  'webhookVerb',
                  evt.target.value,
                );
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              helperText={intl.formatMessage(messages.requiredField)}
            >
              <MenuItem key="get" value="GET">
                GET
              </MenuItem>
              <MenuItem key="put" value="PUT">
                PUT
              </MenuItem>
              <MenuItem key="post" value="POST">
                POST
              </MenuItem>
              <MenuItem key="delete" value="DELETE">
                DELETE
              </MenuItem>
              <MenuItem key="patch" value="PATCH">
                PATCH
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <TextField
              id="webhookUrl"
              label={intl.formatMessage(messages.webhookUrl)}
              value={webhook.webhookUrl}
              placeholder={intl.formatMessage(
                messages.webhookUrlPlaceholder,
              )}
              onChange={evt => {
                this.props.onChangeUseWebhook('useWebhook', evt.target.value !== '');
                this.props.onChangeWebhookData(
                  'webhookUrl',
                  evt.target.value,
                );
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              helperText={intl.formatMessage(messages.requiredField)}
              error={this.props.errorState.webhookUrl}
            />
          </Grid>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <TextField
              select
              id="webhookPayloadType"
              value={webhook.webhookPayloadType}
              label={intl.formatMessage(messages.webhookPayloadType)}
              onChange={evt => {
                this.props.onChangeWebhookPayloadType(
                  'webhookPayloadType',
                  evt.target.value,
                );
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            >
              <MenuItem key="none" value="None">
                None
              </MenuItem>
              <MenuItem key="json" value="JSON">
                JSON
              </MenuItem>
              <MenuItem key="xml" value="XML">
                XML
              </MenuItem>
              <MenuItem key="urlEncoded" value="URL Encoded">
                URL Encoded
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid
          key="grid-webhook-basic-auth"
          container
          spacing={16}
          item
          xs={12}
        >
          <Grid item xs={12}>
            <Typography variant="h2">
              <FormattedMessage {...messages.basicAuthTitle} />
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextField
              id="webhookUser"
              label={intl.formatMessage(messages.webhookUser)}
              value={webhook.webhookUser}
              placeholder={intl.formatMessage(
                messages.webhookUserPlaceholder,
              )}
              onChange={evt => {
                this.props.onChangeWebhookData(
                  'webhookUser',
                  evt.target.value,
                );
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              error={this.props.errorState.webhookUser}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextField
              id="webhookPassword"
              type="password"
              label={intl.formatMessage(messages.webhookPassword)}
              value={webhook.webhookPassword}
              placeholder={intl.formatMessage(
                messages.webhookPasswordPlaceholder,
              )}
              onChange={evt => {
                this.props.onChangeWebhookData(
                  'webhookPassword',
                  evt.target.value,
                );
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              error={this.props.errorState.webhookPassword}
            />
          </Grid>
        </Grid>
        <Grid
          key="grid-webhook-headers"
          container
          spacing={16}
          item
          xs={12}
        >
          <Grid item xs={12}>
            <Typography variant="h2">
              <FormattedMessage {...messages.headersTitle} />
            </Typography>
          </Grid>
          {webhook.webhookHeaders.map((header, headerIndex) => [
            <Grid
              key={`headerKey_${headerIndex}`}
              className={classes.headerValueInputContainer}
              item
              xs={6}
            >
              <TextField
                id={`headerKeyInput_${headerIndex}`}
                className={
                  headerIndex !== 0 ? classes.headerValueInput : ''
                }
                value={header.key}
                label={
                  headerIndex === 0
                    ? intl.formatMessage(messages.headerKey)
                    : null
                }
                placeholder={intl.formatMessage(
                  messages.headerKeyPlaceholder,
                )}
                onChange={evt => {
                  this.props.onChangeHeaderName(
                    headerIndex,
                    evt.target.value,
                  );
                }}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>,
            <Grid
              key={`headerValue_${headerIndex}`}
              className={classes.headerValueInputContainer}
              item
              xs={6}
            >
              <TextField
                id={`headerKeyValue_${headerIndex}`}
                className={
                  headerIndex !== 0 ? classes.headerValueInput : ''
                }
                value={header.value}
                label={
                  headerIndex === 0
                    ? intl.formatMessage(messages.headerValue)
                    : null
                }
                placeholder={intl.formatMessage(
                  messages.headerValuePlaceholder,
                )}
                onChange={evt => {
                  this.props.onChangeHeaderValue(
                    headerIndex,
                    evt.target.value,
                  );
                }}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      style={{
                        position: 'absolute',
                        left: '90%',
                        top: '17px',
                      }}
                      position="end"
                    >
                      <img
                        key={`deleteHeader_${headerIndex}`}
                        onClick={() => {
                          this.props.onDeleteHeader(headerIndex);
                        }}
                        className={classes.deleteIcon}
                        src={trashIcon}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>,
          ])}
          <Grid
            key="newHeaderKeyGrid"
            className={classes.keywordValueInputContainer}
            item
            xs={6}
          >
            <TextField
              id="newHeaderKey"
              value={this.state.newHeaderKey}
              placeholder={intl.formatMessage(
                messages.newHeaderKeyPlaceholder,
              )}
              label={
                webhook.webhookHeaders.length === 0
                  ? intl.formatMessage(messages.headerKey)
                  : null
              }
              onKeyPress={evt => {
                if (evt.key === 'Enter') {
                  evt.preventDefault();
                  this.setState({
                    newHeaderKey: '',
                    lastHeaderEdited: true,
                  });
                  this.props.onAddNewHeader({
                    key: evt.target.value,
                    value: '',
                  });
                }
              }}
              onChange={evt => {
                this.setState({
                  newHeaderKey: evt.target.value,
                });
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                className:
                  webhook.webhookHeaders.length === 0
                    ? ''
                    : classes.newHeaderValueInput,
              }}
            />
          </Grid>
          <div
            ref={el => {
              this.lastExample = el;
            }}
          />
        </Grid>
        <Grid key="grid-editor" item xs={12}>
          {webhook.webhookPayloadType !== 'None'
            ? [
                <Grid className={classes.bodyTitleContainer} item xs={12}>
                  <Typography variant="h2">
                    <FormattedMessage {...messages.bodyTitle} />
                  </Typography>
                </Grid>,
                <AceEditor
                  key="webhookPayload"
                  width="100%"
                  height="300px"
                  mode={
                    webhook.webhookPayloadType === 'JSON' ? 'json' : 'xml'
                  }
                  theme="terminal"
                  name="webhookPayload"
                  readOnly={false}
                  onLoad={this.onLoad}
                  onChange={this.props.onChangeWebhookData.bind(
                    null,
                    'webhookPayload',
                  )}
                  fontSize={14}
                  showPrintMargin
                  showGutter
                  highlightActiveLine
                  value={webhook.webhookPayload}
                  editorProps={{
                    $blockScrolling: Infinity,
                  }}
                  setOptions={{
                    useWorker: false,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />,
                this.props.errorState.webhookPayload ? (
                  <Typography
                    key="webhookPayloadError"
                    variant="caption"
                    className={classes.errorLabel}
                  >
                    <FormattedMessage {...messages.payloadError} />
                  </Typography>
                ) : null,
              ]
            : null}
        </Grid>
      </Grid>
    );
  }
}

WebhookSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  webhook: PropTypes.object,
  onChangeUseWebhook: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  onAddNewHeader: PropTypes.func,
  onChangeHeaderName: PropTypes.func,
  onChangeHeaderValue: PropTypes.func,
  webhookSettingDescription: PropTypes.object,
  errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(WebhookSettings));
