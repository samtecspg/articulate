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

import qs from 'query-string';

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
  resetActionData,
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
    this.submit = this.submit.bind(this);
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
      this.props.onSuccess(`/agent/${this.props.agent.id}/sayings?filter=${this.state.filter}&page=${this.state.page}`);
    }
  }

  state = {
    isNewAction: this.props.match.params.actionId === 'create',
    currentTab: 'action',
    userCompletedAllRequiredFields: false,
    filter: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter,
    page: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page,
    formError: false,
    errorState: {
      actionName: false,
      postFormatPayload: false,
      webhookUrl: false,
      webhookPayload: false,
      responses: false,
      slots: [],
    },
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

  submit(){
    let errors = false;
    const newErrorState = {
      actionName: false,
      postFormatPayload: false,
      webhookUrl: false,
      webhookPayload: false,
      responses: false,
      slots: [],
    }

    if (!this.props.action.actionName || this.props.action.actionName === ''){
      errors = true;
      newErrorState.actionName = true;
    }
    else {
      newErrorState.actionName = false;
    }

    if (this.props.action.useWebhook && (!this.props.webhook.webhookUrl || this.props.webhook.webhookUrl === '')){
      errors = true;
      newErrorState.webhookUrl = true;
    }
    else {
      newErrorState.webhookUrl = false;
    }

    if (!this.props.action.responses || this.props.action.responses.length === 0){
      errors = true;
      newErrorState.responses = true;
    }
    else {
      newErrorState.responses = false;
    }

    if (this.props.action.slots.length > 0){
      this.props.action.slots.forEach((slot) => {
        const newSlotError = {
          slotName: false,
          keyword: false,
          textPrompts: false,
        };
        if (!slot.slotName){
          errors = true;
          newSlotError.slotName = true;
        }
        else{
          newSlotError.slotName = false;
        }
        if (!slot.keyword){
          errors = true;
          newSlotError.keyword = true;
        }
        else{
          newSlotError.keyword = false;
        }
        if (slot.isRequired && slot.textPrompts.length === 0){
          errors = true;
          newSlotError.textPrompts = true;
        }
        else{
          newSlotError.textPrompts = false;
        }
        newErrorState.slots.push(newSlotError);
      });
    }

    try {
      if (this.props.action.usePostFormat && this.props.postFormat.postFormatPayload === ''){
        throw 'Response payload is not an object';
      }
      newErrorState.postFormatPayload = false;
    } catch(e) {
      errors = true;
      newErrorState.postFormatPayload = true;
    }

    try {
      if (this.props.action.useWebhook && this.props.webhook.webhookPayloadType !== 'None' && this.props.webhook.webhookPayload === ''){
        throw 'Webhook payload is not an object';
      }
      newErrorState.webhookPayload = false;
    } catch(e) {
      errors = true;
      newErrorState.webhookPayload = true;
    }

    if (!errors){
      this.setState({
        formError: false,
      });
      if (this.state.isNewAction){
        //If the saying doesn't have an agent, then it is a new saying, so we will add the action to the new saying actions array
        this.props.onAddNewAction(this.props.saying.agent === '');
      }
      else {
        this.props.onEditAction();
      };
    }
    else {
      this.setState({
        formError: true,
        errorState: {...newErrorState},
      });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid container>
          <Grid className={classes.goBackCard} onClick={() => {this.props.onGoToUrl(`/agent/${this.props.agent.id}/sayings?filter=${this.state.filter}&page=${this.state.page}`)}} />
        </Grid>
        <ContentHeader
          title={messages.title}
          subtitle={this.state.isNewAction ? messages.createSubtitle : this.props.action.actionName}
          inlineElement={
            <ActionButtons
              formError={this.state.formError}
              hideFinishButton={this.state.currentTab === 'action' && !this.state.userCompletedAllRequiredFields}
              isLastTab={this.state.currentTab === 'response'}
              onFinishAction={this.submit}
              onNextAction={this.moveNextTab}
            />
          }
          backButton={messages.backButton}
          goBack={() => {this.props.onGoToUrl(`/agent/${this.props.agent.id}/sayings?filter=${this.state.filter}&page=${this.state.page}`)}}
        />
        <MainTab
          selectedTab={this.state.currentTab}
          actionForm={
            <ActionForm
              action={this.props.action}
              onChangeActionName={this.props.onChangeActionName}
              errorState={this.state.errorState}
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
              errorState={this.state.errorState}
            />
          }
          webhookForm={
            <WebhookForm
              action={this.props.action}
              webhook={this.props.webhook}
              onChangeActionData={this.props.onChangeActionData}
              onChangeWebhookData={this.props.onChangeWebhookData}
              onChangeWebhookPayloadType={this.props.onChangeWebhookPayloadType}
              errorState={this.state.errorState}
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
              errorState={this.state.errorState}
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
      dispatch(resetActionData());
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
    onAddNewAction: (addToNewSayingActions) => {
      dispatch(addAction(addToNewSayingActions));
    },
    onSuccess: (url) => {
      dispatch(resetStatusFlag());
      dispatch(push(url));
    },
    onEditAction: () => {
      dispatch(updateAction());
    },
    onGoToUrl: (url) => {
      dispatch(push(url));
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
