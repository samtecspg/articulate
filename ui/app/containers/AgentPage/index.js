import React from 'react';
import Helmet from 'react-helmet';
import {
  Col,
  Input,
  Row,
} from 'react-materialize';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import { createStructuredSelector } from 'reselect';
import ActionButton from '../../components/ActionButton';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';
import ConfirmationModal from '../../components/ConfirmationModal';

import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import Preloader from '../../components/Preloader';
import SliderInput from '../../components/SliderInput';

import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';

import Responses from './Components/Responses';

import {
  createAgent,
  resetStatusFlags,
  updateAgent,
} from '../App/actions';
import {
  makeSelectError,
  makeSelectInWizard,
  makeSelectLoading,
  makeSelectSuccess,
} from '../App/selectors';
import {
  changeAgentData,
  loadAgent,
  resetAgentData,
  removeAgentFallback,
} from './actions';

import messages from './messages';

import { makeSelectAgentData, makeSelectTouched } from './selectors';

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
  constructor() {
    super();
    this.setEditMode = this.setEditMode.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onLeave = this.onLeave.bind(this);
  }

  state = {
    editMode: false,
    displayModal: false,
    clickedSave: false,
    waitingForConfirm: false,
    nextRoute: null,
  };

  componentWillMount() {
    sampleData.unshift({ value: 'none', text: messages.sampleDataPlaceholder.defaultMessage, disabled: 'disabled' });
  }

  componentDidMount() {
    this.setEditMode(this.props.route.name === 'agentEdit');
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.route !== prevProps.route) {
      this.setEditMode(this.props.route.name === 'agentEdit');
    }
    if (this.props.success) {
      Alert.success(this.state.editMode ? messages.successMessageEdit.defaultMessage : messages.successMessage.defaultMessage, {
        position: 'bottom'
      });
      this.props.onSuccess.bind(null, this.props.inWizard)();
    }

    if (this.props.error) {
      Alert.error(this.props.error.message, {
        position: 'bottom'
      });
    }
  }

  setEditMode(isEditMode) {
    if (isEditMode) {
      this.setState({ editMode: true });
      this.props.onEditMode(this.props.params.id);
    } else {
      this.setState({ editMode: false });
      this.props.resetForm();
    }
  }

  submitForm(evt) {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.state.clickedSave = true;
    if (this.state.editMode) {
      this.props.onUpdate();
    } else {
      this.props.onCreate();
    }
  }

  onChangeInput(evt, field) {
    let value;
    if (evt) {
      value = evt.target.value;
    } else {
      value = null;
    }
    if (field === 'fallbackResponses') {
      if (evt.charCode === 13 && !_.isEmpty(value)) { // If user hits enter add response
        if (field === 'fallbackResponses') {
          this.lastAgentResponse.scrollIntoView(true);
        }
        this.props.onChangeAgentData(field, evt);
        evt.target.value = null;
      }
    }
  }

  routerWillLeave(route){
    if (!this.state.waitingForConfirm && this.props.touched && !this.state.clickedSave) {
      this.state.nextRoute = route;
      this.state.displayModal = true;
      this.state.waitingForConfirm = true;
      this.forceUpdate();
      return false;
    }
  }

  onLeave(){
    this.props.resetForm();
    this.props.router.push(this.state.nextRoute.pathname);
  }

  onDismiss(){
    this.setState({
      displayModal: false,
      waitingForConfirm: false,
    });
  }

  render() {
    const { loading, error, success, agent, match } = this.props;
    const agentProps = {
      loading,
      error,
      success,
      agent,
      match
    };

    const breadcrumbs = [{ label: 'Agent' },];
    if(this.state.editMode){
      breadcrumbs.push({ label: 'Edit' })
    }else{
      breadcrumbs.push({ label: '+ Create' })
    }

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
        <Header breadcrumbs={breadcrumbs} actionButtons={<ActionButton label={this.state.editMode ? messages.editButton : messages.createButton} onClick={this.submitForm} />} />
        <Content>
          <ContentHeader title={messages.createAgentTitle} subTitle={messages.createDescription} />
          <Form>
            <Row>
              <FormTextInput
                label={messages.agentName}
                placeholder={messages.agentNamePlaceholder.defaultMessage}
                inputId="agentName"
                onChange={this.props.onChangeAgentData.bind(null, 'agentName')}
                value={agent.agentName}
                required
              />
              <FormTextInput
                label={messages.description}
                placeholder={messages.descriptionPlaceholder.defaultMessage}
                inputId="description"
                onChange={this.props.onChangeAgentData.bind(null, 'description')}
                value={agent.description}
              />
              {/*<Input
                s={12}
                name="sampleData"
                type="select"
                label={messages.sampleData.defaultMessage}
                onChange={this.props.onChangeAgentData.bind(null, 'sampleData')}
              >
                {returnFormattedOptions(sampleData)}
              </Input>*/}
              <Input
                s={6}
                name="language"
                type="select"
                label={messages.language.defaultMessage}
                value={agent.language}
                onChange={this.props.onChangeAgentData.bind(null, 'language')}
              >
                {returnFormattedOptions(languages)}
              </Input>
              <Input
                s={6}
                name="timezone"
                type="select"
                label={messages.timezone.defaultMessage}
                value={agent.timezone}
                onChange={this.props.onChangeAgentData.bind(null, 'timezone')}
              >
                {returnFormattedOptions(timezones)}
              </Input>
            </Row>
          </Form>

          <Row>
            <br/>
            <SliderInput
              label={messages.domainClassifierThreshold}
              id="domainClassifierThreshold"
              min="0"
              max="100"
              onChange={this.props.onChangeAgentData.bind(null, 'domainClassifierThreshold')}
              value={agent.domainClassifierThreshold.toString()}
            />
          </Row>

          <Form style={{marginTop: '0px'}}>
            <Row>
                <FormTextInput
                  id='fallbacks'
                  label={messages.agentFallbackTitle}
                  placeholder={messages.fallbackInput.defaultMessage}
                  onKeyPress={(evt) => this.onChangeInput(evt, 'fallbackResponses')}
                />
            </Row>
          </Form>

          {agent.fallbackResponses.length > 0 ?
            <TableContainer id="fallbackResponsesTable" quotes>
              <Table>
                <Responses
                  fallbackResponses={agent.fallbackResponses}
                  onRemoveResponse={this.props.onRemoveFallback}
                />
              </Table>
            </TableContainer>
            : null
          }
          <br/>
          <div style={{ float: 'left', clear: 'both' }} ref={(el) => { this.lastAgentResponse = el;}}>
            <br/>
          </div>
        </Content>
        <ConfirmationModal
          isOpen={this.state.displayModal}
          onLeave={this.onLeave}
          onDismiss={this.onDismiss}
          contentBody='You have not saved your edits to this agent. If you leave you will lose your current work.'
        />
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
  onCreate: React.PropTypes.func,
  onUpdate: React.PropTypes.func,
  onChangeAgentData: React.PropTypes.func,
  resetForm: React.PropTypes.func,
  onSuccess: React.PropTypes.func,
  onEditMode: React.PropTypes.func,
  onRemoveFallback: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeAgentData: (field, evt) => {
      dispatch(resetStatusFlags());
      dispatch(changeAgentData({ value: evt.target.value, field }));
    },
    onCreate: () => {
      dispatch(createAgent());
    },
    onUpdate: () => {
      dispatch(updateAgent());
    },
    resetForm: () => {
      dispatch(resetAgentData());
    },
    onSuccess: (inWizard) => {

    },
    onEditMode: (agentId) => {
      dispatch(loadAgent(agentId));
    },
    onRemoveFallback: (fallbackIndex) => {
      dispatch(removeAgentFallback(fallbackIndex));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgentData(),
  loading: makeSelectLoading(),
  touched: makeSelectTouched(),
  success: makeSelectSuccess(),
  inWizard: makeSelectInWizard(),
  error: makeSelectError(),
});

export default connect(mapStateToProps, mapDispatchToProps)(AgentPage);
