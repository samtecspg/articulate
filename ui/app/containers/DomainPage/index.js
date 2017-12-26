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

import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import SliderInput from '../../components/SliderInput';
import Preloader from '../../components/Preloader';

import { createDomain } from '../../containers/App/actions';
import {
  makeSelectCurrentAgent,
  makeSelectDomain,
  makeSelectError,
  makeSelectLoading,
} from '../../containers/App/selectors';

import { changeDomainData } from './actions';

import messages from './messages';
import { makeSelectDomainData } from './selectors';

export class DomainPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onChangeInput = this.onChangeInput.bind(this);
  }

  componentWillMount() {
    const { currentAgent } = this.props;
    if (currentAgent) {
      this.props.onChangeDomainData({ value: currentAgent.agentName, field: 'agent' });
    }
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

  render() {
    const { loading, error, domain, currentAgent } = this.props;
    const domainProps = {
      loading,
      error,
      domain,
    };

    let breadcrumbs = [];
    if (currentAgent){
      breadcrumbs = [{ link: `/agent/${currentAgent.id}`, label: `Agent: ${currentAgent.agentName}`}, { label: '+ Creating domains'},];
    }
    else {
      breadcrumbs = [{ label: '+ Creating domains'}, ];
    }

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          { domainProps.loading ? <Preloader color='#00ca9f' size='big' /> : null }
        </Col>
        <Helmet
          title="Create Domain"
          meta={[
            { name: 'description', content: 'Create a domain for your agent' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs}/>
        <Content>
          <ContentHeader title={messages.createDomainTitle} subTitle={messages.createDomainDescription} />
          <Form>
            <Row>
              <FormTextInput
                label={messages.domainName}
                placeholder={messages.domainNamePlaceholder.defaultMessage}
                value={this.props.domainData.domainName}
                onChange={(evt) => this.onChangeInput(evt, 'domainName')}
                required
              />
            </Row>
          </Form>

          <Row>
            <SliderInput
              label={messages.intentThreshold}
              min="0"
              max="100"
              name="intentThreshold"
              defaultValue={this.props.domainData.intentThreshold}
              onChange={(evt) => this.onChangeInput(evt, 'intentThreshold')}
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
  onChangeDomainData: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  domainData: React.PropTypes.object,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {

    onChangeDomainData: (data) => dispatch(changeDomainData(data)),
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
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(DomainPage);
