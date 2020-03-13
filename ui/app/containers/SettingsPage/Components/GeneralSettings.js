import {
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import 'brace/mode/json';

import 'brace/mode/xml';
import 'brace/theme/terminal';

import PropTypes from 'prop-types';
import React from 'react';
import AceEditor from 'react-ace';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import AutoComplete from '../../../components/AutoComplete';

import trashIcon from '../../../images/trash-icon.svg';

import messages from '../messages';

const styles = {
  panelContent: {
    display: 'inline',
    fontSize: '14px',
    fontWeight: 300,
    color: '#4e4e4e',
    width: '95%',
  },
  settingEditorLabel: {
    paddingBottom: '20px',
    fontSize: '12px',
    color: '#a2a7b1',
  },
  table: {
    marginTop: '20px',
  },
  deleteCell: {
    width: '20px',
  },
  deleteIcon: {
    cursor: 'pointer',
  },
  errorLabel: {
    color: '#f44336',
    marginTop: '8px',
  },
};

const getStringSetting = setting => {
  if (typeof setting === 'string') {
    return setting;
  }
  return JSON.stringify(setting, null, 2);
};

/* eslint-disable react/prefer-stateless-function */
export class GeneralSettings extends React.Component {
  onChangeEditorValue(field, editorValue) {
    try {
      const value = JSON.parse(editorValue); // Ace editor send the value directly to the method as an string
      this.props.onChangeSettingsData(field, value);
    } catch (e) {
      // Given the parse of the json failed store the value in the state as a string
      this.props.onChangeSettingsData(field, editorValue);
    }
  }

  render() {
    const { classes, intl, settings } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid container item xs={12}>
          <Typography className={classes.panelContent}>
            <FormattedMessage {...messages.generalSettingDescription} />
          </Typography>
        </Grid>
        <Grid container justify="space-between" spacing={24} item xs={12}>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <TextField
              id="defaultUISessionId"
              value={settings.defaultUISessionId}
              label={intl.formatMessage(messages.defaultUISessionId)}
              onChange={evt => {
                this.props.onChangeSettingsData(
                  'defaultUISessionId',
                  evt.target.value,
                );
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              helperText={intl.formatMessage(messages.requiredField)}
              error={this.props.errorState.defaultUISessionId}
            />
          </Grid>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <TextField
              select
              id="uiLanguage"
              value={settings.uiLanguage}
              label={intl.formatMessage(messages.uiLanguageSelect)}
              onChange={evt => {
                this.props.onChangeSettingsData('uiLanguage', evt.target.value);
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              helperText={intl.formatMessage(messages.requiredField)}
              error={this.props.errorState.uiLanguage}
            >
              {Array.isArray(settings.uiLanguages)
                ? settings.uiLanguages.map(language => (
                  <MenuItem key={language.text} value={language.value}>
                    {language.text}
                  </MenuItem>
                ))
                : null}
            </TextField>
          </Grid>
        </Grid>
        <Grid container justify="space-between" spacing={24} item xs={12}>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <TextField
              select
              id="defaultAgentLanguage"
              value={settings.defaultAgentLanguage}
              label={intl.formatMessage(messages.languageSelect)}
              onChange={evt => {
                this.props.onChangeSettingsData(
                  'defaultAgentLanguage',
                  evt.target.value,
                );
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              helperText={intl.formatMessage(messages.requiredField)}
              error={this.props.errorState.defaultAgentLanguage}
            >
              {Array.isArray(settings.agentLanguages)
                ? settings.agentLanguages.map(agentLanguage => (
                  <MenuItem
                    key={agentLanguage.text}
                    value={agentLanguage.value}
                  >
                    {agentLanguage.text}
                  </MenuItem>
                ))
                : null}
            </TextField>
          </Grid>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <AutoComplete
              label={intl.formatMessage(messages.timezoneSelect)}
              suggestions={settings.timezones}
              value={settings.defaultTimezone}
              onChange={timezone => {
                this.props.onChangeSettingsData('defaultTimezone', timezone);
              }}
              placeholder={intl.formatMessage(
                messages.timezoneSelectPlaceholder,
              )}
              helperText={intl.formatMessage(messages.requiredField)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.settingEditorLabel} id="timezones">
              <FormattedMessage {...messages.timezones} />
            </Typography>
            <AceEditor
              width="100%"
              height="300px"
              mode="json"
              theme="terminal"
              name="timezones"
              readOnly={false}
              onChange={value => this.onChangeEditorValue('timezones', value)}
              fontSize={14}
              showPrintMargin
              showGutter
              highlightActiveLine
              value={getStringSetting(settings.timezones)}
              setOptions={{
                useWorker: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
              editorProps={{
                $blockScrolling: Infinity,
              }}
            />
            {this.props.errorState.timezones ? (
              <Typography variant="caption" className={classes.errorLabel}>
                <FormattedMessage {...messages.timezonesError} />
              </Typography>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <Typography
              className={classes.settingEditorLabel}
              id="agentLanguages"
            >
              <FormattedMessage {...messages.agentLanguages} />
            </Typography>
            <AceEditor
              width="100%"
              height="300px"
              mode="json"
              theme="terminal"
              name="agentLanguages"
              readOnly={false}
              onChange={value =>
                this.onChangeEditorValue('agentLanguages', value)
              }
              fontSize={14}
              showPrintMargin
              showGutter
              highlightActiveLine
              value={getStringSetting(settings.agentLanguages)}
              setOptions={{
                useWorker: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
              editorProps={{
                $blockScrolling: Infinity,
              }}
            />
            {this.props.errorState.agentLanguages ? (
              <Typography variant="caption" className={classes.errorLabel}>
                <FormattedMessage {...messages.agentLanguagesError} />
              </Typography>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.settingEditorLabel} id="uiLanguages">
              <FormattedMessage {...messages.uiLanguages} />
            </Typography>
            <AceEditor
              width="100%"
              height="300px"
              mode="json"
              theme="terminal"
              name="uiLanguages"
              readOnly={false}
              onChange={value => this.onChangeEditorValue('uiLanguages', value)}
              fontSize={14}
              showPrintMargin
              showGutter
              highlightActiveLine
              value={getStringSetting(settings.uiLanguages)}
              setOptions={{
                useWorker: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
              editorProps={{
                $blockScrolling: Infinity,
              }}
            />
            {this.props.errorState.uiLanguages ? (
              <Typography variant="caption" className={classes.errorLabel}>
                <FormattedMessage {...messages.uiLanguagesError} />
              </Typography>
            ) : null}
          </Grid>
          <Grid container spacing={24} item xs={12}>
            <Grid
              style={{ paddingBottom: '0px' }}
              item
              lg={12}
              md={8}
              sm={12}
              xs={12}
            >
              <TextField
                id="defaultFallbackActionName"
                label={intl.formatMessage(messages.defaultFallbackActionName)}
                value={settings.defaultFallbackActionName}
                placeholder={intl.formatMessage(
                  messages.defaultFallbackActionNamePlaceholder,
                )}
                onChange={evt => {
                  this.props.onChangeSettingsData(
                    'defaultFallbackActionName',
                    evt.target.value,
                  );
                }}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={intl.formatMessage(messages.requiredField)}
                error={this.props.errorState.defaultFallbackActionName}
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                id="newFallbackResponses"
                label={intl.formatMessage(messages.fallbackTextField)}
                placeholder={intl.formatMessage(
                  messages.fallbackTextFieldPlaceholder,
                )}
                onKeyPress={ev => {
                  if (ev.key === 'Enter') {
                    ev.preventDefault();
                    this.props.onAddFallbackResponse(ev.target.value);
                    ev.target.value = '';
                  }
                }}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={intl.formatMessage(messages.fallbackHelperText)}
                error={this.props.errorState.defaultAgentFallbackResponses}
              />
              {settings.defaultAgentFallbackResponses.length > 0 ? (
                <Table className={classes.table}>
                  <TableBody>
                    {settings.defaultAgentFallbackResponses.map(
                      (fallbackResponse, index) => (
                        <TableRow key={`${fallbackResponse}_${index}`}>
                          <TableCell>{fallbackResponse}</TableCell>
                          <TableCell className={classes.deleteCell}>
                            <img
                              onClick={() => {
                                this.props.onDeleteFallbackResponse(index);
                              }}
                              className={classes.deleteIcon}
                              src={trashIcon}
                            />
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

GeneralSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  settings: PropTypes.object,
  onChangeSettingsData: PropTypes.func,
  onAddFallbackResponse: PropTypes.func.isRequired,
  onDeleteFallbackResponse: PropTypes.func.isRequired,
  errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(GeneralSettings));
