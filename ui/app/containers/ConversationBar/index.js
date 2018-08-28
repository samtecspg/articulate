import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ta from 'time-ago'
import AgentMessage from '../../components/AgentMessage';
import LoadingWave from '../../components/LoadingWave';
import TestMessageInput from '../../components/TestMessageInput';
import UserMessage from '../../components/UserMessage';
import VoiceRecognition from '../../components/VoiceRecognition';
import { converse, resetSession, trainAgent, loadCurrentAgentStatus } from '../App/actions';
import {
  makeSelectConversation,
  makeSelectCurrentAgent,
  makeSelectLoadingConversation,
  makeSelectCurrentAgentStatus,
} from '../App/selectors';

import messages from './messages';

const getLastTrainingTime = (lastTraining) => {

  const timeAgo = ta.ago(lastTraining);
  if (timeAgo.indexOf('second') !== -1 || timeAgo.indexOf(' ms ') !== -1){
    return 'Just now';
  }
  return timeAgo;
}

class ConversationBar extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.onVoiceRecognitionStart = this.onVoiceRecognitionStart.bind(this);
    this.onVoiceRecognitionEnd = this.onVoiceRecognitionEnd.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.sendVoiceMessage = this.sendVoiceMessage.bind(this);
    this.sendTextMessage = this.sendTextMessage.bind(this);
  }

  state = {
    start: false,
    stop: false,
    repeatPreviousMessage: null,
  };

  componentDidMount() {
    //Interval defined to refresh agent status
    this.interval = setInterval(() => this.tick(), 10000);
    this.scrollToBottom();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  onVoiceRecognitionStart = () => {
    this.setState({ start: true });
  };

  onVoiceRecognitionEnd = () => {
    this.setState({ start: false, stop: false });
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView(true);
  };

  sendVoiceMessage(message) {
    const agentId = this.props.currentAgent ? this.props.currentAgent.id : null;
    this.setState({ start: false });
    this.props.onSendMessage(agentId, message.finalTranscript);
  }

  sendTextMessage(evt) {
    if (evt.keyCode === 13) {
      const message = evt.target.value;
      evt.target.value = null;
      const agentId = this.props.currentAgent ? this.props.currentAgent.id : null;
      this.props.onSendMessage(agentId, message);
      this.state.repeatPreviousMessage = null;
    }
    if (evt.keyCode === 38) {
      if (this.props.conversation.length > 0) {
        let messages = this.props.conversation;
        let len = this.state.repeatPreviousMessage || messages.length;
        let message = null;

        while (len-- && !message) {
          if (messages[len].author == "user") {
            this.state.repeatPreviousMessage = len
            message = messages[len].message;
          }
        }

        evt.target.value = message;
      }
    }
  }

  tick() {
    //reload to update status and last training date
    if (this.props.currentAgent){
      this.props.onLoadAgentStatus(this.props.currentAgent.id);
    }
  }

  renderMenu() {
    return [{
      label: 'Reset session',
      action: () => this.props.onResetSession(),
    }];
  }

  render() {
    return (
      <div>
        <aside style={{backgroundColor: this.props.currentAgentStatus && this.props.currentAgentStatus.status === 'Training' ? '#eaeaea' : 'white'}} className="right-panel-header">
          <div className="training-container">
            <div className={`status-area left ${this.props.currentAgentStatus ? (this.props.currentAgentStatus.status === 'Training' ? 'hide' : '') : ''}`}>
              <p
                className="condition">
                {messages.statusLabel.defaultMessage}:&nbsp;
                <span style={{ color: this.props.currentAgentStatus ? (this.props.currentAgentStatus.status === 'Ready' ? '#00ca9f' : (['Out of Date', 'Error'].indexOf(this.props.currentAgentStatus.status) > -1 ? '#de5e56' : '#4e4e4e')) : '#4e4e4e'}} >
                  {this.props.currentAgentStatus && this.props.currentAgentStatus.status ? this.props.currentAgentStatus.status : '-'}
                </span>
              </p>
              <p
                className="trained-timestamp">{messages.trainedLabel.defaultMessage}:&nbsp;
                <span>
                  {this.props.currentAgentStatus ?
                    (this.props.currentAgentStatus.lastTraining ?
                      getLastTrainingTime(new Date(this.props.currentAgentStatus.lastTraining)) :
                      'Never trained') :
                    '-'}
                </span>
              </p>
            </div>
            <a
              onClick={() => { this.props.onTrainAgent(this.props.currentAgent)}}
              disabled={this.props.currentAgent && this.props.currentAgentStatus ? this.props.currentAgentStatus.status === 'Ready' : true}
              className={`btn-floating btn-small right ${this.props.currentAgentStatus ? (this.props.currentAgentStatus.status === 'Training' ? 'activate-training' : '') : ''}`}>
                { this.props.currentAgentStatus ? (this.props.currentAgentStatus.status === 'Training' ? messages.trainInProcessButton.defaultMessage : messages.trainButton.defaultMessage) : messages.trainButton.defaultMessage }
              </a>
          </div>
        </aside>
        <aside className="right-panel">
          <ul className="conversation-panel" style={{ paddingTop: '18px', overflowY: 'auto' }}>
            {
              this.props.conversation.map((message, messageIndex) => {
                if (message.author === 'agent') {
                  return <AgentMessage key={messageIndex} text={message.message} />;
                }
                if (message.author === 'user') {
                  return <UserMessage key={messageIndex} text={message.message} />;
                }
                return '';
              })
            }
            {
              this.props.loading ?
              <LoadingWave /> :
                null
            }
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={(el) => {
                this.messagesEnd = el;
              }}
            >
            </div>
          </ul>
          <ul className="bottom-nav" style={{left: '0px'}}>
              <TestMessageInput
                menu={this.renderMenu()}
                className="conversation-input"
                placeholder={this.state.start && !this.state.stop ? messages.recordingPlaceholder.defaultMessage : messages.conversationPlaceholder.defaultMessage}
                inputId="intentName"
                onKeyDown={this.sendTextMessage}
                onSpeakClick={() => this.setState({ start: (!this.state.start) ? true : this.state.start, stop: this.state.start ? true : this.state.stop })}
              />
          </ul>

          {this.state.start && (
            <VoiceRecognition
              onStart={this.onVoiceRecognitionStart}
              onEnd={this.onVoiceRecognitionEnd}
              onResult={this.sendVoiceMessage}
              continuous
              lang="en-US"
              stop={this.state.stop}
            />
          )}
        </aside>
      </div>
    );
  }
}

ConversationBar.propTypes = {
  loading: React.PropTypes.bool,
  conversation: React.PropTypes.array,
  onSendMessage: React.PropTypes.func,
  onResetSession: React.PropTypes.func,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  currentAgentStatus: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onSendMessage: (agentId, message) => {
      dispatch(converse({ agent: agentId, message }));
    },
    onResetSession: () => {
      dispatch(resetSession());
    },
    onTrainAgent: (agent) => {
      if (agent){
        
        dispatch(trainAgent(agent.id));
      }
    },
    onLoadAgentStatus: (agentId) => {
      if (agentId){
        dispatch(loadCurrentAgentStatus(agentId));
      }
    },
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoadingConversation(),
  conversation: makeSelectConversation(),
  currentAgent: makeSelectCurrentAgent(),
  currentAgentStatus: makeSelectCurrentAgentStatus(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationBar);
