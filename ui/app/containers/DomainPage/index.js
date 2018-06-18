import React from 'react';
import Helmet from 'react-helmet';
import {
  Col,
  Row,
  Icon,
} from 'react-materialize';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Alert from 'react-s-alert';
import { createStructuredSelector } from 'reselect';
import ActionButton from '../../components/ActionButton';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';

import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import Preloader from '../../components/Preloader';
import SliderInput from '../../components/SliderInput';
import Toggle from '../../components/Toggle';
import Tooltip from '../../components/Tooltip';

import {
  createDomain,
  resetStatusFlags,
  updateDomain,
} from '../App/actions';
import {
  makeSelectCurrentAgent,
  makeSelectError,
  makeSelectInWizard,
  makeSelectLoading,
  makeSelectSuccess,
} from '../App/selectors';
import {
  changeDomainData,
  loadDomain,
  resetDomainData
} from './actions';

import messages from './messages';
import { makeSelectDomainData } from './selectors';

export class DomainPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onChangeInput = this.onChangeInput.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  state = {
    editMode: false,
  };

  componentDidMount() {
    this.setEditMode(this.props.route.name === 'domainEdit');

    document.getElementById('domainName').focus();
  }

  componentWillUpdate(nextProps) {
    const { currentAgent } = nextProps;
    if (currentAgent !== this.props.currentAgent) {
      this.props.onChangeDomainData({ value: currentAgent.agentName, field: 'agent' });
    }
  }

  onChangeInput(evt, field) {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.props.onChangeDomainData({ value: evt.target.value, field });
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.route !== prevProps.route) {
      this.setEditMode(this.props.route.name === 'domainEdit');
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
      this.props.resetForm();
      this.setState({ editMode: false });
      const { currentAgent } = this.props;
      if (currentAgent) {
        this.props.onChangeDomainData({ value: currentAgent.agentName, field: 'agent' });
      }
    }
  }

  submitForm(evt) {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    if (this.state.editMode) {
      this.props.onUpdate();
    } else {
      this.props.onCreate();
    }
  }

  render() {
    const { loading, error, success, domain, currentAgent } = this.props;
    const domainProps = {
      loading,
      success,
      error,
      domain,
    };

    let breadcrumbs = [
      { label: 'Agent' },
    ];
    if (currentAgent) {
      breadcrumbs.push({ link: `/agent/${currentAgent.id}`, label: `${currentAgent.agentName}` });
    }
    breadcrumbs.push({ link: `/domains`, label: 'Domains' });
    breadcrumbs.push({ label: `${this.state.editMode ? 'Edit' : '+ Create'}` });
    const contentHeaderTitle = this.state.editMode ? messages.editDomainTitle : messages.createDomainTitle;
    const contentHeaderSubTitle = this.state.editMode ? messages.editDomainDescription : messages.createDomainDescription;
    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {domainProps.loading ? <Preloader color='#00ca9f' size='big' /> : null}
        </Col>
        <Helmet
          title={`${this.state.editMode ? 'Edit Domain' : 'Create Domain'}`}
          meta={[
            { name: 'description', content: 'Create/Edit a domain for your agent' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs} actionButtons={
          <ActionButton label={this.state.editMode ? messages.editButton : messages.createButton} onClick={this.submitForm} />} />
        <Content>
          <ContentHeader title={contentHeaderTitle} subTitle={contentHeaderSubTitle} />
          <Form>
            <Row>
              <FormTextInput
                id='domainName'
                label={messages.domainName}
                placeholder={messages.domainNamePlaceholder.defaultMessage}
                value={domain.domainName}
                onChange={(evt) => this.onChangeInput(evt, 'domainName')}
                required
              />
            </Row>
          </Form>

          <Row>
            <SliderInput
              label={messages.intentThreshold}
              tooltip={messages.intentThresholdDescription.defaultMessage}
              min="0"
              max="100"
              name="intentThreshold"
              onChange={(evt) => this.onChangeInput(evt, 'intentThreshold')}
              value={domain.intentThreshold.toString()}

            />
          </Row>

          <Form>
            <Row>
              <Toggle
                inline
                strongLabel={false}
                label={messages.expandedTrainingData.defaultMessage}
                onChange={this.props.onChangeDomainData.bind(null, { field: 'extraTrainingData' })}
                checked={domainProps.domain.extraTrainingData}
              />
              <Tooltip
                tooltip={messages.expandedTrainingDataTooltip.defaultMessage}
                delay={50}
                position="top"
              >
                <a>
                  <Icon tiny>help_outline</Icon>
                </a>
              </Tooltip>
            </Row>
          </Form>

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
  onChangeDomainData: React.PropTypes.func,
  onCreate: React.PropTypes.func,
  onUpdate: React.PropTypes.func,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onSuccess: React.PropTypes.func,
  resetForm: React.PropTypes.func,
  onEditMode: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {

    onChangeDomainData: (data, evt) => {
      dispatch(resetStatusFlags());
      if (data.field === 'extraTrainingData'){
        data.value = evt.target.checked;
      }
      dispatch(changeDomainData(data));
    },
    onCreate: () => {
      dispatch(createDomain());
    },
    onUpdate: () => {
      dispatch(updateDomain());
    },
    resetForm: () => {
      dispatch(resetDomainData());
    },
    onSuccess: (inWizard) => {
      dispatch(resetStatusFlags());
      if (inWizard) {
        dispatch(push('/wizard/entity-intent'));
      }
      else {
        dispatch(push('/domains'));
      }
    },
    onEditMode: (domainId) => {
      dispatch(loadDomain(domainId));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  domain: makeSelectDomainData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  success: makeSelectSuccess(),
  inWizard: makeSelectInWizard(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(DomainPage);
