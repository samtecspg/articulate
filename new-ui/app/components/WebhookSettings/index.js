import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, TextField, Typography, MenuItem, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/mode/json';
import 'brace/theme/terminal';

import messages from './messages';

const styles = {
  toggleContainer: {
    display: "inline"
  },
  toggle: {
    display: "inline",
    float: "right"
  },
  panelContent: {
      display: 'inline',
      fontSize: '14px',
      fontWeight: 300,
      color: '#4e4e4e',
      width: '95%'
  },
  errorLabel: {
    color: '#f44336',
    marginTop: '8px',
  }
}

/* eslint-disable react/prefer-stateless-function */
export class WebhookSettings extends React.Component {

  render() {
    const { classes, intl, useWebhook, webhook } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid
          className={classes.toggleContainer}
          container
          item
          xs={12}
        >
          {this.props.webhookSettingDescription ?
          <Typography className={classes.panelContent}>
            <FormattedMessage
              {...this.props.webhookSettingDescription}
            />
          </Typography> : null}
          <Switch
            className={classes.toggle}
            checked={useWebhook}
            onChange={() => {
              this.props.onChangeUseWebhook(
                "useWebhook",
                !useWebhook
              );
            }}
            value="useWebhook"
            color="primary"
          />
        </Grid>
          {
            useWebhook ? [
              <Grid key='grid-webhook-config' container spacing={16} item xs={12}>
                <Grid item lg={2} md={2} sm={12} xs={12}>
                  <TextField
                    select
                    id="webhookVerb"
                    value={webhook.webhookVerb}
                    label={intl.formatMessage(messages.webhookVerbSelect)}
                    onChange={evt => {
                      this.props.onChangeWebhookData(
                        "webhookVerb",
                        evt.target.value
                      );
                    }}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    helperText={intl.formatMessage(messages.requiredField)}
                  >
                    <MenuItem key={"get"} value={"GET"}>
                      GET
                    </MenuItem>
                    <MenuItem key={"put"} value={"PUT"}>
                      PUT
                    </MenuItem>
                    <MenuItem key={"post"} value={"POST"}>
                      POST
                    </MenuItem>
                    <MenuItem key={"delete"} value={"DELETE"}>
                      DELETE
                    </MenuItem>
                    <MenuItem key={"patch"} value={"PATCH"}>
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
                      messages.webhookUrlPlaceholder
                    )}
                    onChange={evt => {
                      this.props.onChangeWebhookData(
                        "webhookUrl",
                        evt.target.value
                      );
                    }}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
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
                        "webhookPayloadType",
                        evt.target.value
                      );
                    }}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                  >
                    <MenuItem key={"none"} value={"None"}>
                      None
                    </MenuItem>
                    <MenuItem key={"json"} value={"JSON"}>
                      JSON
                    </MenuItem>
                    <MenuItem key={"xml"} value={"XML"}>
                      XML
                    </MenuItem>
                    <MenuItem key={"urlEncoded"} value={"URL Encoded"}>
                      URL Encoded
                    </MenuItem>
                  </TextField>
                </Grid>
              </Grid>,
              <Grid key='grid-editor' item xs={12}>
            {webhook.webhookPayloadType !== "None" ? (
              [<AceEditor
                key='webhookPayload'
                width='100%'
                height='300px'
                mode={
                  webhook.webhookPayloadType === "JSON" ? "json" : "xml"
                }
                theme="terminal"
                name="webhookPayload"
                readOnly={false}
                onLoad={this.onLoad}
                onChange={this.props.onChangeWebhookData.bind(
                  null,
                  "webhookPayload"
                )}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={webhook.webhookPayload}
                editorProps={{
                  $blockScrolling: Infinity
                }}
                setOptions={{
                  useWorker: false,
                  showLineNumbers: true,
                  tabSize: 2
                }}
              />,
                this.props.errorState.webhookPayload ?
                <Typography
                  key='webhookPayloadError'
                  variant='caption'
                  className={classes.errorLabel}
                >
                  <FormattedMessage {...messages.payloadError} />
                </Typography> :
                null
              ]
            ) : null}
          </Grid>
            ] : null
          }
        </Grid>
    );
  }
}

WebhookSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  webhook: PropTypes.object,
  useWebhook: PropTypes.bool,
  onChangeUseWebhook: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  webhookSettingDescription: PropTypes.object,
  errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(WebhookSettings));
