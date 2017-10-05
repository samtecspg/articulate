import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import UserMessage from 'components/UserMessage';
import AgentMessage from 'components/AgentMessage';
import TestMessageInput from 'components/TestMessageInput';

import { Row, Icon, Col, CardPanel } from 'react-materialize';

import messages from './messages';

import { makeSelectConversation, makeSelectLoadingConversation } from 'containers/App/selectors';
import { converse } from '../App/actions';

class ConversationBar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView(true)
  }

  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }
  
  render() {

    return (
        <aside className="right-panel">
          <ul className="conversation-panel" style={{overflowY: 'auto'}}>
            {
              this.props.conversation.map( (message, messageIndex) => {
                if (message.author === 'agent'){
                  return <AgentMessage key={messageIndex} text={message.message}/>
                }
                if (message.author === 'user'){
                  return <UserMessage key={messageIndex} text={message.message}/>
                }
              })
            }
            {
              this.props.loading ?
              <AgentMessage text={'...'}/> :
              null
            }
            <div style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
            </div>
          </ul>
          <ul className="bottom-nav">
            <div id="form-section">
              <TestMessageInput
                className="conversationInput"
                placeholder={messages.conversationPlaceholder.defaultMessage}
                inputId="intentName"
                onKeyPress={this.props.onSendMessage}
                onSpeakClick={this.props.onSendMessage}
              />
            </div>
          </ul>
        </aside>
    );
  }
}

ConversationBar.propTypes = {
  loading: React.PropTypes.bool,
  conversation: React.PropTypes.array,
  onSendMessage: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSendMessage: (evt) => {
      if (evt.charCode === 13){
        dispatch(converse({ agent: 'e3812ed6-b070-a4a7-9391-43151039d839', message: evt.target.value }));
        evt.target.value = null;
      }
    },
  };
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoadingConversation(),
  conversation: makeSelectConversation(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationBar);