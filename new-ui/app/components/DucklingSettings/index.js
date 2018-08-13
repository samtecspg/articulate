import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, TextField, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/mode/json';
import 'brace/theme/terminal';

import messages from './messages';

const styles = {
  panelContent: {
      display: 'inline',
      fontSize: '14px',
      fontWeight: 300,
      color: '#4e4e4e',
      width: '95%'
  },
  settingEditorLabel: {
      paddingBottom: '20px',
      fontSize: '12px',
      color: '#a2a7b1',
  },
}

const getStringSetting = (setting) => {

  if (typeof setting === 'string'){
    return setting;
  }
  return JSON.stringify(setting, null, 2);
}

/* eslint-disable react/prefer-stateless-function */
export class DucklingSettings extends React.Component {

  onChangeEditorValue(field, editorValue) {
    try {
      const value = JSON.parse(editorValue); //Ace editor send the value directly to the method as an string
      this.props.onChangeSettingsData(field, value);
    } catch(e) {
      const value = editorValue; //Given the parse of the json failed store the value in the state as a string
      this.props.onChangeSettingsData(field, value);
    }
  }

  render() {
    const { classes, intl, settings } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid
          container
          item
          xs={12}
        >
          <Typography className={classes.panelContent}>
            <FormattedMessage
              {...messages.ducklingSettingDescription}
            />
          </Typography>
        </Grid>
        <Grid container spacing={16} item xs={12}>
          <Grid item lg={12} md={8} sm={12} xs={12}>
            <TextField
              id="ducklingURL"
              label={intl.formatMessage(messages.ducklingURL)}
              value={settings.ducklingURL}
              placeholder={intl.formatMessage(
                messages.ducklingURLPlaceholder
              )}
              onChange={evt => {
                this.props.onChangeSettingsData(
                  "ducklingURL",
                  evt.target.value
                );
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              helperText={intl.formatMessage(messages.requiredField)}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography
            className={classes.settingEditorLabel}
            id="ducklingDimension"
          >
            <FormattedMessage {...messages.ducklingDimension} />
          </Typography>
          <AceEditor
            width="100%"
            height="300px"
            mode="json"
            theme="terminal"
            name="ducklingDimension"
            readOnly={false}
            onChange={value =>
              this.onChangeEditorValue('ducklingDimension', value)
            }
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={getStringSetting(settings.ducklingDimension)}
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              tabSize: 2
            }}
            editorProps={{
              $blockScrolling: Infinity
            }}
          />
        </Grid>
      </Grid>
    );
  }
}

DucklingSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  settings: PropTypes.object,
  onChangeSettingsData: PropTypes.func,
};

export default injectIntl(withStyles(styles)(DucklingSettings));
