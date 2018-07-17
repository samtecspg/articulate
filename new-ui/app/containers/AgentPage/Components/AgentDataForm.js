import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Typography, TextField, MenuItem, Table, TableBody, TableRow, TableCell  } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider'
import { withStyles } from '@material-ui/core/styles';

import AutoComplete from '../../../components/AutoComplete';

import messages from '../messages';

import trashIcon from '../../../images/trash-icon.svg';

const styles = {
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '40px 25px',
  },
  sliderLabel: {
    paddingTop: '20px',
    fontSize: '12px',
    color: '#a2a7b1',
  },
  sliderTextField: {
    width: '100%',
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
};

/* eslint-disable react/prefer-stateless-function */
class AgentDataForm extends React.Component {

  constructor(props){
    super(props);
    this.getThresholdLabel = this.getThresholdLabel.bind(this);
  }

  getThresholdLabel(){
    return this.props.agent.multiCategory ? messages.sliderCategoryRecognitionThresholdLabel : messages.sliderActionRecognitionThresholdLabel;
  }

  render(){
    const { classes, intl, agent, settings } = this.props;
    return (
      <Grid className={classes.formContainer} container item xs={12}>
        <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>
          <Grid container spacing={24} item xs={12}>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <TextField
                id='agentName'
                label={intl.formatMessage(messages.agentTextField)}
                value={agent.agentName}
                placeholder={intl.formatMessage(messages.agentTextFieldPlaceholder)}
                onChange={(evt) => { this.props.onChangeAgentName('agentName', evt.target.value) }}
                margin='normal'
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={intl.formatMessage(messages.requiredField)}
                error={this.props.errorState.agentName}
              />
            </Grid>
          </Grid>
          <Grid container spacing={24} item xs={12}>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <TextField
                id='description'
                label={intl.formatMessage(messages.descriptionTextField)}
                value={agent.description}
                placeholder={intl.formatMessage(messages.descriptionTextFieldPlaceholder)}
                onChange={(evt) => { this.props.onChangeAgentData('description', evt.target.value) }}
                margin='normal'
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                multiline
                rows={4}
                helperText={intl.formatMessage(messages.requiredField)}
                error={this.props.errorState.agentDescription}
              />
            </Grid>
          </Grid>
          <Grid container justify='space-between' spacing={24} item xs={12}>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <TextField
                select
                id='language'
                value={agent.language}
                label={intl.formatMessage(messages.languageSelect)}
                onChange={(evt) => { this.props.onChangeAgentData('language', evt.target.value) }}
                margin='normal'
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={intl.formatMessage(messages.requiredField)}
              >
                {
                  settings.agentLanguages.map((language) => (
                    <MenuItem key={language.value} value={language.value}>
                      {language.text}
                    </MenuItem>
                  ))
                }
              </TextField>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <AutoComplete
                label={intl.formatMessage(messages.timezoneSelect)}
                suggestions={this.props.settings.timezones}
                value={agent.timezone}
                onChange={(timezone) => { this.props.onChangeAgentData('timezone', timezone) }}
                placeholder={intl.formatMessage(messages.timezoneSelectPlaceholder)}
                helperText={intl.formatMessage(messages.requiredField)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={24} item xs={12}>
            <Grid item lg={4} md={10} sm={9} xs={8}>
              <Typography className={classes.sliderLabel} id='categoryClassifierThreshold'>
                <FormattedMessage {...this.getThresholdLabel()} />
              </Typography>
              <Slider
                value={agent.categoryClassifierThreshold}
                min={0}
                max={100}
                step={1}
                aria-labelledby='categoryClassifierThreshold'
                onChange={(evt, value) => { this.props.onChangeCategoryClassifierThreshold(value) }} />
            </Grid>
            <Grid item lg={2} md={2} sm={3} xs={4}>
              <TextField
                id='categoryClassifierThreshold'
                margin='normal'
                value={agent.categoryClassifierThreshold}
                onChange={(evt) => {
                  evt.target.value === '' ?
                    this.props.onChangeCategoryClassifierThreshold(0) :
                    (evt.target.value <= 100 && evt.target.value >= 0 ?
                      this.props.onChangeCategoryClassifierThreshold(evt.target.value) :
                      false) }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  style: {
                    textAlign: 'center',
                  },
                  min: 0,
                  max: 100,
                  step: 1,
                }}
                className={classes.sliderTextField}
                helperText={intl.formatMessage(messages.requiredField)}
                type='number'
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <TextField
                select
                id='fallbackAction'
                value={agent.fallbackAction}
                label={intl.formatMessage(messages.fallbackTextField)}
                onChange={(evt) => { 
                  if (evt.target.value === 'create'){
                    this.props.onGoToUrl(`/agent/${agent.id}/action/create`);
                  }
                  else {
                    this.props.onChangeAgentData('fallbackAction', evt.target.value) 
                  }
                }}
                margin='normal'
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={intl.formatMessage(messages.requiredField)}
                error={this.props.errorState.fallbackAction}
              >
                {
                  this.props.newAgent ? 
                  <MenuItem value={this.props.defaultaFallbackActionName}>{this.props.defaultaFallbackActionName}</MenuItem>
                  : <MenuItem value='create'><FormattedMessage {...messages.newAction}/></MenuItem>
                }                
                {
                  this.props.agentActions.map((action) => (
                    <MenuItem key={action.id} value={action.actionName}>
                      {action.actionName}
                    </MenuItem>
                  ))
                }
              </TextField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

AgentDataForm.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  errorState: PropTypes.object,
  onChangeAgentData: PropTypes.func.isRequired,
  onChangeAgentName: PropTypes.func.isRequired,
  onChangeCategoryClassifierThreshold: PropTypes.func.isRequired,
  onAddFallbackResponse: PropTypes.func.isRequired,
  onDeleteFallbackResponse: PropTypes.func.isRequired,
  agent: PropTypes.object,
  settings: PropTypes.object,
  newAgent: PropTypes.bool,
  agentActions: PropTypes.array,
  onGoToUrl: PropTypes.func,
  defaultaFallbackActionName: PropTypes.string
};

export default injectIntl(withStyles(styles)(AgentDataForm));
