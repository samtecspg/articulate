/**
 *
 * ActionPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withStyles } from "@material-ui/core/styles";

import { Grid } from '@material-ui/core';
import ContentHeader from 'components/ContentHeader';
import ActionButtons from './Components/ActionButtons';
import MainTab from './Components/MainTab';
import ActionForm from './Components/ActionForm';
import SlotsForm from './Components/SlotsForm';
import WebhookForm from './Components/WebhookForm';
import ResponseForm from './Components/ResponseForm';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import messages from './messages';

import {
  makeSelectAction,
  makeSelectActionWebhook,
  makeSelectActionPostFormat,
  makeSelectKeywords,
  makeSelectSuccess,
  makeSelectAgent,
  makeSelectSayingForAction
} from '../App/selectors';

import {
  loadAction,
  loadKeywords,
  resetAgentData,
  changeActionName,
  changeActionData,
  addNewSlot,
  addActionResponse,
  deleteActionResponse,
  changeSlotName,
  changeSlotData,
  addSlotTextPrompt,
  deleteSlotTextPrompt,
  changeActionWebhookData,
  changeActionWebhookPayloadType,
  changeActionPostFormatData,
  addAction,
  updateAction,
  resetStatusFlag,
} from '../App/actions';

const styles = {
  goBackCard: {
    height: '50vh',
    width: '3vh',
    border: '1px solid #c5cbd8',
    backgroundColor: '#fff',
    boxShadow: '0 3px 3px 0 #c5cbd8',
    position: 'fixed',
    left: 0,
    top: '30vh',
    cursor: 'pointer'
  }
}

/* eslint-disable react/prefer-stateless-function */
export class ActionPage extends React.Component {

  constructor(props){
    super(props);
    this.moveNextTab = this.moveNextTab.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
  }

  componentDidMount() {
    this.props.onLoadKeywords();
    if(this.state.isNewAction) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadAction(this.props.match.params.actionId);
    }
  }

  componentDidUpdate() {
    if (this.props.success) {
      this.props.onSuccess(`/agent/${this.props.agent.id}/sayings`);
    }
  }

  state = {
    isNewAction: this.props.match.params.actionId === 'create',
    currentTab: 'action',
    userCompletedAllRequiredFields: false
  };

  moveNextTab(){
    //If isn't currently on the last tab
    if (this.state.currentTab !== 'response'){
      const tabs = ['action', 'slots', 'webhook', 'response'];
      const currentTab = tabs.indexOf(this.state.currentTab);
      const nextTab = currentTab + 1
      this.setState({
        currentTab: tabs[nextTab]
      })
    }
  }

  onChangeTab(tab){
    this.setState({
      currentTab: tab
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid container>
          <Grid className={classes.goBackCard} onClick={this.props.history.goBack} />
        </Grid>
        <ContentHeader
          title={messages.title}
          subtitle={this.state.isNewAction ? messages.createSubtitle : this.props.action.actionName}
          inlineElement={
            <ActionButtons
              hideFinishButton={this.state.currentTab === 'action' && !this.state.userCompletedAllRequiredFields}
              isLastTab={this.state.currentTab === 'response'}
              onFinishAction={this.state.isNewAction ? this.props.onAddNewAction : this.props.onEditAction}
              onNextAction={this.moveNextTab}
            />
          }
          backButton={messages.backButton}
        />
        <MainTab
          selectedTab={this.state.currentTab}
          actionForm={
            <ActionForm
              action={this.props.action}
              onChangeActionName={this.props.onChangeActionName}
            />
          }
          slotsForm={
            <SlotsForm
              action={this.props.action}
              newSlot={this.props.newSlot}
              onChangeSlotData={this.props.onChangeSlotData}
              onAddTextPrompt={this.props.onAddTextPrompt}
              onDeleteTextPrompt={this.props.onDeleteTextPrompt}
              onAddNewSlot={this.props.onAddNewSlot}
              onChangeSlotName={this.props.onChangeSlotName}
              saying={this.props.saying}
              agentKeywords={this.props.agentKeywords}
            />
          }
          webhookForm={
            <WebhookForm
              action={this.props.action}
              webhook={this.props.webhook}
              onChangeActionData={this.props.onChangeActionData}
              onChangeWebhookData={this.props.onChangeWebhookData}
              onChangeWebhookPayloadType={this.props.onChangeWebhookPayloadType}
            />
          }
          responseForm={
            <ResponseForm
              action={this.props.action}
              postFormat={this.props.postFormat}
              onChangeActionData={this.props.onChangeActionData}
              onChangePostFormatData={this.props.onChangePostFormatData}
              saying={this.props.saying}
              agentKeywords={this.props.agentKeywords}
              onAddResponse={this.props.onAddResponse}
              onDeleteResponse={this.props.onDeleteResponse}
            />
          }
          onChangeTab={this.onChangeTab}
        />
      </Grid>
    );
  }
}

ActionPage.propTypes = {
  classes: PropTypes.object.isRequired,
  action: PropTypes.object,
  newSlot: PropTypes.object,
  webhook: PropTypes.object,
  postFormat: PropTypes.object,
  success: PropTypes.bool,
  agentKeywords: PropTypes.array,
  onResetData: PropTypes.func,
  onLoadAction: PropTypes.func,
  onLoadKeywords: PropTypes.func,
  onAddNewAction: PropTypes.func,
  onEditAction: PropTypes.func,
  onChangeActionName: PropTypes.func,
  onChangeActionData: PropTypes.func,
  onChangeSlotData: PropTypes.func,
  onAddTextPrompt: PropTypes.func,
  onDeleteTextPrompt: PropTypes.func,
  onAddNewSlot: PropTypes.func,
  onChangeSlotName: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  onChangePostFormatData: PropTypes.func,
  onAddResponse: PropTypes.func,
  onDeleteResponse: PropTypes.func,
  onSuccess: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  action: makeSelectAction(),
  webhook: makeSelectActionWebhook(),
  postFormat: makeSelectActionPostFormat(),
  agentKeywords: makeSelectKeywords(),
  success: makeSelectSuccess(),
  saying: makeSelectSayingForAction(),
});

function mapDispatchToProps(dispatch) {
  return {
    onResetData: () => {
      dispatch(resetAgentData());
    },
    onLoadAction: (actionId) => {
      dispatch(loadAction(actionId));
    },
    onLoadKeywords: () => {
      dispatch(loadKeywords());
    },
    onChangeActionName: (field, value) => {
      dispatch(changeActionName({ field, value }));
    },
    onChangeActionData: (field, value) => {
      dispatch(changeActionData({ field, value }));
    },
    onAddNewSlot: () => {
      dispatch(addNewSlot());
    },
    onAddResponse: (response) => {
      dispatch(addActionResponse(response));
    },
    onDeleteResponse: (responseIndex) => {
      dispatch(deleteActionResponse(responseIndex));
    },
    onChangeSlotName: (slotIndex, slotName) => {
      dispatch(changeSlotName({slotIndex, slotName}));
    },
    onChangeSlotData: (slotIndex, field, value) => {
      dispatch(changeSlotData({slotIndex, field, value}))
    },
    onAddTextPrompt: (slotIndex, newTextPrompt) => {
      dispatch(addSlotTextPrompt({slotIndex, newTextPrompt}))
    },
    onDeleteTextPrompt: (slotIndex, textPromptIndex) => {
      dispatch(deleteSlotTextPrompt({slotIndex, textPromptIndex}));
    },
    onChangeWebhookData: (field, value) => {
      dispatch(changeActionWebhookData({field, value}));
    },
    onChangeWebhookPayloadType: (field, value) => {
      dispatch(changeActionWebhookPayloadType({field, value}));
    },
    onChangePostFormatData: (field, value) => {
      dispatch(changeActionPostFormatData({field, value}));
    },
    onAddNewAction: () => {
      dispatch(addAction());
    },
    onSuccess: (url) => {
      dispatch(resetStatusFlag());
      dispatch(push(url));
    },
    onEditAction: () => {
      dispatch(updateAction());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'action', saga });

export default compose(
  withSaga,
  withConnect,
  withStyles(styles)
)(ActionPage);
