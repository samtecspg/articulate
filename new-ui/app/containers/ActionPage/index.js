/**
 *
 * ActionPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { makeSelectAction, makeSelectActionWebhook, makeSelectActionPostFormat } from './selectors';

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
    if(this.state.isNewAction) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadAction(this.props.match.params.id);
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
    console.log(this.props);
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid container>
          <Grid className={classes.goBackCard} onClick={this.props.history.goBack} />
        </Grid>
        <ContentHeader
          title={messages.title}
          subtitle={this.state.isNewAction ? messages.createSubtitle : this.props.action.scenarioName}
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
              onChangeSlotData={this.props.onChangeSlotData}
              onAddTextPrompt={this.props.onAddTextPrompt}
              onDeleteTextPrompt={this.props.onDeleteTextPrompt}
              onAddNewSlot={this.props.onAddNewSlot}
              onChangeSlotName={this.props.onChangeSlotName}
              saying={{
                id: 1,
                userSays: 'Prepare me a ham and cheese pizza',
                entities: [
                  {
                    end: 16,
                    value: 'ham',
                    start: 13,
                    entity: 'Toppings',
                    entityId: 74
                  },
                  {
                    end: 27,
                    value: 'cheese',
                    start: 21,
                    entity: 'Toppings',
                    entityId: 74
                  }
                ],
                actions: ['orderPizza']
              }}
              agentKeywords={{
                keywords: [
                  {
                    keywordName: 'Toppings',
                    uiColor: '#f44336'
                  },
                  {
                    keywordName: 'Size',
                    uiColor: '#e91e63'
                  },
                  {
                    keywordName: 'Address',
                    uiColor: '#9575cd'
                  }
                ]
              }}
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
              saying={{
                id: 1,
                userSays: 'Prepare me a ham and cheese pizza',
                entities: [
                  {
                    end: 16,
                    value: 'ham',
                    start: 13,
                    entity: 'Toppings',
                    entityId: 74
                  },
                  {
                    end: 27,
                    value: 'cheese',
                    start: 21,
                    entity: 'Toppings',
                    entityId: 74
                  }
                ],
                actions: ['orderPizza']
              }}
              agentKeywords={{
                keywords: [
                  {
                    keywordName: 'Toppings',
                    uiColor: '#f44336'
                  },
                  {
                    keywordName: 'Size',
                    uiColor: '#e91e63'
                  },
                  {
                    keywordName: 'Address',
                    uiColor: '#9575cd'
                  }
                ]
              }}
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
  webhook: PropTypes.object,
  postFormat: PropTypes.object,
  onResetData: PropTypes.func,
  onLoadAction: PropTypes.func,
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
};

const mapStateToProps = createStructuredSelector({
  action: makeSelectAction(),
  webhook: makeSelectActionWebhook(),
  postFormat: makeSelectActionPostFormat(),
});

function mapDispatchToProps(dispatch) {
  return {
    onResetData: () => {
      console.log('reset data');
    },
    onLoadAction: (actionId) => {
      console.log('load action: ', actionId);
    },
    onAddNewAction: () => {
      console.log('add new action');
    },
    onEditAction: () => {
      console.log('edit action');
    },
    onChangeActionName: (actionName) => {
      console.log('name: ', actionName)
    },
    onChangeActionData: (field, value) => {
      console.log(field, value)
    },
    onChangeSlotData: (field, value) => {
      console.log(field, value);
    },
    onAddTextPrompt: (textPrompt) => {
      console.log('textPrompt: ', textPrompt)
    },
    onDeleteTextPrompt: (textPromptIndex) => {
      console.log('text prompt to delete: ', textPromptIndex);
    },
    onAddNewSlot: () => {
      console.log('adding new slot');
    },
    onChangeSlotName: (slotName) => {
      console.log(slotName);
    },
    onChangeWebhookData: (field, value) => {
      console.log({ field, value });
    },
    onChangeWebhookPayloadType: (field, value) => {
      console.log({ field, value });
    },
    onChangePostFormatData: (field, value) => {
      console.log({ field, value });
    },
    onAddResponse: (response) => {
      console.log('response: ', response)
    },
    onDeleteResponse: (responseIndex) => {
      console.log('response to delete: ', responseIndex);
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
