import React from 'react';
import Helmet from 'react-helmet';

import { Row } from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Content from '../../components/Content';
import Form from '../../components/Form';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import SliderInput from '../../components/SliderInput';
import { loadCurrentAgent } from '../App/actions';
import {
  makeSelectCurrentAgent,
  makeSelectError,
  makeSelectLoading,
} from '../App/selectors';

import messages from './messages';

export class AgentDetailPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const { currentAgent } = this.props;
    if (!currentAgent) {
      this.props.onComponentWillMount(this.props.params.id);
    }
  }

  componentWillUpdate(nextProps) {
    const { currentAgent } = nextProps;
    if ((currentAgent && this.props.currentAgent)  && (currentAgent.id !== this.props.currentAgent.id)) {
      this.props.onComponentWillMount(currentAgent.id);
    }
  }

  render() {
    const { loading, error, currentAgent } = this.props;
    const agentProps = {
      loading,
      error,
      currentAgent,
    };
    if (!currentAgent) {
      return (<div>&nbsp;</div>);
    }
    return (
      <div>
        <Helmet
          title={`Agent: ${currentAgent.agentName}`}
          meta={[
            { name: 'description', content: `Details for NLU Agent ${currentAgent.agentName}` },
          ]}
        />
        <Header />
        <Content>
          <Row>
            <header className="main-title"><h1><span>Agent: {currentAgent.agentName}</span></h1><p><span>{currentAgent.description}</span></p></header>
          </Row>
          <Row>
            <Form>
              <FormTextInput
                label={messages.agentName}
                value={currentAgent.agentName}
                onChange={() => {
                }}
                disabled
              />
              <FormTextInput
                label={messages.description}
                placeholder={messages.descriptionPlaceholder.defaultMessage}
                value={currentAgent.description}
                onChange={() => {
                }}
                disabled
              />
              <FormTextInput
                label={messages.sampleData}
                value={currentAgent.sampleData}
                onChange={() => {
                }}
                disabled
              />
              <FormTextInput
                label={messages.language}
                value={currentAgent.language}
                onChange={() => {
                }}
                disabled
              />
              <FormTextInput
                label={messages.timezone}
                value={currentAgent.timezone}
                onChange={() => {
                }}
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

          <Row>
            <p>
              {JSON.stringify(agentProps)}
            </p>
          </Row>
        </Content>
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
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentWillMount: (id) => dispatch(loadCurrentAgent(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  currentAgent: makeSelectCurrentAgent(),

});

export default connect(mapStateToProps, mapDispatchToProps)(AgentDetailPage);
