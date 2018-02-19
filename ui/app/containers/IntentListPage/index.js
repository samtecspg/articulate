import React from 'react';
import Helmet from 'react-helmet';
import {
  Col,
  Input,
  Row,
} from 'react-materialize';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import ActionButton from '../../components/ActionButton/index';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import DeleteModal from '../../components/DeleteModal';
import Form from '../../components/Form';
import Header from '../../components/Header';
import IntentsTable from '../../components/IntentsTable/index';
import Preloader from '../../components/Preloader';
import {
  deleteIntent,
  loadAgentDomains,
  loadAgentIntents,
  loadDomainIntents,
  resetAgentDomains,
  resetDomainIntents,
} from '../../containers/App/actions';
import {
  makeSelectAgentDomains,
  makeSelectCurrentAgent,
  makeSelectDomain,
  makeSelectDomainIntents,
  makeSelectError,
  makeSelectLoading,
} from '../../containers/App/selectors';
import messages from './messages';

export class IntentListPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onSelectDomain = this.onSelectDomain.bind(this);
    this.renderDomainSelectOptions = this.renderDomainSelectOptions.bind(this);
    this.onCreateAction = this.onCreateAction.bind(this);
    this.onDeletePrompt = this.onDeletePrompt.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDeleteDismiss = this.onDeleteDismiss.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
    this.loadDomains = this.loadDomains.bind(this);
  }

  state = {
    selectedDomain: undefined,
    deleteModalOpen: false,
    intentToDelete: undefined,
    allIntentsLoaded: false,
  };

  componentWillMount() {
    this.props.onReset();
  }

  componentDidMount() {
    this.loadDomains(this.props.currentAgent);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!this.props.currentAgent && !nextProps.currentAgent) return;

    if (_.isEqual(this.props.currentAgent, nextProps.currentAgent)) {
      if (!nextProps.agentDomains) return;
      if (nextProps.agentDomains.length === 0) return;
      const oDomainId = _.isEmpty(this.state.selectedDomain) ? undefined : this.state.selectedDomain.id;
      const nDomainId = _.isEmpty(nextProps.location.query) ? undefined : nextProps.location.query.domainId;
      if (nDomainId === undefined) {
        if (this.state.allIntentsLoaded) return;
        this.loadIntents(nextProps.currentAgent, nextProps.agentDomains);
        return;
      }
      if (_.isEqual(oDomainId, nDomainId)) return;
      this.loadIntents(nextProps.currentAgent, nextProps.agentDomains, nDomainId);
    } else {
      this.loadDomains(nextProps.currentAgent);
    }
  }

  onSelectDomain(evt) {
    const url = `/intents${evt.target.value !== 'default' ? `?domainId=${evt.target.value}` : ''}`;
    this.props.onChangeUrl(url);
  }

  loadDomains(agent) {
    if (!agent) return;
    this.props.onLoadDomains(agent);
  }

  loadIntents(agent, agentDomains, domainId) {
    if (!agent) return;
    if (!agentDomains || (agentDomains.length === 0)) return;
    const domain = agentDomains.find((agentDomain) => agentDomain.id === domainId);
    this.setState({
      selectedDomain: domain,
      allIntentsLoaded: !domain
    });
    this.props.onLoadIntents(domain, agent);
  }

  onCreateAction() {
    this.props.onChangeUrl('/intents/create');
  }

  onDeletePrompt(intent) {
    this.setState({
      deleteModalOpen: true,
      intentToDelete: intent,
    });
  }

  onDelete() {
    const { intentToDelete, selectedDomain } = this.state;
    this.props.onDeleteIntent(intentToDelete, selectedDomain ? selectedDomain : this.props.currentAgent, selectedDomain ? 'domain' : 'agent');
    this.onDeleteDismiss();
  }

  onDeleteDismiss() {
    this.setState({
      deleteModalOpen: false
    });
  }

  renderDomainSelectOptions(options) {
    return options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.text}
      </option>
    ));
  }

  renderMenu() {
    return [{
      label: 'Delete',
      action: (intent) => this.onDeletePrompt(intent),
    }, {
      label: 'Edit',
      action: (intent) => this.props.onChangeUrl(`/intent/${intent.id}/edit/`),
    }];
  }

  render() {
    const { loading, error, agentDomains, domainIntents, currentAgent } = this.props;
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
    breadcrumbs.push({ label: 'Intents' });

    let domainsSelect = [];
    if (agentDomains !== false) {
      const defaultOption = { value: 'default', text: 'Please choose a domain', disabled: 'disabled' };

      const options = agentDomains.map((domain) => ({
        value: domain.id,
        text: domain.domainName,
      }));
      domainsSelect = [defaultOption, ...options];
    } else {
      const defaultOption = { value: 'default', text: 'No domains available for selected agent', disabled: 'disabled' };
      domainsSelect = [defaultOption];
    }

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {domainProps.loading ? <Preloader color={'#00ca9f'} size={'big'} /> : null}
        </Col>
        <Helmet
          title="Agent Intents"
          meta={[
            { name: 'description', content: 'Review the list of intents' },
          ]}
        />
        <Header
          breadcrumbs={breadcrumbs} actionButtons={
          <ActionButton label={messages.actionButton} onClick={this.onCreateAction} />}
        />
        <Content>
          <ContentHeader title={messages.domainListTitle} subTitle={messages.domainListDescription} />
          <Form>
            <Row>
              <Input
                s={12}
                name="domain"
                type="select"
                label={messages.domain.defaultMessage}
                onChange={this.onSelectDomain}
                value={this.state.selectedDomain ? this.state.selectedDomain.id : 'default'}
              >
                {this.renderDomainSelectOptions(domainsSelect)}
              </Input>
            </Row>
            <Row>
              <IntentsTable
                data={domainIntents || []}
                menu={this.renderMenu()}
                onCellChange={() => {
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

IntentListPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onLoadIntents: React.PropTypes.func,
  onChangeUrl: React.PropTypes.func,
  onDeleteIntent: React.PropTypes.func,
  onLoadDomains: React.PropTypes.func,
  onReset: React.PropTypes.func,
  domainIntents: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
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
    onReset() {
      dispatch(resetAgentDomains());
      dispatch(resetDomainIntents());
    },
    onLoadDomains(agent) {
      dispatch(loadAgentDomains(agent.id));
    },

    onLoadIntents: (domain, agent) => {
      if (domain) {
        return dispatch(loadDomainIntents(domain.id));
      }
      dispatch(loadAgentIntents(agent.id));
    },
    onChangeUrl: (url) => dispatch(push(url)),
    onDeleteIntent: (intent, parent, filter) => {
      dispatch(deleteIntent(intent.id, parent.id, filter));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  domain: makeSelectDomain(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agentDomains: makeSelectAgentDomains(),
  domainIntents: makeSelectDomainIntents(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntentListPage);
