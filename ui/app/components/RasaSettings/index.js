import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, TextField, Typography, Menu, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/mode/json';
import 'brace/theme/terminal';

import addPipelineIcon from '../../images/add-pipeline-icon.svg';
import { ACTION_INTENT_SPLIT_SYMBOL } from '../../../common/constants';

import messages from './messages';

const styles = {
  panelContent: {
    display: 'inline',
    fontSize: '14px',
    fontWeight: 300,
    color: '#4e4e4e',
    width: '95%',
  },
  labelContainer: {
    paddingBottom: '20px',
  },
  settingEditorLabel: {
    fontSize: '12px',
    color: '#a2a7b1',
    display: 'inline',
  },
  errorLabel: {
    color: '#f44336',
    marginTop: '8px',
  },
  addPipelineIcon: {
    '&:hover': {
      filter: 'invert(1)',
    },
    cursor: 'pointer',
    height: '17px',
    display: 'inline',
    float: 'right',
  },
};

const spacyPipeline = [
  {
    name: 'nlp_spacy',
  },
  {
    name: 'tokenizer_spacy',
  },
  {
    name: 'intent_featurizer_spacy',
  },
  {
    name: 'ner_crf',
  },
  {
    name: 'ner_synonyms',
  },
  {
    name: 'intent_classifier_sklearn',
  },
  {
    name: 'ner_spacy',
  },
];

const keywordsPipeline = [
  {
    name: 'nlp_spacy',
  },
  {
    name: 'tokenizer_spacy',
  },
  {
    name: 'ner_crf',
  },
  {
    name: 'ner_synonyms',
  },
  {
    name: 'ner_spacy',
  },
];

const tensorflowPipeline = [
  {
    name: 'intent_featurizer_count_vectors',
  },
  {
    name: 'intent_classifier_tensorflow_embedding',
    intent_tokenization_flag: true,
    intent_split_symbol: ACTION_INTENT_SPLIT_SYMBOL,
  },
  {
    name: 'nlp_spacy',
  },
  {
    name: 'tokenizer_spacy',
  },
  {
    name: 'ner_crf',
  },
  {
    name: 'ner_synonyms',
  },
  {
    name: 'ner_spacy',
  },
];

const getStringSetting = setting => {
  if (typeof setting === 'string') {
    return setting;
  }
  return JSON.stringify(setting, null, 2);
};

/* eslint-disable react/prefer-stateless-function */
export class RasaSettings extends React.Component {
  state = {
    pipeline: null,
    openPipelineMenu: false,
    anchorEl: null,
  };

  onChangeEditorValue(field, editorValue) {
    try {
      const value = JSON.parse(editorValue); // Ace editor send the value directly to the method as an string
      this.props.onChangeSettingsData(field, value);
    } catch (e) {
      const value = editorValue; // Given the parse of the json failed store the value in the state as a string
      this.props.onChangeSettingsData(field, value);
    }
  }

  render() {
    const { classes, intl, settings } = this.props;
    const { anchorEl } = this.state;
    return (
      <Grid container spacing={16}>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={this.state.openPipelineMenu}
          onClose={() => {
            this.setState({
              openPipelineMenu: false,
              anchorEl: null,
            });
          }}
        >
          <MenuItem
            onClick={() => {
              this.onChangeEditorValue(this.state.pipeline, keywordsPipeline);
              this.setState({
                openPipelineMenu: false,
                anchorEl: null,
                pipeline: null,
              });
            }}
          >
            <Typography className={classes.panelContent}>
              <FormattedMessage {...messages.keywords} />
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.onChangeEditorValue(this.state.pipeline, tensorflowPipeline);
              this.setState({
                openPipelineMenu: false,
                anchorEl: null,
                pipeline: null,
              });
            }}
          >
            <Typography className={classes.panelContent}>
              <FormattedMessage {...messages.tensorflow} />
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.onChangeEditorValue(this.state.pipeline, spacyPipeline);
              this.setState({
                openPipelineMenu: false,
                anchorEl: null,
                pipeline: null,
              });
            }}
          >
            <Typography className={classes.panelContent}>
              <FormattedMessage {...messages.spacy} />
            </Typography>
          </MenuItem>
        </Menu>
        <Grid container item xs={12}>
          <Typography className={classes.panelContent}>
            <FormattedMessage {...messages.rasaSettingDescription} />
          </Typography>
        </Grid>
        <Grid container spacing={16} item xs={12}>
          <Grid item lg={12} md={8} sm={12} xs={12}>
            <TextField
              id="rasaURL"
              label={intl.formatMessage(messages.rasaURL)}
              value={settings.rasaURL}
              placeholder={intl.formatMessage(messages.rasaURLPlaceholder)}
              onChange={evt => {
                this.props.onChangeSettingsData('rasaURL', evt.target.value);
              }}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              helperText={intl.formatMessage(messages.requiredField)}
              error={this.props.errorState.rasaURL}
            />
          </Grid>
          <Grid item lg={12} md={8} sm={12} xs={12}>
            <TextField
              id="rasaConcurrentRequests"
              type="number"
              label={intl.formatMessage(messages.rasaConcurrentRequests)}
              value={settings.rasaConcurrentRequests}
              placeholder={intl.formatMessage(messages.rasaConcurrentRequestsPlaceholder)}
              onChange={evt => {
                this.props.onChangeSettingsData('rasaConcurrentRequests', evt.target.value);
              }}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              helperText={intl.formatMessage(messages.requiredField)}
              error={this.props.errorState.rasaConcurrentRequests}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} className={classes.labelContainer}>
            <Typography
              className={classes.settingEditorLabel}
              id="categoryClassifierPipeline"
            >
              <FormattedMessage {...messages.categoryClassifierPipeline} />
            </Typography>
            <img
              onClick={evt => {
                this.setState({
                  openPipelineMenu: true,
                  anchorEl: evt.currentTarget,
                  pipeline: 'categoryClassifierPipeline',
                });
              }}
              src={addPipelineIcon}
              className={classes.addPipelineIcon}
            />
          </Grid>
          <AceEditor
            width="100%"
            height="300px"
            mode="json"
            theme="terminal"
            name="categoryClassifierPipeline"
            readOnly={false}
            onChange={value =>
              this.onChangeEditorValue('categoryClassifierPipeline', value)
            }
            fontSize={14}
            showPrintMargin
            showGutter
            highlightActiveLine
            value={getStringSetting(settings.categoryClassifierPipeline)}
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
            editorProps={{
              $blockScrolling: Infinity,
            }}
          />
          {this.props.errorState.categoryClassifierPipeline ? (
            <Typography variant="caption" className={classes.errorLabel}>
              <FormattedMessage {...messages.pipelineError} />
            </Typography>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} className={classes.labelContainer}>
            <Typography
              className={classes.settingEditorLabel}
              id="sayingClassifierPipeline"
            >
              <FormattedMessage {...messages.sayingClassifierPipeline} />
            </Typography>
            <img
              onClick={evt => {
                this.setState({
                  openPipelineMenu: true,
                  anchorEl: evt.currentTarget,
                  pipeline: 'sayingClassifierPipeline',
                });
              }}
              src={addPipelineIcon}
              className={classes.addPipelineIcon}
            />
          </Grid>
          <AceEditor
            width="100%"
            height="300px"
            mode="json"
            theme="terminal"
            name="sayingClassifierPipeline"
            readOnly={false}
            onChange={value =>
              this.onChangeEditorValue('sayingClassifierPipeline', value)
            }
            fontSize={14}
            showPrintMargin
            showGutter
            highlightActiveLine
            value={getStringSetting(settings.sayingClassifierPipeline)}
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
            editorProps={{
              $blockScrolling: Infinity,
            }}
          />
          {this.props.errorState.sayingClassifierPipeline ? (
            <Typography variant="caption" className={classes.errorLabel}>
              <FormattedMessage {...messages.pipelineError} />
            </Typography>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} className={classes.labelContainer}>
            <Typography
              className={classes.settingEditorLabel}
              id="keywordClassifierPipeline"
            >
              <FormattedMessage {...messages.keywordClassifierPipeline} />
            </Typography>
            <img
              onClick={evt => {
                this.setState({
                  openPipelineMenu: true,
                  anchorEl: evt.currentTarget,
                  pipeline: 'keywordClassifierPipeline',
                });
              }}
              src={addPipelineIcon}
              className={classes.addPipelineIcon}
            />
          </Grid>
          <AceEditor
            width="100%"
            height="300px"
            mode="json"
            theme="terminal"
            name="keywordClassifierPipeline"
            readOnly={false}
            onChange={value =>
              this.onChangeEditorValue('keywordClassifierPipeline', value)
            }
            fontSize={14}
            showPrintMargin
            showGutter
            highlightActiveLine
            value={getStringSetting(settings.keywordClassifierPipeline)}
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
            editorProps={{
              $blockScrolling: Infinity,
            }}
          />
          {this.props.errorState.keywordClassifierPipeline ? (
            <Typography variant="caption" className={classes.errorLabel}>
              <FormattedMessage {...messages.pipelineError} />
            </Typography>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} className={classes.labelContainer}>
            <Typography
              className={classes.settingEditorLabel}
              id="spacyPretrainedEntities"
            >
              <FormattedMessage {...messages.spacyPretrainedEntities} />
            </Typography>
          </Grid>
          <AceEditor
            width="100%"
            height="300px"
            mode="json"
            theme="terminal"
            name="spacyPretrainedEntities"
            readOnly={false}
            onChange={value =>
              this.onChangeEditorValue('spacyPretrainedEntities', value)
            }
            fontSize={14}
            showPrintMargin
            showGutter
            highlightActiveLine
            value={getStringSetting(settings.spacyPretrainedEntities)}
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
            editorProps={{
              $blockScrolling: Infinity,
            }}
          />
          {this.props.errorState.spacyPretrainedEntities ? (
            <Typography variant="caption" className={classes.errorLabel}>
              <FormattedMessage {...messages.spacyPretrainedEntitiesError} />
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    );
  }
}

RasaSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  settings: PropTypes.object,
  onChangeSettingsData: PropTypes.func,
  errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(RasaSettings));
