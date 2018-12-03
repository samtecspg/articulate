import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import { Grid, Typography, FormControlLabel, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

const styles = {
  panelContent: {
      display: 'inline',
      fontSize: '14px',
      fontWeight: 300,
      color: '#4e4e4e',
      width: '95%'
  },
}

/* eslint-disable react/prefer-stateless-function */
export class TrainingSettings extends React.Component {

  render() {
    const { classes, intl, agent } = this.props;
    return (<Grid container spacing={16}>
        <Grid
          container
          item
          xs={12}
        >
          <Typography className={classes.panelContent}>
            <FormattedMessage
              {...messages.trainingSettingDescription}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={agent.extraTrainingData}
                onChange={() => {
                  this.props.onChangeAgentData(
                    "extraTrainingData",
                    !agent.extraTrainingData
                  );
                }}
                value="extraTrainingData"
                color="primary"
              />
            }
            label={intl.formatMessage(messages.extraTrainingData)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={!agent.multiCategory}
                onChange={() => {
                  if (agent.multiCategory){
                    this.props.onChangeAgentData(
                      "enableModelsPerCategory",
                      false
                    );
                  }
                  this.props.onChangeAgentData(
                    "multiCategory",
                    !agent.multiCategory
                  );
                }}
                value="multiCategory"
                color="primary"
              />
            }
            label={intl.formatMessage(messages.multipleIntentRecognition)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={agent.multiCategory}
                onChange={() => {
                  this.props.onChangeAgentData(
                    "multiCategory",
                    !agent.multiCategory
                  );
                }}
                value="multiCategory"
                color="primary"
              />
            }
            label={intl.formatMessage(messages.multiCategory)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={agent.enableModelsPerCategory}
                onChange={() => {
                  this.props.onChangeAgentData(
                    "enableModelsPerCategory",
                    !agent.enableModelsPerCategory
                  );
                }}
                value="enableModelsPerCategory"
                color="primary"
              />
            }
            label={intl.formatMessage(messages.enableModelsPerCategory)}
          />
        </Grid>
      </Grid>
    );
  }
}

TrainingSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  agent: PropTypes.object,
  onChangeAgentData: PropTypes.func,
};

export default injectIntl(withStyles(styles)(TrainingSettings));
