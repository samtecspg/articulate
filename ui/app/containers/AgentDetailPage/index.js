import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Row,
} from 'react-materialize';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import Content from '../../components/Content';
import DeleteModal from '../../components/DeleteModal';
import Form from '../../components/Form';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import Preloader from '../../components/Preloader';
import SliderInput from '../../components/SliderInput';

import {
  deleteAgent,
  loadCurrentAgent
} from '../App/actions';
import {
  makeSelectCurrentAgent,
  makeSelectError,
  makeSelectLoading,
} from '../App/selectors';

import messages from './messages';

export class AgentDetailPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.onDeletePrompt = this.onDeletePrompt.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDeleteDismiss = this.onDeleteDismiss.bind(this);
  }

  state = {
    deleteModalOpen: false,
  };

  componentWillMount() {
    const { currentAgent } = this.props;
    if (!currentAgent) {
      this.props.onComponentWillMount(this.props.params.id);
    }
  }

  componentWillUpdate(nextProps) {
    const { currentAgent } = nextProps;
    if ((currentAgent && this.props.currentAgent) && (currentAgent.id !== this.props.currentAgent.id)) {
      this.props.onComponentWillMount(currentAgent.id);
    }
  }

  onDeletePrompt() {
    this.setState({
      deleteModalOpen: true,
    });
  }

  onDelete() {
    const { currentAgent } = this.props;
    this.props.onDeleteAgent(currentAgent);
    this.onDeleteDismiss();
  }

  onDeleteDismiss() {
    this.setState({
      deleteModalOpen: false,
    });
  }

  render() {
    const { loading, error, currentAgent } = this.props;
    const agentProps = {
      loading,
      error,
      currentAgent,
    };

    let breadcrumbs = [];

    if (!currentAgent) {
      return (<div>&nbsp;</div>);
    }
    else {
      breadcrumbs = [
        {  label: 'Agent' },
        {  label: `${currentAgent.agentName}` },
      ];
    }

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {agentProps.loading ? <Preloader color='#00ca9f' size='big' /> : null}
        </Col>
        <Helmet
          title={`Agent: ${currentAgent.agentName}`}
          meta={[
            { name: 'description', content: `Details for NLU Agent ${currentAgent.agentName}` },
          ]}
        />
        <Header breadcrumbs={breadcrumbs} />
        <Content>
          <Row>
            <header className="main-title">
              <h1>
                <span>{messages.detailTitle.defaultMessage}{currentAgent.agentName}</span>
              </h1>
              <p>
                <span>{currentAgent.description}</span>
              </p>
            </header>
          </Row>
          <Row>
            <Form>
              <FormTextInput
                label={messages.agentName}
                defaultValue={currentAgent.agentName}
                disabled
              />
              <FormTextInput
                label={messages.description}
                placeholder={messages.descriptionPlaceholder.defaultMessage}
                defaultValue={currentAgent.description}
                disabled
              />
              {/*<FormTextInput
                label={messages.sampleData}
                defaultValue={currentAgent.sampleData}
                disabled
              />*/}
              <FormTextInput
                label={messages.language}
                defaultValue={currentAgent.language}
                disabled
              />
              <FormTextInput
                label={messages.timezone}
                defaultValue={currentAgent.timezone}
                disabled
              />
              <FormTextInput
                label={messages.webhookUrl}
                defaultValue={currentAgent.webhookUrl}
                disabled
              />
            </Form>
          </Row>

          <Row>
            <SliderInput
              label={messages.domainClassifierThreshold}
              min="0"
              max="100"
              value={(currentAgent.domainClassifierThreshold * 100).toString()}
              onChange={() => {
              }}
              disabled
            />
          </Row>

          <Row className={'right'}>
            <Col>
              <Button
                floating
                large
                waves={'light'}
                onClick={() => {
                  this.props.onChangeUrl(`/agent/${this.props.currentAgent.id}/edit`);
                }}
                className={'lighten-1 white-text text-darken-4'}
              ><FormattedMessage {...messages.editButton} /></Button>
            </Col>
            <Col>
              <Button
                floating
                large
                waves={'light'}
                onClick={this.onDeletePrompt}
                className={'red lighten-1 white-text text-darken-4'}
              ><FormattedMessage {...messages.deleteButton} /></Button>
            </Col>
          </Row>
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

AgentDetailPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onComponentWillMount: React.PropTypes.func,
  onDeleteAgent: React.PropTypes.func,
  onChangeUrl: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentWillMount: (id) => dispatch(loadCurrentAgent(id)),
    onDeleteAgent: (agent) => dispatch(deleteAgent(agent.id)),
    onChangeUrl: (url) => dispatch(push(url)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AgentDetailPage);
