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

import { Grid, CircularProgress } from '@material-ui/core';
import MainTab from './Components/MainTab';
import ActionForm from './Components/ActionForm';
import SlotsForm from './Components/SlotsForm';
import WebhookForm from './Components/WebhookForm';
import ResponseForm from './Components/ResponseForm';

import injectSaga from 'utils/injectSaga';
import saga from './saga';

import qs from 'query-string';

import {
  makeSelectAction,
  makeSelectActionWebhook,
  makeSelectActionPostFormat,
  makeSelectKeywords,
  makeSelectAgent,
  makeSelectSayingForAction,
  makeSelectActions,
  makeSelectFilteredActions,
  makeSelectSuccessAction,
  makeSelectLoading,
  makeSelectActionTouched,
  makeSelectNewActionResponse
} from '../App/selectors';

import {
  loadAction,
  loadActions,
  loadKeywords,
  changeActionName,
  changeActionData,
  addActionResponse,
  deleteActionResponse,
  changeActionWebhookData,
  changeActionWebhookPayloadType,
  changeActionPostFormatData,
  addAction,
  updateAction,
  resetStatusFlag,
  resetActionData,
  chainActionToResponse,
  unchainActionFromResponse,
  addNewHeaderActionWebhook,
  deleteHeaderActionWebhook,
  changeHeaderNameActionWebhook,
  changeHeaderValueActionWebhook,
  deleteAction,
  addNewSlot,
  changeSlotName,
  changeSlotData,
  addSlotTextPrompt,
  deleteSlotTextPrompt,
  sortSlots,
  deleteSlot,
  copyResponse,
  updateNewResponse,
  editActionResponse,
  loadFilteredActions,
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
    cursor: 'pointer',
  },
};

/* eslint-disable react/prefer-stateless-function */
export class ActionPage extends React.Component {

  constructor(props){
    super(props);
    this.moveNextTab = this.moveNextTab.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.submit = this.submit.bind(this);
    this.initForm = this.initForm.bind(this);
    this.onSearchActions = this.onSearchActions.bind(this);
  }

  initForm(){
    this.props.onLoadKeywords();
    this.props.onLoadActions();
    if(this.state.isNewAction) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadAction(this.props.match.params.actionId);
    }
  }

  componentWillMount() {
    if(this.props.agent.id) {
      this.initForm();
    }
  }

  componentDidUpdate(prevProps){
    if (!prevProps.agent.id && this.props.agent.id){
      this.initForm();
    }
    if (this.props.success) {
      if (this.state.exitAfterSubmit){
        if (this.state.ref === 'agent'){
          this.props.onSuccess(`/agent/${this.props.agent.id}`);
        }
        else{
          this.props.onSuccess(`/agent/${this.props.agent.id}/dialogue?filter=${this.state.filter}&page=${this.state.page}&tab=sayings`);
        }
      }
      if (this.state.isNewAction) {
        this.setState({
          isNewAction: false,
        });
      }
    }
  }

  state = {
    isNewAction: this.props.match.params.actionId === 'create',
    currentTab: 'action',
    userCompletedAllRequiredFields: false,
    ref: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).ref,
    filter: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter,
    page: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page,
    formError: false,
    exitAfterSubmit: false,
    errorState: {
      actionName: false,
      postFormatPayload: false,
      webhookUrl: false,
      webhookPayload: false,
      responses: false,
      slots: [],
      tabs: [],
      slotsTabs: [],
    },
    actionFilter: '',
  };

  moveNextTab(){
    // If isn't currently on the last tab
    if (this.state.currentTab !== 'response'){
      const tabs = ['action', 'slots', 'webhook', 'response'];
      const currentTab = tabs.indexOf(this.state.currentTab);
      const nextTab = currentTab + 1;
      this.setState({
        currentTab: tabs[nextTab],
      })
    }
  }

  onChangeTab(tab){
    this.setState({
      currentTab: tab,
    });
  }
  
  onSearchActions(actionFilter) {
    this.setState({
      actionFilter,
    });
    this.props.onLoadFilteredActions(actionFilter);
  }

  submit(exit){
    let errors = false;
    const newErrorState = {
      actionName: false,
      postFormatPayload: false,
      webhookUrl: false,
      webhookPayload: false,
      responses: false,
      slots: [],
      tabs: [],
      slotsTabs: [],
    };

    if (!this.props.action.actionName || this.props.action.actionName === ''){
      errors = true;
      newErrorState.actionName = true;
      newErrorState.tabs.push(0);
    }
    else {
      newErrorState.actionName = false;
    }

    if (this.props.action.useWebhook && (!this.props.webhook.webhookUrl || this.props.webhook.webhookUrl === '')){
      errors = true;
      newErrorState.webhookUrl = true;
      newErrorState.tabs.push(2);
    }
    else {
      newErrorState.webhookUrl = false;
    }

    if (!this.props.action.responses || this.props.action.responses.length === 0){
      errors = true;
      newErrorState.responses = true;
      newErrorState.tabs.push(3);
    }
    else {
      newErrorState.responses = false;
    }

    if (this.props.action.slots.length > 0){
      this.props.action.slots.forEach((slot, slotIndex) => {
        const newSlotError = {
          slotName: false,
          keyword: false,
          textPrompts: false,
        };
        if (!slot.slotName){
          errors = true;
          newSlotError.slotName = true;
          newErrorState.tabs.push(1);
          newErrorState.slotsTabs.push(slotIndex);
        }
        else{
          newSlotError.slotName = false;
        }
        if (!slot.keyword){
          errors = true;
          newSlotError.keyword = true;
          newErrorState.tabs.push(1);
          newErrorState.slotsTabs.push(slotIndex);
        }
        else{
          newSlotError.keyword = false;
        }
        if (slot.isRequired && slot.textPrompts.length === 0){
          errors = true;
          newSlotError.textPrompts = true;
          newErrorState.tabs.push(1);
          newErrorState.slotsTabs.push(slotIndex);
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
      newErrorState.tabs.push(3);
    }

    try {
      if (this.props.action.useWebhook && this.props.webhook.webhookPayloadType !== 'None' && this.props.webhook.webhookPayload === ''){
        throw 'Webhook payload is not an object';
      }
      newErrorState.webhookPayload = false;
    } catch(e) {
      errors = true;
      newErrorState.webhookPayload = true;
      newErrorState.tabs.push(2);
    }

    if (!errors){
      this.setState({
        formError: false,
        exitAfterSubmit: exit,
        errorState: {...newErrorState},
      });
      if (this.state.isNewAction){
        // If the saying doesn't have an agent, then it is a new saying, so we will add the action to the new saying actions array
        this.props.onAddNewAction(this.props.saying.agent === '' && this.state.ref !== 'agent');
      }
      else {
        this.props.onEditAction();
      }
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
      this.props.agent.id ?
      <Grid container>
        <Grid container>
          <Grid className={classes.goBackCard} onClick={() => {
              this.state.ref === 'agent' ?
                this.props.onGoToUrl(`/agent/${this.props.agent.id}`) :
                this.props.onGoToUrl(`/agent/${this.props.agent.id}/dialogue?filter=${this.state.filter}&page=${this.state.page}&tab=sayings`)
            }}
          />
        </Grid>
        <MainTab
          touched={this.props.touched}
          loading={this.props.loading}
          success={this.props.success}
          onSaveAndExit={() => { this.submit(true) }}
          goBack={() => {this.state.ref === 'agent' ? 
            this.props.onGoToUrl(`/agent/${this.props.agent.id}`) :
            this.props.onGoToUrl(`/agent/${this.props.agent.id}/dialogue?filter=${this.state.filter}&page=${this.state.page}&tab=sayings`)
          }}
          newAction={this.state.isNewAction}
          actionName={this.props.action.actionName}
          formError={this.state.formError}
          hideFinishButton={this.state.currentTab === 'action' && !this.state.userCompletedAllRequiredFields}
          isLastTab={this.state.currentTab === 'response'}
          onFinishAction={this.submit}
          onNextAction={this.moveNextTab}
          selectedTab={this.state.currentTab}
          errorState={this.state.errorState}
          actionForm={
            <ActionForm
              action={this.props.action}
              onChangeActionName={this.props.onChangeActionName}
              errorState={this.state.errorState}
              newAction={this.state.isNewAction}
              onDelete={this.props.onDelete.bind(null, this.props.action.id, this.props.action.actionName)}
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
              newAction={this.state.isNewAction}
              onDelete={this.props.onDelete.bind(null, this.props.action.id, this.props.action.actionName)}
              onSortSlots={this.props.onSortSlots}
              onDeleteSlot={this.props.onDeleteSlot}
            />
          }
          webhookForm={
            <WebhookForm
              action={this.props.action}
              webhook={this.props.webhook}
              onChangeActionData={this.props.onChangeActionData}
              onChangeWebhookData={this.props.onChangeWebhookData}
              onChangeWebhookPayloadType={this.props.onChangeWebhookPayloadType}
              onAddNewHeader={this.props.onAddNewHeader}
              onDeleteHeader={this.props.onDeleteHeader}
              onChangeHeaderName={this.props.onChangeHeaderName}
              onChangeHeaderValue={this.props.onChangeHeaderValue}
              errorState={this.state.errorState}
              newAction={this.state.isNewAction}
              onDelete={this.props.onDelete.bind(null, this.props.action.id, this.props.action.actionName)}
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
              onChainActionToResponse={this.props.onChainActionToResponse}
              onUnchainActionFromResponse={this.props.onUnchainActionFromResponse}
              errorState={this.state.errorState}
              agentActions={this.props.agentActions}
              newAction={this.state.isNewAction}
              onDelete={this.props.onDelete.bind(null, this.props.action.id, this.props.action.actionName)}
              newResponse={this.props.newResponse}
              onUpdateNewResponse={this.props.onUpdateNewResponse}
              onCopyResponse={this.props.onCopyResponse}
              onEditActionResponse={this.props.onEditActionResponse}
              onSearchActions={this.onSearchActions}
              agentFilteredActions={this.props.agentFilteredActions}
            />
          }
          onChangeTab={this.onChangeTab}
        />
      </Grid> : 
      <CircularProgress style={{position: 'absolute', top: '40%', left: '49%'}}/>
    );
  }
}

ActionPage.propTypes = {
  classes: PropTypes.object.isRequired,
  action: PropTypes.object,
  webhook: PropTypes.object,
  postFormat: PropTypes.object,
  agentKeywords: PropTypes.array,
  onResetData: PropTypes.func,
  onLoadAction: PropTypes.func,
  onLoadKeywords: PropTypes.func,
  onAddNewAction: PropTypes.func,
  onEditAction: PropTypes.func,
  onChangeActionName: PropTypes.func,
  onChangeActionData: PropTypes.func,
  newSlot: PropTypes.object,
  onChangeSlotData: PropTypes.func,
  onAddNewSlot: PropTypes.func,
  onChangeSlotName: PropTypes.func,
  onSortSlots: PropTypes.func,
  onDeleteSlot: PropTypes.func,
  onAddTextPrompt: PropTypes.func,
  onDeleteTextPrompt: PropTypes.func,
  onChangeWebhookData: PropTypes.func,
  onChangeWebhookPayloadType: PropTypes.func,
  onChangePostFormatData: PropTypes.func,
  onAddNewHeader: PropTypes.func,
  onDeleteHeader: PropTypes.func,
  onChangeHeaderName: PropTypes.func,
  onChangeHeaderValue: PropTypes.func,
  onAddResponse: PropTypes.func,
  onDeleteResponse: PropTypes.func,
  onChainActionToResponse: PropTypes.func,
  onUnchainActionFromResponse: PropTypes.func,
  onSuccess: PropTypes.func,
  agentActions: PropTypes.array,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  touched: PropTypes.bool,
  onCopyResponse: PropTypes.func,
  newResponse: PropTypes.string,
  onEditActionResponse: PropTypes.func,
  onLoadActions: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  action: makeSelectAction(),
  agentActions: makeSelectActions(),
  webhook: makeSelectActionWebhook(),
  postFormat: makeSelectActionPostFormat(),
  agentKeywords: makeSelectKeywords(),
  saying: makeSelectSayingForAction(),
  success: makeSelectSuccessAction(),
  loading: makeSelectLoading(),
  touched: makeSelectActionTouched(),
  newResponse: makeSelectNewActionResponse(),
  agentFilteredActions: makeSelectFilteredActions(),
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
    onAddResponse: (response) => {
      dispatch(addActionResponse(response));
    },
    onDeleteResponse: (responseIndex) => {
      dispatch(deleteActionResponse(responseIndex));
    },
    onChainActionToResponse: (responseIndex, actionName) => {
      dispatch(chainActionToResponse(responseIndex, actionName));
    },
    onUnchainActionFromResponse: (responseIndex, actionIndex) => {
      dispatch(unchainActionFromResponse(responseIndex, actionIndex));
    },
    onChangeWebhookData: (field, value) => {
      dispatch(changeActionWebhookData({field, value}));
    },
    onChangeWebhookPayloadType: (field, value) => {
      dispatch(changeActionWebhookPayloadType({field, value}));
    },
    onAddNewHeader: (payload) => {
      dispatch(addNewHeaderActionWebhook(payload));
    },
    onDeleteHeader: (headerIndex) => {
      dispatch(deleteHeaderActionWebhook(headerIndex));
    },
    onChangeHeaderName: (headerIndex, value) => {
      dispatch(changeHeaderNameActionWebhook(headerIndex, value));
    },
    onChangeHeaderValue: (headerIndex, value) => {
      dispatch(changeHeaderValueActionWebhook(headerIndex, value));
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
    onDelete: (id, actionName) => {
      dispatch(deleteAction(id, actionName));
    },
    onAddNewSlot: () => {
      dispatch(addNewSlot());
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
    onSortSlots: (oldIndex, newIndex) => {
      dispatch(sortSlots(oldIndex, newIndex));
    },
    onDeleteSlot: (slotIndex) => {
      dispatch(deleteSlot(slotIndex));
    },
    onUpdateNewResponse: (response) => {
      dispatch(updateNewResponse(response));
    },
    onCopyResponse: (response) => {
      dispatch(copyResponse(response));
    },
    onEditActionResponse: (newResponse, responseIndex) => {
      dispatch(editActionResponse(newResponse, responseIndex));
    },
    onLoadFilteredActions: (filter) => {
      dispatch(loadFilteredActions(filter));
    },
    onLoadActions: () => {
      dispatch(loadActions());
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
