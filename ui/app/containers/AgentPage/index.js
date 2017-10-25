import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectAgent, makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import FormTextInput from 'components/FormTextInput';
import SliderInput from 'components/SliderInput';
import Header from 'components/Header';
import ContentHeader from 'components/ContentHeader';
import Content from 'components/Content';
import Form from 'components/Form';
import ActionButton from 'components/ActionButton';

import { Input, Row } from 'react-materialize';

import messages from './messages';

import { createAgent } from '../App/actions';
import { changeAgentData } from './actions';
import { makeSelectAgentData } from './selectors';

/*import timezones from './data/timezones.json';
import languages from './data/languages.json';
import sampleData from './data/sampleData.json';*/

const timezones = [
  {
      "text": "America/Kentucky/Louisville",
      "value": "America/Kentucky/Louisville"
  },
]

const languages = [
	{
		"value": "english",
		"text": "English"
	},
	{
		"value": "german",
		"text": "German"
	},
	{
		"value": "french",
		"text": "French"
	},
	{
		"value": "spanish",
		"text": "Spanish"
	},
	{
		"value": "chinese",
		"text": "Chinese (Mandarin)"
	}
]

const sampleData = [
	{
		"value": "smallTalk",
		"text": "Small Talk Agent"
	},
	{
		"value": "customerService",
		"text": "Customer Service Agent"
	},
	{
		"value": "bookings",
		"text": "Bookings Agent"
	}
]

const returnFormattedOptions = (options) => {
  return options.map( (option, index) => {
    return (
        <option key={index} value={option.value}>
          {option.text}
        </option>
      )
  });
};

export class AgentPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount(){
    sampleData.unshift({ value: 'none', text: messages.sampleDataPlaceholder.defaultMessage, disabled: 'disabled'});
  }

  render() {
    const { loading, error, agent, } = this.props;
    const agentProps = {
      loading,
      error,
      agent,
    };

    return (
      <div>
        <Helmet
          title="Create Agent"
          meta={[
            { name: 'description', content: 'Create your NLU agent' },
          ]}
        />
        <Header />
        <Content>
          <ContentHeader title={messages.createAgentTitle} subTitle={messages.createAgentDescription} />
          <Form>
            <Row>
              <FormTextInput
                label={messages.agentName}
                placeholder={messages.agentNamePlaceholder.defaultMessage}
                inputId="agentName"
                value={this.props.agentData.agentName}
                onChange={this.props.onChangeAgentData.bind(null, 'agentName')}
                required={true}
                />
              <FormTextInput
                label={messages.agentDescription}
                placeholder={messages.agentDescriptionPlaceholder.defaultMessage}
                inputId="agentDescription"
                value={this.props.agentData.agentDescription}
                onChange={this.props.onChangeAgentData.bind(null, 'agentDescription')}
                />
              <Input s={12} 
                name='sampleData'
                type='select' 
                label={messages.sampleData.defaultMessage} 
                defaultValue={this.props.agentData.sampleData ? this.props.agentData.sampleData : 'none'}
                onChange={this.props.onChangeAgentData.bind(null, 'sampleData')}>
                    {returnFormattedOptions(sampleData)}
              </Input>
              <Input s={6} 
                name='language'
                type='select' 
                label={messages.language.defaultMessage} 
                defaultValue={this.props.agentData.language ? this.props.agentData.language : 'english'}
                onChange={this.props.onChangeAgentData.bind(null, 'language')}>
                    {returnFormattedOptions(languages)}
              </Input>
              <Input s={6} 
                name='defaultTimezone'
                type='select' 
                label={messages.defaultTimezone.defaultMessage} 
                defaultValue={this.props.agentData.defaultTimezone ? this.props.agentData.defaultTimezone : 'america_kentucky_louisville'}
                onChange={this.props.onChangeAgentData.bind(null, 'defaultTimezone')}>
                    {returnFormattedOptions(timezones)}
              </Input>
            </Row>
          </Form>

          <Row>
            <SliderInput
              label={messages.domainClassifierThreshold}
              id="domainClassifierThreshold"
              min="0"
              max="100"
              value={this.props.agentData.domainClassifierThreshold.toString()}
              onChange={this.props.onChangeAgentData.bind(null, 'domainClassifierThreshold')}
              />
          </Row>

          <ActionButton label={messages.actionButton} onClick={this.props.onSubmitForm} />
          
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

AgentPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  agent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onSubmitForm: React.PropTypes.func,
  agentData: React.PropTypes.object,
  onChangeAgentData: React.PropTypes.func,
  onMessageAccepted: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeAgentData: (field, evt) => dispatch(changeAgentData({ value: evt.target.value, field })),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(createAgent());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  agentData: makeSelectAgentData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AgentPage);
