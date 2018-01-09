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
import Alert from 'react-s-alert';
import ActionButton from '../../components/ActionButton';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';

import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import Preloader from '../../components/Preloader';
import SliderInput from '../../components/SliderInput';

import { createAgent, resetStatusFlags } from '../App/actions';
import {
  makeSelectError,
  makeSelectSuccess,
  makeSelectLoading,
  makeSelectScenario,
  makeSelectInWizard,
} from '../App/selectors';
import {
  changeAgentData,
  resetAgentData,
} from './actions';

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
    this.props.resetForm();
    sampleData.unshift({ value: 'none', text: messages.sampleDataPlaceholder.defaultMessage, disabled: 'disabled' });
  }

  componentDidUpdate() {
    if (this.props.success){
      Alert.success(messages.successMessage.defaultMessage, {
          position: 'bottom'
      });
      this.props.onSuccess.bind(null, this.props.inWizard)();
    }

    if (this.props.error){
      Alert.error(this.props.error.message, {
          position: 'bottom'
      });
    }
  }

  render() {
    const { loading, error, success, agent } = this.props;
    const agentProps = {
      loading,
      error,
      success,
      agent,
    };
    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {agentProps.loading ? <Preloader color='#00ca9f' size='big' /> : null}
        </Col>
        <Helmet
          title="Create Agent"
          meta={[
            { name: 'description', content: 'Create your NLU agent' },
          ]}
        />
        <Header breadcrumbs={[{ label: '+ Creating agent' },]} />
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
                value={this.props.agent.language}
                onChange={this.props.onChangeAgentData.bind(null, 'language')}
              >
                {returnFormattedOptions(languages)}
              </Input>
              <Input
                s={6}
                name="timezone"
                type="select"
                label={messages.timezone.defaultMessage}
                value={this.props.agent.timezone}
                onChange={this.props.onChangeAgentData.bind(null, 'timezone')}
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
  resetForm: React.PropTypes.func,
  onSuccess: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeAgentData: (field, evt) => {
      dispatch(resetStatusFlags());
      dispatch(changeAgentData({ value: evt.target.value, field }));
    },
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(createAgent());
    },
    resetForm: () => {
      dispatch(resetAgentData());
    },
    onSuccess: (inWizard) => {
      if (inWizard){
        dispatch(push('/wizard/domain'));
      }
      else {
        dispatch(push('/domains'));
      }
    },
  };
}

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgentData(),
  loading: makeSelectLoading(),
  success: makeSelectSuccess(),
  inWizard: makeSelectInWizard(),
  error: makeSelectError(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AgentPage);
