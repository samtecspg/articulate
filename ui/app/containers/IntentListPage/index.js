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
  }

  state = {
    selectedDomain: undefined,
    deleteModalOpen: false,
    intentToDelete: undefined,
  };

  componentWillMount() {
    const { currentAgent } = this.props;
    if (currentAgent) {
      this.props.onComponentWillMount(currentAgent);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.currentAgent !== this.props.currentAgent) {
      this.props.onComponentWillUpdate(nextProps.currentAgent);
    }
  }

  onSelectDomain(evt) {
    if (this.props.agentDomains && (this.props.agentDomains.length > 0)) {
      const domain = this.props.agentDomains.find((agentDomain) => agentDomain.id === evt.target.value);
      this.setState({ selectedDomain: domain });
      this.props.onChangeDomain(domain);
    }

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
    this.props.onDeleteIntent(intentToDelete, selectedDomain);
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
      domainsSelect = agentDomains.map((domain) => ({
        value: domain.id,
        text: domain.domainName,
      }));
      domainsSelect.unshift({ value: 'default', text: 'Please choose a domain', disabled: 'disabled' });
    } else {
      domainsSelect.unshift({ value: 'default', text: 'No domains available for selected agent', disabled: 'disabled' });
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
        <Header breadcrumbs={breadcrumbs} />
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
            <ActionButton label={messages.actionButton} onClick={this.onCreateAction} />
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
  onComponentWillUpdate: React.PropTypes.func,
  onChangeDomain: React.PropTypes.func,
  onChangeUrl: React.PropTypes.func,
  onComponentWillMount: React.PropTypes.func,
  onDeleteIntent: React.PropTypes.func,
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
    onComponentWillMount: (agent) => {
      dispatch(loadAgentDomains(agent.id));
      dispatch(resetDomainIntents());
    },
    onComponentWillUpdate: (agent) => {
      if (agent) {
        dispatch(loadAgentDomains(agent.id));
      } else {
        dispatch(resetAgentDomains());
      }
      dispatch(resetDomainIntents());
    },
    onChangeDomain: (domain) => {
      if (domain) {
        return dispatch(loadDomainIntents(domain.id));
      }
      return dispatch(resetDomainIntents());
    },
    onChangeUrl: (url) => dispatch(push(url)),
    onDeleteIntent: (intent, domain) => dispatch(deleteIntent(intent.id, domain.id)),
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
