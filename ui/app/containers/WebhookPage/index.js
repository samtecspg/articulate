import React from 'react';
import Helmet from 'react-helmet';

import { Row,
  Col,
  } from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ActionButton from '../../components/ActionButton';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';
import Preloader from '../../components/Preloader';

import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';

import { createWebhook, } from '../../containers/App/actions';
import {
  makeSelectCurrentAgent,
  makeSelectError,
  makeSelectLoading,
  makeSelectWebhook,
} from '../../containers/App/selectors';

import { changeWebhookData } from './actions';

import messages from './messages';
import { makeSelectWebhookData } from './selectors';

export class WebhookPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onChangeInput = this.onChangeInput.bind(this);
  }

  componentWillMount() {
    const { currentAgent } = this.props;
    if (currentAgent) {
      this.props.onChangeWebhookData('agent', currentAgent.id);
    }
  }

  componentWillUpdate(nextProps) {
    const { currentAgent } = nextProps;
    if (currentAgent !== this.props.currentAgent) {
      this.props.onChangeWebhookData('agent', currentAgent.id);
    }
  }

  onChangeInput(evt, field) {
    this.props.onChangeWebhookData(field, evt.target.value);
  }

  render() {
    const { loading, error, webhook, currentAgent } = this.props;
    const webhookProps = {
      loading,
      error,
      webhook,
    };

    let breadcrumbs = [];
    if (currentAgent){
      breadcrumbs = [{ link: `/agent/${currentAgent.id}`, label: `Agent: ${currentAgent.agentName}`}, { label: '+ Add Webhook'},];
    }
    else {
      breadcrumbs = [{ label: '+ Add Webhook'}, ];
    }

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          { webhookProps.loading ? <Preloader color='#00ca9f' size='big' /> : null }
        </Col>
        <Helmet
          title="Create Webhook"
          meta={[
            { name: 'description', content: 'Add a webhook to your agent' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs}/>
        <Content>
          <ContentHeader title={messages.createWebhookTitle} subTitle={messages.createWebhookDescription} />
          <Form>
            <Row>
              <FormTextInput
                label={messages.url}
                placeholder={messages.urlPlaceholder.defaultMessage}
                inputId="webhookUrl"
                value={this.props.webhookData.webhookUrl}
                onChange={(evt) => this.onChangeInput(evt, 'webhookUrl')}
                required
                tooltip={messages.urlTooltip.defaultMessage}
              />
              {/*
              <div className="input-field col s6">
                <FormTextInput
                  label={messages.simpleAuthentication}
                  placeholder={messages.usernamePlaceholder.defaultMessage}
                  inputId="username"
                  value={this.props.webhookData.webhookUsername}
                  onChange={this.props.onChangeWebhookData.bind(null, 'username')}
                  required={true}
                  />
              </div>
              <div className="input-field col s6">
                <FormTextInput
                  placeholder={messages.passwordPlaceholder.defaultMessage}
                  inputId="password"
                  value={this.props.webhookData.password}
                  onChange={this.props.onChangeWebhookData.bind(null, 'password')}
                  required={true}
                  />
              </div>*/}
            </Row>
          </Form>

          <ActionButton label={messages.saveButton} onClick={this.props.onSubmitForm} />

          <Row>
            <p>
              {JSON.stringify(webhookProps)}
            </p>
          </Row>
        </Content>
      </div>
    );
  }
}

WebhookPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  webhook: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onChangeWebhookData: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  webhookData: React.PropTypes.object,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {

    onChangeWebhookData: (field, value) => dispatch(changeWebhookData({ value, field })),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(createWebhook());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  webhook: makeSelectWebhook(),
  webhookData: makeSelectWebhookData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(WebhookPage);
