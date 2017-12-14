import React from 'react';
import Helmet from 'react-helmet';
import { Row, } from 'react-materialize';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import ActionButton from '../../components/ActionButton/index';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import DomainsTable from '../../components/DomainsTable/index';
import Form from '../../components/Form';
import Header from '../../components/Header';
import {
  loadAgentDomains,
  resetAgentDomains,
} from '../../containers/App/actions';
import {
  makeSelectAgentDomains,
  makeSelectCurrentAgent,
  makeSelectDomain,
  makeSelectError,
  makeSelectLoading
} from '../../containers/App/selectors';
import messages from './messages';

export class DomainListPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.onCreateAction = this.onCreateAction.bind(this);
  }

  componentWillMount() {
    const { currentAgent } = this.props;
    if (currentAgent) {
      this.props.onComponentWillUpdate(currentAgent);
    }
  }

  componentWillUpdate(nextProps) {
    const { currentAgent } = nextProps;
    if (currentAgent !== this.props.currentAgent) {
      this.props.onComponentWillUpdate(currentAgent);
    }
  }

  onCreateAction() {
    this.props.onChangeUrl('/domains/create');
  }

  render() {
    const { loading, error, agentDomains, currentAgent } = this.props;
    const domainProps = {
      loading,
      error,
      agentDomains,
    };

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
          {JSON.stringify(currentAgent)}

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
  onComponentWillUpdate: React.PropTypes.func,
  onChangeUrl: React.PropTypes.func,
  agentDomains: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentWillUpdate: (agent) => agent ? dispatch(loadAgentDomains(agent.id)) : dispatch(resetAgentDomains()),
    onChangeUrl: (url) => dispatch(push(url)),
  };
}

const mapStateToProps = createStructuredSelector({
  domain: makeSelectDomain(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agentDomains: makeSelectAgentDomains(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(DomainListPage);
