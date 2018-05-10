import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import AgentMessage from '../../components/AgentMessage';
import LoadingWave from '../../components/LoadingWave';
import TestMessageInput from '../../components/TestMessageInput';
import UserMessage from '../../components/UserMessage';
import VoiceRecognition from '../../components/VoiceRecognition';
import { converse, resetSession } from '../App/actions';
import {
  makeSelectConversation,
  makeSelectCurrentAgent,
  makeSelectLoadingConversation,
} from '../App/selectors';

import messages from './messages';

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
  };

  componentDidMount() {
    this.scrollToBottom();
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
    if (evt.charCode === 13) {
      const message = evt.target.value;
      evt.target.value = null;
      const agentId = this.props.currentAgent ? this.props.currentAgent.id : null;
      this.props.onSendMessage(agentId, message);
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
        <ul className="bottom-nav">
            <TestMessageInput
              menu={this.renderMenu()}
              className="conversation-input"
              placeholder={this.state.start && !this.state.stop ? messages.recordingPlaceholder.defaultMessage : messages.conversationPlaceholder.defaultMessage}
              inputId="intentName"
              onKeyPress={this.sendTextMessage}
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
};

export function mapDispatchToProps(dispatch) {
  return {
    onSendMessage: (agentId, message) => {
      dispatch(converse({ agent: agentId, message }));
    },
    onResetSession: () => {
      dispatch(resetSession());
    }
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoadingConversation(),
  conversation: makeSelectConversation(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationBar);
