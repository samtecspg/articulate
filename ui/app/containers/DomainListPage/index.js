import React from 'react';
import Helmet from 'react-helmet';
import {
  Col,
  Row,
} from 'react-materialize';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import ActionButton from '../../components/ActionButton/index';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import DeleteModal from '../../components/DeleteModal';
import DomainsTable from '../../components/DomainsTable/index';
import Form from '../../components/Form';
import Header from '../../components/Header';
import Preloader from '../../components/Preloader';

import {
  deleteDomain,
  loadAgentDomains,
  resetAgentDomains,
  resetStatusFlags,
} from '../../containers/App/actions';
import {
  makeSelectAgentDomains,
  makeSelectCurrentAgent,
  makeSelectDomain,
  makeSelectError,
  makeSelectLoading,
} from '../../containers/App/selectors';
import messages from './messages';

export class DomainListPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.onCreateAction = this.onCreateAction.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
    this.onDeletePrompt = this.onDeletePrompt.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDeleteDismiss = this.onDeleteDismiss.bind(this);
  }

  state = {
    deleteModalOpen: false,
    domainToDelete: undefined,
    menu: undefined
  };

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

  componentDidUpdate(){

    if (this.props.error) {
      Alert.error(this.props.error.message, {
        position: 'bottom'
      });
    }
  }

  onCreateAction() {
    this.props.onChangeUrl('/domains/create');
  }

  onDeletePrompt(domain) {
    this.setState({
      deleteModalOpen: true,
      domainToDelete: domain,
    });
  }

  onDelete() {
    this.props.onDeleteDomain(this.state.domainToDelete);
    this.onDeleteDismiss();
  }

  onDeleteDismiss() {
    this.setState({
      deleteModalOpen: false,
      domainToDelete: undefined,
    });
  }

  renderMenu() {
    return [{
      label: 'Edit',
      action: (domain) => this.props.onChangeUrl(`/domain/${domain.id}/edit/`),
    }, {
      label: 'Delete',
      action: (domain) => this.onDeletePrompt(domain),
    }];
  }

  render() {
    const { loading, error, agentDomains, currentAgent } = this.props;
    const domainProps = {
      loading,
      error,
      agentDomains,
    };

    let breadcrumbs = [
      { label: 'Agent' },
    ];
    if (currentAgent) {
      breadcrumbs.push({ link: `/agent/${currentAgent.id}`, label: `${currentAgent.agentName}` });
    }
    breadcrumbs.push({ label: 'Domains' });

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {domainProps.loading ? <Preloader color={'#00ca9f'} size={'big'} /> : null}
        </Col>
        <Helmet
          title="Agent Domains"
          meta={[
            { name: 'description', content: 'Create a domain for your agent' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs} actionButtons={
            <ActionButton label={messages.actionButton} onClick={this.onCreateAction} />} />
        <Content>
          <ContentHeader title={messages.domainListTitle} subTitle={messages.domainListDescription} />
          <Form>
            <Row>
              <DomainsTable
                data={agentDomains || { domains: [], total: 0 } }
                menu={this.renderMenu()}
                onReloadData={this.props.onReloadData.bind(null, currentAgent ? currentAgent.id : 0)}
                onCellChange={() => {
                  console.log(`DomainList::${JSON.stringify(arguments)}`); // TODO: REMOVE!!!!
                }}
              />
            </Row>
          </Form>

        </Content>
        <DeleteModal
          isOpen={this.state.deleteModalOpen}
          onDelete={this.onDelete}
          onDismiss={this.onDeleteDismiss}
        />
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
  onDeleteDomain: React.PropTypes.func,
  onPageChange: React.PropTypes.func,
  agentDomains: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentWillUpdate: (agent) => {
      dispatch(resetStatusFlags());
      agent ? dispatch(loadAgentDomains(agent.id, 0)) : dispatch(resetAgentDomains());
    },
    onChangeUrl: (url) => dispatch(push(url)),
    onDeleteDomain: (domain) => dispatch(deleteDomain(domain.id)),
    onReloadData: (agentId, page, filter) => {
      dispatch(loadAgentDomains(agentId, page, filter));
    }
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
