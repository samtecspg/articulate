import { CircularProgress, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { GROUP_ACCESS_CONTROL } from '../../../common/constants';
import ContentHeader from '../../components/ContentHeader';
import AC from '../../utils/accessControl';
import injectSaga from '../../utils/injectSaga';
import {
  addAccessPolicyGroup,
  addFallbackResponse,
  changeAccessPolicyGroup,
  changeSettingsData,
  deleteFallbackResponse,
  loadAccessPolicyGroups,
  loadSettings,
  removeAccessPolicyGroup,
  toggleChatButton,
  toggleConversationBar,
  updateAccessPolicyGroup,
  updateSettings,
  updateSettingsTouched,
} from '../App/actions';
import {
  makeSelectAccessPolicyGroups,
  makeSelectCurrentUser,
  makeSelectError,
  makeSelectLoading,
  makeSelectSettings,
  makeSelectSettingsTouched,
  makeSelectSuccess,
} from '../App/selectors';
import ActionButtons from './Components/ActionButtons';
import Form from './Components/Form';
import messages from './messages';
import saga from './saga';
import _ from 'lodash';
/* eslint-disable react/prefer-stateless-function */
export class SettingsPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.onShowChatButton(false);
    this.props.onToggleConversationBar(false);
    this.props.onLoadSettings();
    this.props.onLoadAccessPolicyGroups();
  }

  componentDidUpdate() {
    if (this.props.settingsSuccess) {
      if (this.state.exitAfterSubmit) {
        this.props.onUpdateSettingsTouched(false);
        this.props.onGoToUrl(`/`);
      }
    }
  }

  state = {
    formError: false,
    newAccessPolicyGroupName: '',
    errorState: {
      rasaURLs: false,
      rasaConcurrentRequests: false,
      ducklingURL: false,
      defaultUISessionId: false,
      ducklingDimension: false,
      categoryClassifierPipeline: false,
      sayingClassifierPipeline: false,
      keywordClassifierPipeline: false,
      spacyPretrainedEntities: false,
      timezones: false,
      agentLanguages: false,
      uiLanguages: false,
      defaultTimezone: false,
      defaultAgentFallbackResponses: false,
    },
    exitAfterSubmit: false,
  };

  submit(exit) {
    let errors = false;
    const newErrorState = {
      rasaURLs: false,
      rasaConcurrentRequests: false,
      ducklingURL: false,
      defaultUISessionId: false,
      ducklingDimension: false,
      categoryClassifierPipeline: false,
      sayingClassifierPipeline: false,
      keywordClassifierPipeline: false,
      spacyPretrainedEntities: false,
      timezones: false,
      agentLanguages: false,
      uiLanguages: false,
      defaultTimezone: false,
      defaultAgentLanguage: false,
      uiLanguage: false,
      defaultAgentFallbackResponses: false,
    };

    if (!this.props.settings.defaultUISessionId || this.props.settings.defaultUISessionId === '') {
      errors = true;
      newErrorState.defaultUISessionId = true;
    } else {
      newErrorState.defaultUISessionId = false;
    }

    if (
      !this.props.settings.rasaURLs ||
      this.props.settings.rasaURLs.length === 0 ||
      this.props.settings.rasaURLs.indexOf('') !== -1 ||
      this.props.settings.rasaURLs.some(item => {
        return this.props.settings.rasaURLs.indexOf(item) !== this.props.settings.rasaURLs.lastIndexOf(item);
      })
    ) {
      errors = true;
      newErrorState.rasaURLs = true;
    } else {
      newErrorState.rasaURLs = false;
    }

    if (!this.props.settings.rasaConcurrentRequests || this.props.settings.rasaConcurrentRequests === '') {
      errors = true;
      newErrorState.rasaConcurrentRequests = true;
    } else {
      newErrorState.rasaConcurrentRequests = false;
    }

    if (!this.props.settings.ducklingURL || this.props.settings.ducklingURL === '') {
      errors = true;
      newErrorState.ducklingURL = true;
    } else {
      newErrorState.ducklingURL = false;
    }

    if (!this.props.settings.defaultAgentFallbackResponses || this.props.settings.defaultAgentFallbackResponses.length === 0) {
      errors = true;
      newErrorState.defaultAgentFallbackResponses = true;
    } else {
      newErrorState.defaultAgentFallbackResponses = false;
    }

    if (
      !Array.isArray(this.props.settings.agentLanguages) ||
      (Array.isArray(this.props.settings.agentLanguages) &&
        this.props.settings.agentLanguages.filter(agentLanguage => agentLanguage.value === this.props.settings.defaultAgentLanguage).length === 0) ||
      !this.props.settings.defaultAgentLanguage ||
      this.props.settings.defaultAgentLanguage === ''
    ) {
      errors = true;
      newErrorState.defaultAgentLanguage = true;
    } else {
      newErrorState.defaultAgentLanguage = false;
    }

    if (
      !Array.isArray(this.props.settings.uiLanguages) ||
      (Array.isArray(this.props.settings.uiLanguages) &&
        this.props.settings.uiLanguages.filter(uiLanguage => uiLanguage.value === this.props.settings.uiLanguage).length === 0) ||
      !this.props.settings.uiLanguage ||
      this.props.settings.uiLanguage === ''
    ) {
      errors = true;
      newErrorState.uiLanguage = true;
    } else {
      newErrorState.uiLanguage = false;
    }

    if (
      !Array.isArray(this.props.settings.timezones) ||
      (Array.isArray(this.props.settings.timezones) && this.props.settings.timezones.indexOf(this.props.settings.defaultTimezone) === -1) ||
      !this.props.settings.defaultTimezone ||
      this.props.settings.defaultTimezone === ''
    ) {
      errors = true;
      newErrorState.defaultTimezone = true;
    } else {
      newErrorState.defaultTimezone = false;
    }

    try {
      if (!Array.isArray(this.props.settings.ducklingDimension)) {
        throw 'Duckling dimensions is not an array';
      }
      newErrorState.ducklingDimension = false;
    } catch (e) {
      errors = true;
      newErrorState.ducklingDimension = true;
    }

    try {
      if (!Array.isArray(this.props.settings.categoryClassifierPipeline)) {
        throw 'Category classifier pipeline is not an array';
      }
      newErrorState.categoryClassifierPipeline = false;
    } catch (e) {
      errors = true;
      newErrorState.categoryClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.settings.sayingClassifierPipeline)) {
        throw 'Saying classifier pipeline is not an array';
      }
      newErrorState.sayingClassifierPipeline = false;
    } catch (e) {
      errors = true;
      newErrorState.sayingClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.settings.keywordClassifierPipeline)) {
        throw 'Keyword classifier pipeline is not an array';
      }
      newErrorState.keywordClassifierPipeline = false;
    } catch (e) {
      errors = true;
      newErrorState.keywordClassifierPipeline = true;
    }

    try {
      if (!Array.isArray(this.props.settings.spacyPretrainedEntities)) {
        throw 'Spacy pretrained entities is not an array';
      }
      newErrorState.spacyPretrainedEntities = false;
    } catch (e) {
      errors = true;
      newErrorState.spacyPretrainedEntities = true;
    }

    try {
      if (!Array.isArray(this.props.settings.timezones)) {
        throw 'Timezones is not an array';
      }
      newErrorState.timezones = false;
    } catch (e) {
      errors = true;
      newErrorState.timezones = true;
    }

    try {
      if (!Array.isArray(this.props.settings.agentLanguages)) {
        throw 'Agent languages is not an array of object';
      }
      newErrorState.agentLanguages = false;
    } catch (e) {
      errors = true;
      newErrorState.agentLanguages = true;
    }

    try {
      if (!Array.isArray(this.props.settings.uiLanguages)) {
        throw 'UI languages is not an array of object';
      }
      newErrorState.uiLanguages = false;
    } catch (e) {
      errors = true;
      newErrorState.uiLanguages = true;
    }

    if (!errors) {
      this.setState({
        formError: false,
        errorState: { ...newErrorState },
        exitAfterSubmit: exit,
      });
      this.props.onSaveChanges();
      const accessPolicyGroups = _.map(this.props.accessPolicyGroups, group => _.pick(group, ['id', 'name', 'rules']));
      this.props.onUpdateAccessPolicyGroup({ accessPolicyGroups });
    } else {
      this.setState({
        formError: true,
        errorState: { ...newErrorState },
      });
    }
  }

  onUpdateNewAccessPolicyGroupName = ({ groupName }) => {
    this.setState({ newAccessPolicyGroupName: groupName });
  };

  render() {
    const { currentUser } = this.props;
    const isReadOnly = !AC.validate({ userPolicies: currentUser.simplifiedGroupPolicies, requiredPolicies: [GROUP_ACCESS_CONTROL.AGENT_WRITE] });

    return this.props.settings.defaultUISessionId ? (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={messages.createSubtitle}
          inlineElement={
            <ActionButtons
              fowrmError={this.state.formError}
              onFinishAction={() => {
                this.submit(false);
              }}
              touched={this.props.settingsTouched}
              loading={this.props.settingsLoading}
              success={this.props.settingsSuccess}
              error={this.props.settingsError || this.state.formError}
              onExit={() => {
                this.props.onUpdateSettingsTouched(false);
                this.props.onGoToUrl(`/`);
              }}
              onSaveAndExit={() => {
                this.submit(true);
              }}
            />
          }
        />
        <Form
          isReadOnly={isReadOnly}
          settings={this.props.settings}
          onChangeSettingsData={this.props.onChangeSettingsData}
          onAddFallbackResponse={this.props.onAddFallbackResponse}
          onDeleteFallbackResponse={this.props.onDeleteFallbackResponse}
          errorState={this.state.errorState}
          accessPolicyGroups={this.props.accessPolicyGroups}
          onUpdateAccessPolicyGroup={this.props.onChangeAccessPolicyGroup}
          onAddAccessPolicyGroup={this.props.onAddAccessPolicyGroup}
          newAccessPolicyGroupName={this.state.newAccessPolicyGroupName}
          onUpdateNewAccessPolicyGroupName={this.onUpdateNewAccessPolicyGroupName}
          onRemoveAccessPolicyGroup={this.props.onRemoveAccessPolicyGroup}
        />
      </Grid>
    ) : (
      <CircularProgress style={{ position: 'absolute', top: '40%', left: '49%' }} />
    );
  }
}

SettingsPage.propTypes = {
  settings: PropTypes.object,
  settingsTouched: PropTypes.bool,
  onChangeSettingsData: PropTypes.func,
  onSaveChanges: PropTypes.func,
  onAddFallbackResponse: PropTypes.func.isRequired,
  onDeleteFallbackResponse: PropTypes.func.isRequired,
  onShowChatButton: PropTypes.func,
  onToggleConversationBar: PropTypes.func,
  onLoadSettings: PropTypes.func,
  onLoadAccessPolicyGroups: PropTypes.func,
  onUpdateAccessPolicyGroup: PropTypes.func,
  onChangeAccessPolicyGroup: PropTypes.func,
  onAddAccessPolicyGroup: PropTypes.func,
  accessPolicyGroups: PropTypes.array,
  currentUser: PropTypes.object,
  onRemoveAccessPolicyGroup: PropTypes.func,
};
SettingsPage.defaultProps = {
  accessPolicyGroups: [],
};
const mapStateToProps = createStructuredSelector({
  settings: makeSelectSettings(),
  settingsTouched: makeSelectSettingsTouched(),
  settingsSuccess: makeSelectSuccess(),
  settingsLoading: makeSelectLoading(),
  settingsError: makeSelectError(),
  accessPolicyGroups: makeSelectAccessPolicyGroups(),
  currentUser: makeSelectCurrentUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadSettings: () => {
      dispatch(loadSettings());
    },
    onChangeSettingsData: (field, value) => {
      dispatch(changeSettingsData({ field, value }));
    },
    onSaveChanges: () => {
      dispatch(updateSettings());
    },
    onUpdateSettingsTouched: value => {
      dispatch(updateSettingsTouched(value));
    },
    onAddFallbackResponse: newFallback => {
      dispatch(addFallbackResponse(newFallback));
    },
    onDeleteFallbackResponse: fallbackIndex => {
      dispatch(deleteFallbackResponse(fallbackIndex));
    },
    onShowChatButton: value => {
      dispatch(toggleChatButton(value));
    },
    onToggleConversationBar: value => {
      dispatch(toggleConversationBar(value));
    },
    onGoToUrl: url => {
      dispatch(push(url));
    },
    onLoadAccessPolicyGroups: () => {
      dispatch(loadAccessPolicyGroups());
    },
    onUpdateAccessPolicyGroup: ({ accessPolicyGroups }) => {
      dispatch(updateAccessPolicyGroup({ accessPolicyGroups }));
    },
    onChangeAccessPolicyGroup: ({ groupName, rules }) => {
      dispatch(changeAccessPolicyGroup({ groupName, rules }));
    },
    onAddAccessPolicyGroup: ({ groupName, rules }) => {
      dispatch(addAccessPolicyGroup({ groupName, rules }));
    },
    onRemoveAccessPolicyGroup: ({ groupName }) => {
      dispatch(removeAccessPolicyGroup({ groupName }));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'settings', saga });

export default compose(
  withSaga,
  withConnect,
)(SettingsPage);
