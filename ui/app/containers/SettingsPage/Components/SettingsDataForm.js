import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DucklingSettings from 'components/DucklingSettings';
import RasaSettings from 'components/RasaSettings';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import expandedSingle from '../../../images/expand-single-icon.svg';
import expandedSingleOpened from '../../../images/expand-single-opened-icon.svg';
import messages from '../messages';
import GeneralSettings from './GeneralSettings';
import GroupAndUsersForm from './GroupAndUsersForm';

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
  root: {
    width: '100%',
  },
  panelHeading: {
    fontSize: '15px',
    color: '#4e4e4e',
  },
};

/* eslint-disable react/prefer-stateless-function */
class SettingsDataForm extends React.Component {
  state = {
    expanded: null,
  };

  handleChange = (field, value) => {
    this.setState({
      [field]: this.state.expanded === value ? null : value,
    });
  };

  getExpandIcon = expanded => {
    if (expanded) {
      return <img src={expandedSingleOpened} />;
    }
    return <img src={expandedSingle} />;
  };

  render() {
    const {
      classes,
      settings,
      accessPolicyGroups,
      selectedAccessPolicyGroup,
      handleOnchangeAccessPolicyGroup,
      onUpdateAccessPolicyGroup,
      onAddAccessPolicyGroup,
      newAccessPolicyGroupName,
      onUpdateNewAccessPolicyGroupName
    } = this.props;
    const { expanded } = this.state;
    return (
      <Grid className={classes.formContainer} container item xs={12}>
        <Grid className={classes.formSubContainer} id="formContainer" container item xs={12}>
          <div className={classes.root}>
            <ExpansionPanel
              expanded={expanded === 'panelGeneral'}
              onChange={() => {
                this.handleChange('expanded', 'panelGeneral');
              }}
            >
              <ExpansionPanelSummary expandIcon={this.getExpandIcon(expanded === 'panelGeneral')}>
                <Typography className={classes.panelHeading}>
                  <FormattedMessage {...messages.generalSetting} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <GeneralSettings
                  settings={this.props.settings}
                  onChangeSettingsData={this.props.onChangeSettingsData}
                  onAddFallbackResponse={this.props.onAddFallbackResponse}
                  onDeleteFallbackResponse={this.props.onDeleteFallbackResponse}
                  errorState={this.props.errorState}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === 'panelRasa'}
              onChange={() => {
                this.handleChange('expanded', 'panelRasa');
              }}
            >
              <ExpansionPanelSummary expandIcon={this.getExpandIcon(expanded === 'panelRasa')}>
                <Typography className={classes.panelHeading}>
                  <FormattedMessage {...messages.rasaSetting} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <RasaSettings settings={settings} onChangeSettingsData={this.props.onChangeSettingsData} errorState={this.props.errorState} />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === 'panelDuckling'}
              onChange={() => {
                this.handleChange('expanded', 'panelDuckling');
              }}
            >
              <ExpansionPanelSummary expandIcon={this.getExpandIcon(expanded === 'panelDuckling')}>
                <Typography className={classes.panelHeading}>
                  <FormattedMessage {...messages.ducklingSetting} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <DucklingSettings settings={settings} onChangeSettingsData={this.props.onChangeSettingsData} errorState={this.props.errorState} />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={expanded === 'panelGroupUsers'}
              onChange={() => {
                this.handleChange('expanded', 'panelGroupUsers');
              }}
            >
              <ExpansionPanelSummary expandIcon={this.getExpandIcon(expanded === 'panelGroupUsers')}>
                <Typography className={classes.panelHeading}>
                  <FormattedMessage {...messages.groupAndUsersSettings} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <GroupAndUsersForm
                  accessPolicyGroups={accessPolicyGroups}
                  settings={this.props.settings}
                  onChangeSettingsData={this.props.onChangeSettingsData}
                  errorState={this.props.errorState}
                  selectedAccessPolicyGroup={selectedAccessPolicyGroup}
                  handleOnchangeAccessPolicyGroup={handleOnchangeAccessPolicyGroup}
                  onUpdateAccessPolicyGroup={onUpdateAccessPolicyGroup}
                  onAddAccessPolicyGroup={onAddAccessPolicyGroup}
                  newAccessPolicyGroupName={newAccessPolicyGroupName}
                  onUpdateNewAccessPolicyGroupName={onUpdateNewAccessPolicyGroupName}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </Grid>
      </Grid>
    );
  }
}

SettingsDataForm.propTypes = {
  classes: PropTypes.object.isRequired,
  settings: PropTypes.object,
  onChangeSettingsData: PropTypes.func,
  onAddFallbackResponse: PropTypes.func.isRequired,
  onDeleteFallbackResponse: PropTypes.func.isRequired,
  errorState: PropTypes.object,
  accessPolicyGroups: PropTypes.array,
  selectedAccessPolicyGroup: PropTypes.object,
  handleOnchangeAccessPolicyGroup: PropTypes.func.isRequired,
  onUpdateAccessPolicyGroup: PropTypes.func.isRequired,
  onAddAccessPolicyGroup: PropTypes.func.isRequired,
  newAccessPolicyGroupName: PropTypes.string.isRequired,
  onUpdateNewAccessPolicyGroupName: PropTypes.func.isRequired,
};

export default withStyles(styles)(SettingsDataForm);
