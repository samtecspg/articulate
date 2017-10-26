import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import FormTextInput from 'components/FormTextInput';
import Header from 'components/Header';
import ContentHeader from 'components/ContentHeader';
import Content from 'components/Content';
import Form from 'components/Form';
import ActionButton from 'components/ActionButton';

import { Input, Row } from 'react-materialize';

import messages from './messages';

import { createWebhook, loadAgents } from 'containers/App/actions';
import { makeSelectCurrentAgent, makeSelectAgents, makeSelectWebhook, makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import { changeWebhookData } from './actions';
import { makeSelectWebhookData } from './selectors';

const returnFormattedOptions = (options) => {
  return options.map( (option, index) => {
    return (
        <option key={index} value={option.value}>
          {option.text}
        </option>
      )
  });
};

export class WebhookPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.onComponentMounting();
  }

  render() {
    const { loading, error, webhook, agents, currentAgent } = this.props;
    const webhookProps = {
      loading,
      error,
      webhook,
    };
    let agentsSelect = [];
    if(agents !== false){
      agentsSelect = agents.map( (agent) => {
        return {
          value: agent._id,
          text: agent.agentName,
        }
      });
      agentsSelect.unshift({ value: 'default', text: 'Please choose an agent to place your webhook', disabled: 'disabled'});
    }

    return (
      <div>
        <Helmet
          title="Create Webhook"
          meta={[
            { name: 'description', content: 'Add a webhook to your agent' },
          ]}
        />
        <Header/>
        <Content>
          <ContentHeader title={messages.createWebhookTitle} subTitle={messages.createWebhookDescription} />
          <Form>
            <Row>
              <Input s={12} 
                name='agent'
                type='select' 
                label={messages.agent.defaultMessage} 
                defaultValue={this.props.webhookData.agent ? this.props.webhookData.agent : 'default'}
                onChange={this.props.onChangeWebhookData.bind(null, 'agent')}>
                    {returnFormattedOptions(agentsSelect)}
              </Input>
              <FormTextInput
                label={messages.url}
                placeholder={messages.urlPlaceholder.defaultMessage}
                inputId="webhookUrl"
                value={this.props.webhookData.webhookUrl}
                onChange={this.props.onChangeWebhookData.bind(null, 'webhookUrl')}
                required={true}
                tooltip={messages.urlTooltip.defaultMessage}
                />
              {/*
              <div className="input-field col s6">
                <FormTextInput
                  label={messages.simpleAuthentication}
                  placeholder={messages.usernamePlaceholder.defaultMessage}
                  inputId="username"
                  value={this.props.webhookData.webhookUsername}
                  onChange={this.props.onChangeWebhookData.bind(null, 'username')}
                  required={true}
                  />
              </div>
              <div className="input-field col s6">
                <FormTextInput
                  placeholder={messages.passwordPlaceholder.defaultMessage}
                  inputId="password"
                  value={this.props.webhookData.password}
                  onChange={this.props.onChangeWebhookData.bind(null, 'password')}
                  required={true}
                  />
              </div>*/}
            </Row>
          </Form>

          <ActionButton label={messages.saveButton} onClick={this.props.onSubmitForm} />

          <Row>
            <p>
              {JSON.stringify(webhookProps)}
            </p>
          </Row>
        </Content>
      </div>
    );
  }
}

WebhookPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  webhook: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onComponentMounting: React.PropTypes.func,
  onChangeWebhookData: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  webhookData: React.PropTypes.object,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  agents: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentMounting: (evt) => {
      dispatch(loadAgents())
    },
    onChangeWebhookData: (field, evt) => dispatch(changeWebhookData({ value: evt.target.value, field })),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(createWebhook());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  webhook: makeSelectWebhook(),
  webhookData: makeSelectWebhookData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agents: makeSelectAgents(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(WebhookPage);
