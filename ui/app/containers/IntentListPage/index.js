import React from 'react';
import Helmet from 'react-helmet';
import {
  Col,
  Input,
  Row,
} from 'react-materialize';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
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
    intentsLoaded: false,
    domainsLoaded: false,
  };

  componentWillMount() {
    this.props.onReset();
  }

  componentDidMount() {
    this.loadDomains(this.props.currentAgent);
  }

  componentDidUpdate(){

    if (this.props.error) {
      Alert.error(this.props.error.message, {
        position: 'bottom'
      });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!nextProps.currentAgent) return; // No agent selected
    if (!nextProps.agentDomains) { // Agent but no domains
      return this.loadDomains(nextProps.currentAgent); //Load Domains
    }
    if (this.state.intentsLoaded) return; // Intents already loaded
    const nDomainId = _.isEmpty(nextProps.location.query) ? undefined : nextProps.location.query.domainId;
    if (nextProps.agentDomains) {
      if (nDomainId) {
        return this.loadIntents(nextProps.currentAgent, nextProps.agentDomains.domains, nDomainId); //Load Domain Intents
      } else {
        return this.loadIntents(nextProps.currentAgent, nextProps.agentDomains.domains); //Load All Intents
      }
    }
  }

  onSelectDomain(evt) {
    const url = `/intents${evt.target.value !== 'default' ? `?domainId=${evt.target.value}` : ''}`;
    this.setState({
      intentsLoaded: false,
    });
    this.props.onChangeUrl(url);
  }

  loadDomains(agent) {
    if (!agent) return;
    if (this.state.domainsLoaded) return;
    this.setState({
      domainsLoaded: true,
    });
    this.props.onLoadDomains(agent);
  }

  loadIntents(agent, agentDomains, domainId) {
    if (!agent) return;
    if (!agentDomains || (agentDomains.length === 0)) return;
    const domain = agentDomains.find((agentDomain) => agentDomain.id.toString() === domainId);
    this.setState({
      intentsLoaded: true,
      selectedDomain: domain,
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
      label: 'Edit',
      action: (intent) => this.props.onChangeUrl(`/intent/${intent.id}/edit/`),
    }, {
      label: 'Delete',
      action: (intent) => this.onDeletePrompt(intent),
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

      const options = agentDomains.domains.map((domain) => ({
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
                value={this.state.selectedDomain ? this.state.selectedDomain.id.toString() : 'default'}
              >
                {this.renderDomainSelectOptions(domainsSelect)}
              </Input>
            </Row>
            <Row>
              <IntentsTable
                data={domainIntents || { intents: [], total: 0 }}
                menu={this.renderMenu()}
                onReloadData={this.props.onReloadData.bind(null, this.state.selectedDomain ? this.state.selectedDomain.id : null , currentAgent ? currentAgent.id : 0)}
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
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
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
    onReset() {
      dispatch(resetAgentDomains());
      dispatch(resetDomainIntents());
    },
    onLoadDomains(agent) {
      dispatch(loadAgentDomains(agent.id));
    },
    onLoadIntents: (domain, agent) => {
      if (domain) {
        return dispatch(loadDomainIntents(domain.id,0));
      }
      dispatch(loadAgentIntents(agent.id,0));
    },
    onChangeUrl: (url) => dispatch(push(url)),
    onDeleteIntent: (intent, parent, filter) => {
      dispatch(deleteIntent(intent.id, parent.id, filter));
    },
    onReloadData: (domainId, agentId, page, filter) => {
      if (domainId) {
        return dispatch(loadDomainIntents(domainId, page, filter));
      }
      dispatch(loadAgentIntents(agentId, page, filter));
    }
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
