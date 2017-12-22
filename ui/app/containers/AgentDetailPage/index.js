import React from 'react';
import Helmet from 'react-helmet';

import { Row,
  Col,
  } from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Content from '../../components/Content';
import Form from '../../components/Form';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import SliderInput from '../../components/SliderInput';
import Preloader from '../../components/Preloader';

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
    if ((currentAgent && this.props.currentAgent) && (currentAgent.id !== this.props.currentAgent.id)) {
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

    let breadcrumbs = [];

    if (!currentAgent) {
      return (<div>&nbsp;</div>);
    }
    else {
      breadcrumbs = [{ link: `/agent/${currentAgent.id}`, label: `Agent: ${currentAgent.agentName}`},];
    }

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          { agentProps.loading ? <Preloader color='#00ca9f' size='big' /> : null }
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
            <header className="main-title"><h1><span>Agent: {currentAgent.agentName}</span></h1><p><span>{currentAgent.description}</span></p></header>
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
              <FormTextInput
                label={messages.sampleData}
                defaultValue={currentAgent.sampleData}
                disabled
              />
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
