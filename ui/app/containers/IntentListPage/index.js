import React from 'react';
import Helmet from 'react-helmet';
import {
  Input,
  Row,
} from 'react-materialize';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { createStructuredSelector } from 'reselect';
import ActionButton from '../../components/ActionButton/index';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';
import Header from '../../components/Header';
import IntentsTable from '../../components/IntentsTable/index';
import {
  loadAgentDomains,
  loadAgents,
  loadDomainIntents,
} from '../../containers/App/actions';
import {
  makeSelectAgentDomains,
  makeSelectAgents,
  makeSelectDomain,
  makeSelectDomainIntents,
  makeSelectError,
  makeSelectLoading,
} from '../../containers/App/selectors';
import messages from './messages';

export class IntentListPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.onSelectAgent = this.onSelectAgent.bind(this);
    this.onSelectDomain = this.onSelectDomain.bind(this);
    this.renderAgentSelectOptions = this.renderAgentSelectOptions.bind(this);
    this.renderDomainSelectOptions = this.renderDomainSelectOptions.bind(this);
    this.onCreateAction = this.onCreateAction.bind(this);
  }

  componentWillMount() {
    this.props.onComponentMounting();
  }

  onSelectAgent(evt) {
    const agent = { value: evt.target.value, field: 'agent' };
    this.props.onChangeAgent(agent);
  }

  onSelectDomain(evt) {
    const domain = { value: evt.target.value, field: 'domain' };
    this.props.onChangeDomain(domain);
  }

  onCreateAction() {
    browserHistory.push('/intents/create');
  }

  renderAgentSelectOptions(options) {
    return options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.text}
      </option>
    ));
  }

  renderDomainSelectOptions(options) {
    return options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.text}
      </option>
    ));
  }

  render() {
    const { loading, error, agents, agentDomains, domainIntents } = this.props;
    const domainProps = {
      loading,
      error,
      agents,
      agentDomains,
    };
    let agentsSelect = [];
    if (agents !== false) {
      agentsSelect = agents.map((agent) => ({
        value: agent.id,
        text: agent.agentName,
      }));
      agentsSelect.unshift({ value: 'default', text: 'Please choose an agent', disabled: 'disabled' });
    }

    let domainsSelect = [];
    if (agentDomains !== false) {
      domainsSelect = agentDomains.map((domain) => ({
        value: domain.id,
        text: domain.domainName,
      }));
      domainsSelect.unshift({ value: 'default', text: 'Please choose a domain', disabled: 'disabled' });
    }

    return (
      <div>
        <Helmet
          title="Agent Domains"
          meta={[
            { name: 'description', content: 'Create a domain for your agent' },
          ]}
        />
        <Header />
        <Content>
          <ContentHeader title={messages.domainListTitle} subTitle={messages.domainListDescription} />
          <Form>
            <Row>
              <Input
                s={12}
                name="agent"
                type="select"
                label={messages.agent.defaultMessage}
                onChange={this.onSelectAgent}
              >
                {this.renderAgentSelectOptions(agentsSelect)}
              </Input>
            </Row>
            <Row>
              <Input
                s={12}
                name="domain"
                type="select"
                label={messages.domain.defaultMessage}
                onChange={this.onSelectDomain}
              >
                {this.renderDomainSelectOptions(domainsSelect)}
              </Input>
            </Row>
            <Row>
              <IntentsTable
                data={domainIntents || []}
                onCellChange={() => {
                }}
              />
            </Row>
            <ActionButton label={messages.actionButton} onClick={this.onCreateAction} />
            <Row>
              <p>
                {JSON.stringify(domainProps)}
              </p>
            </Row>
          </Form>


        </Content>
      </div>
    );
  }
}

IntentListPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onComponentMounting: React.PropTypes.func,
  onChangeAgent: React.PropTypes.func,
  onChangeDomain: React.PropTypes.func,
  agents: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  agentDomains: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentMounting: () => {
      dispatch(loadAgents());
    },
    onChangeAgent: (agent) => {
      dispatch(loadAgentDomains(agent.value));
    },
    onChangeDomain: (domain) => {
      dispatch(loadDomainIntents(domain.value));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  domain: makeSelectDomain(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agents: makeSelectAgents(),
  agentDomains: makeSelectAgentDomains(),
  domainIntents: makeSelectDomainIntents(),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntentListPage);
