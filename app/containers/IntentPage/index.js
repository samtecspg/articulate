import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import TextInput from 'components/TextInput';
import DropdownInput from 'components/DropdownInput';
import SliderInput from 'components/SliderInput';
import Header from 'components/Header';

import Form from './components/Form';
import Section from './components/Section';

import messages from './messages';

import { createIntent, loadAgents, loadDomains } from 'containers/App/actions';
import { makeSelectCurrentAgent, makeSelectAgents, makeSelectCurrentDomain, makeSelectDomains, makeSelectIntent, makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import { changeIntentData } from './actions';
import { makeSelectIntentData } from './selectors';

export class IntentPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.onComponentMounting();
  }

  render() {
    const { loading, error, intent, domains, agents, currentDomain, currentAgent } = this.props;
    const intentProps = {
      loading,
      error,
      intent,
    };

    let agentsSelect = [];
    if(agents !== false){
      agentsSelect = agents.map( (agent) => {
        return {
          value: agent._id,
          text: agent.agentName,
        }
      });
      agentsSelect.unshift({ value: 'default', text: 'Please choose an agent to place your intent', disabled: 'disabled'});
    }

    let domainsSelect = [];
    if(domains !== false){
      domainsSelect = domains.map( (domain) => {
        return {
          value: domain._id,
          text: domain.domainName,
        }
      });
      domainsSelect.unshift({ value: 'default', text: 'Please choose a domain to place your intent', disabled: 'disabled'});
    }

    return (
      <div>
        <Helmet
          title="Create Intent"
          meta={[
            { name: 'description', content: 'Create an intent' },
          ]}
        />
        <Header />
        <h1>
          <FormattedMessage {...messages.createIntentTitle} />
        </h1>
        <p>
          <FormattedMessage {...messages.createIntentDescription} />
        </p>
        <Section>
          <Form id="createIntent" onSubmit={this.props.onSubmitForm}>
            <DropdownInput
              label={messages.agent}
              name="agent"
              options={agentsSelect}
              defaultValue={this.props.intentData.agent ? this.props.intentData.agent : 'default'}
              onChange={this.props.onChangeIntentData.bind(null, 'agent')}
              />
            <DropdownInput
              label={messages.domain}
              name="domain"
              options={domainsSelect}
              defaultValue={this.props.intentData.domain ? this.props.intentData.domain : 'default'}
              onChange={this.props.onChangeIntentData.bind(null, 'domain')}
              />
            <TextInput
              label={messages.intentName}
              placeholder={messages.intentNamePlaceholder.defaultMessage}
              inputId="intentName"
              value={this.props.intentData.intentName}
              onChange={this.props.onChangeIntentData.bind(null, 'intentName')}
              required={true}
              />
          </Form>
          <button type="submit" form="createIntent" value="Submit">Submit</button>
          <p>
            {JSON.stringify(intentProps)}
          </p>
          <button handleRoute={this.props.goHome}>Go Home</button>
        </Section>
      </div>
    );
  }
}

IntentPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  intent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onComponentMounting: React.PropTypes.func,
  onChangeIntentData: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  onMessageAccepted: React.PropTypes.func,
  intentData: React.PropTypes.object,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  agents: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  currentDomain: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  domains: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentMounting: (evt) => {
      dispatch(loadAgents());
      dispatch(loadDomains());
    },
    onChangeIntentData: (field, evt) => dispatch(changeIntentData({ value: evt.target.value, field })),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(createIntent());
    },
    goHome: () => {
      dispatch(push('/'));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  intent: makeSelectIntent(),
  intentData: makeSelectIntentData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agents: makeSelectAgents(),
  currentAgent: makeSelectCurrentAgent(),
  domains: makeSelectDomains(),
  currentDomain: makeSelectCurrentDomain(),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntentPage);
