import ActionButton from 'components/ActionButton';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import Form from 'components/Form';

import FormTextInput from 'components/FormTextInput';
import Header from 'components/Header';
import SliderInput from 'components/SliderInput';
import Preloader from '../../components/Preloader';

import {
  makeSelectAgent,
  makeSelectError,
  makeSelectLoading,
} from 'containers/App/selectors';
import React from 'react';
import Helmet from 'react-helmet';

import {
  Input,
  Row,
  Col,
} from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { createAgent } from '../App/actions';
import { changeAgentData } from './actions';

import messages from './messages';
import { makeSelectAgentData } from './selectors';

/* import timezones from './data/timezones.json';
import languages from './data/languages.json';
import sampleData from './data/sampleData.json';*/

const timezones = [
  {
    text: 'America/Chicago',
    value: 'America/Chicago',
  },
  {
    text: 'America/Kentucky/Louisville',
    value: 'America/Kentucky/Louisville',
  },
];

const languages = [
  {
    value: 'en',
    text: 'English',
  },
  {
    value: 'de',
    text: 'German',
  },
  {
    value: 'fr',
    text: 'French',
  },
  {
    value: 'es',
    text: 'Spanish',
  }
];

const sampleData = [
  {
    value: 'smallTalk',
    text: 'Small Talk Agent',
  },
  {
    value: 'customerService',
    text: 'Customer Service Agent',
  },
  {
    value: 'bookings',
    text: 'Bookings Agent',
  },
];

const returnFormattedOptions = (options) => options.map((option, index) => (
  <option key={index} value={option.value}>
    {option.text}
  </option>
    ));

export class AgentPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    sampleData.unshift({ value: 'none', text: messages.sampleDataPlaceholder.defaultMessage, disabled: 'disabled' });
  }

  render() {
    const { loading, error, agent } = this.props;
    const agentProps = {
      loading,
      error,
      agent,
    };

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          { agentProps.loading ? <Preloader color='#00ca9f' size='big' /> : null }
        </Col>
        <Helmet
          title="Create Agent"
          meta={[
            { name: 'description', content: 'Create your NLU agent' },
          ]}
        />
        <Header breadcrumbs={[{ label: '+ Creating agent'}, ]}/>
        <Content>
          <ContentHeader title={messages.createAgentTitle} subTitle={messages.createDescription} />
          <Form>
            <Row>
              <FormTextInput
                label={messages.agentName}
                placeholder={messages.agentNamePlaceholder.defaultMessage}
                inputId="agentName"
                onChange={this.props.onChangeAgentData.bind(null, 'agentName')}
                required
              />
              <FormTextInput
                label={messages.description}
                placeholder={messages.descriptionPlaceholder.defaultMessage}
                inputId="description"
                onChange={this.props.onChangeAgentData.bind(null, 'description')}
              />
              <Input
                s={12}
                name="sampleData"
                type="select"
                label={messages.sampleData.defaultMessage}
                onChange={this.props.onChangeAgentData.bind(null, 'sampleData')}
              >
                {returnFormattedOptions(sampleData)}
              </Input>
              <Input
                s={6}
                name="language"
                type="select"
                label={messages.language.defaultMessage}
                defaultValue={'en'}
                onChange={this.props.onChangeAgentData.bind(null, 'language')}
              >
                {returnFormattedOptions(languages)}
              </Input>
              <Input
                s={6}
                name="timezone"
                type="select"
                label={messages.timezone.defaultMessage}
	`	onChange={this.props.onChangeAgentData.bind(null, 'timezone')}
              >
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
  onChangeAgentData: React.PropTypes.func,
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
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AgentPage);
