import ActionButton from 'components/ActionButton';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import Form from 'components/Form';

import FormTextInput from 'components/FormTextInput';
import Header from 'components/Header';
import SliderInput from 'components/SliderInput';

import {
  createDomain,
  loadAgents,
} from 'containers/App/actions';
import {
  makeSelectAgents,
  makeSelectCurrentAgent,
  makeSelectDomain,
  makeSelectError,
  makeSelectLoading,
} from 'containers/App/selectors';
import React from 'react';
import Helmet from 'react-helmet';

import {
  Input,
  Row,
} from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { changeDomainData } from './actions';

import messages from './messages';
import { makeSelectDomainData } from './selectors';

const returnFormattedOptions = (options) => options.map((option, index) => (
  <option key={index} value={option.value}>
    {option.text}
  </option>
    ));

export class DomainPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.onComponentMounting();
  }

  render() {
    const { loading, error, domain, agents, currentAgent } = this.props;
    const domainProps = {
      loading,
      error,
      domain,
    };
    let agentsSelect = [];
    if (agents !== false) {
      agentsSelect = agents.map((agent) => ({
        value: agent.agentName,
        text: agent.agentName,
      }));
      agentsSelect.unshift({ value: 'default', text: 'Please choose an agent to place your domain', disabled: 'disabled' });
    }

    return (
      <div>
        <Helmet
          title="Create Domain"
          meta={[
            { name: 'description', content: 'Create a domain for your agent' },
          ]}
        />
        <Header />
        <Content>
          <ContentHeader title={messages.createDomainTitle} subTitle={messages.createDomainDescription} />
          <Form>
            <Row>
              <Input
                s={12}
                name="agent"
                type="select"
                label={messages.agent.defaultMessage}
                defaultValue={this.props.domainData.agent ? this.props.domainData.agent : 'default'}
                onChange={this.props.onChangeDomainData.bind(null, 'agent')}
              >
                {returnFormattedOptions(agentsSelect)}
              </Input>
              <FormTextInput
                label={messages.domainName}
                placeholder={messages.domainNamePlaceholder.defaultMessage}
                inputId="domainName"
                value={this.props.domainData.domainName}
                onChange={this.props.onChangeDomainData.bind(null, 'domainName')}
                required
              />
            </Row>
          </Form>

          <Row>
            <SliderInput
              label={messages.intentThreshold}
              inputId="intentThreshold"
              min="0"
              max="100"
              defaultValue={this.props.domainData.intentThreshold}
              onChange={this.props.onChangeDomainData.bind(null, 'intentThreshold')}
            />
          </Row>

          <ActionButton label={messages.actionButton} onClick={this.props.onSubmitForm} />

          <Row>
            <p>
              {JSON.stringify(domainProps)}
            </p>
          </Row>
        </Content>
      </div>
    );
  }
}

DomainPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  domain: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onComponentMounting: React.PropTypes.func,
  onChangeDomainData: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  onMessageAccepted: React.PropTypes.func,
  domainData: React.PropTypes.object,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  agents: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentMounting: (evt) => {
      dispatch(loadAgents());
    },
    onChangeDomainData: (field, evt) => dispatch(changeDomainData({ value: evt.target.value, field })),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(createDomain());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  domain: makeSelectDomain(),
  domainData: makeSelectDomainData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agents: makeSelectAgents(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(DomainPage);
