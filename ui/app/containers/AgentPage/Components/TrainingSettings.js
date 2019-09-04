import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  Tooltip,
  Icon,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import messages from '../messages';

const styles = {
  panelContent: {
    display: 'inline',
    fontSize: '14px',
    fontWeight: 300,
    color: '#4e4e4e',
    width: '95%',
  },
  errorMessage: {
    color: '#f44336',
    display: 'inline',
    fontSize: '0.75rem',
    minHeight: '1em',
    fontWeight: 400,
    width: '95%',
  },
  spanLabelExamples: {
    position: 'relative',
    bottom: '2px',
  },
  infoIcon: {
    color: '#4e4e4e',
    position: 'relative',
    top: '4px',
    left: '2px',
    fontSize: '18px !important',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class TrainingSettings extends React.Component {
  render() {
    const { classes, intl, agent } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid container item xs={12}>
          <Typography className={classes.panelContent}>
            <FormattedMessage {...messages.trainingSettingDescription} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={agent.extraTrainingData}
                onChange={() => {
                  this.props.onChangeAgentData(
                    'extraTrainingData',
                    !agent.extraTrainingData,
                  );
                }}
                value="extraTrainingData"
                color="primary"
              />
            }
            label={
              <span className={classes.spanLabelExamples}>
                {intl.formatMessage(messages.extraTrainingData)}
                <Tooltip
                  placement="top"
                  title={intl.formatMessage(messages.extraTrainingDataHelp)}
                >
                  <Icon className={classes.infoIcon}>info</Icon>
                </Tooltip>
              </span>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={!agent.multiCategory} // if the agent is not multicategory it's multiaction
                onChange={(evt, value) => {
                  if (value) {
                    this.props.onChangeAgentData(
                      'enableModelsPerCategory',
                      false,
                    );
                  }
                  this.props.onChangeAgentData('multiCategory', !value);
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
                checked={agent.enableModelsPerCategory}
                onChange={(evt, value) => {
                  if (value) {
                    this.props.onChangeAgentData('multiCategory', true);
                  }
                  this.props.onChangeAgentData(
                    'enableModelsPerCategory',
                    value,
                  );
                }}
                value="enableModelsPerCategory"
                color="primary"
              />
            }
            label={intl.formatMessage(messages.enableModelsPerCategory)}
          />
        </Grid>
        {this.props.errorState.training ? (
          <Grid container item xs={12}>
            <Typography className={classes.errorMessage}>
              <FormattedMessage {...messages.trainingSettingMissing} />
            </Typography>
          </Grid>
        ) : null}
      </Grid>
    );
  }
}

TrainingSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  agent: PropTypes.object,
  onChangeAgentData: PropTypes.func,
  errorState: PropTypes.object,
};

export default injectIntl(withStyles(styles)(TrainingSettings));
