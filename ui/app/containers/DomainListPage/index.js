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
import DomainsTable from '../../components/DomainsTable/index';
import Form from '../../components/Form';
import Header from '../../components/Header';
import {
  loadAgentDomains,
  loadAgents,
} from '../../containers/App/actions';
import {
  makeSelectAgentDomains,
  makeSelectAgents,
  makeSelectDomain,
  makeSelectError,
  makeSelectLoading,
} from '../../containers/App/selectors';
import { changeDomainData } from './actions';
import messages from './messages';

const renderAgentSelectOptions = (options) => options.map((option, index) => (
  <option key={index} value={option.value}>
    {option.text}
  </option>
));

export class DomainListPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.onSelectAgent = this.onSelectAgent.bind(this);
    this.onCreateAction = this.onCreateAction.bind(this);
  }

  componentWillMount() {
    this.props.onComponentMounting();
  }

  onSelectAgent(evt) {
    const agent = { value: evt.target.value, field: 'agent' };
    this.props.onChangeDomainData(agent);
  }

  onCreateAction() {
    browserHistory.push('/domains/create');
  }

  render() {
    const { loading, error, agents, agentDomains } = this.props;
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
                {renderAgentSelectOptions(agentsSelect)}
              </Input>
            </Row>
            <Row>
              <DomainsTable
                data={agentDomains || []}
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

DomainListPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onComponentMounting: React.PropTypes.func,
  onChangeDomainData: React.PropTypes.func,
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
    onChangeDomainData: (agent) => {
      dispatch(changeDomainData(agent));
      dispatch(loadAgentDomains(agent.value));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  domain: makeSelectDomain(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agents: makeSelectAgents(),
  agentDomains: makeSelectAgentDomains(),
});

export default connect(mapStateToProps, mapDispatchToProps)(DomainListPage);
