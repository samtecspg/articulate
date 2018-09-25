import React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Typography, Switch } from '@material-ui/core';
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
export class ResponseSettings extends React.Component {

  render() {
    const { classes, usePostFormat, postFormat } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid
          className={classes.toggleContainer}
          container
          item
          xs={12}
        >
          {this.props.responseSettingDescription ? 
          <Typography className={classes.panelContent}>
            <FormattedMessage
              {...this.props.responseSettingDescription}
            />
          </Typography> : null}
          <Switch
            className={classes.toggle}
            checked={usePostFormat}
            onChange={() => {
              this.props.onChangeUsePostFormatData(
                "usePostFormat",
                !usePostFormat
              );
            }}
            value="usePostFormat"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          {usePostFormat ? (
            [<AceEditor
              key='postFormatEditor'
              width="100%"
              height="300px"
              mode={"json"}
              theme="terminal"
              name="webhookPayload"
              readOnly={false}
              onLoad={this.onLoad}
              onChange={this.props.onChangePostFormatData.bind(
                null,
                "postFormatPayload"
              )}
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={postFormat.postFormatPayload}
              editorProps={{
                $blockScrolling: Infinity
              }}
              setOptions={{
                useWorker: false,
                showLineNumbers: true,
                tabSize: 2
              }}
            />,
              this.props.errorState.postFormatPayload ?
              <Typography
                key='postFormatPayloadError'
                variant='caption'
                className={classes.errorLabel}
              >
                <FormattedMessage {...messages.payloadError} />
              </Typography> :
              null
            ]
          ) : null}
        </Grid>
      </Grid>
    );
  }
}

ResponseSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  usePostFormat: PropTypes.bool,
  postFormat: PropTypes.object,
  onChangeUsePostFormatData: PropTypes.func,
  onChangePostFormatData: PropTypes.func,
  responseSettingDescription: PropTypes.object,
  errorState: PropTypes.object,
};

export default withStyles(styles)(ResponseSettings);
