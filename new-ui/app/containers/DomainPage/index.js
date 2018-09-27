/**
 *
 * DomainsEditPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Grid } from '@material-ui/core';
import ContentHeader from 'components/ContentHeader';
import Form from './Components/Form';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import messages from './messages';

import qs from 'query-string';

import {
  makeSelectDomain,
  makeSelectAgent,
  makeSelectSuccess,
} from '../App/selectors';

import {
  changeDomainData,
  loadDomain,
  resetDomainData,
  createDomain,
  updateDomain,
  resetStatusFlag,
  changeActionThreshold
} from '../App/actions';

import ActionButtons from './Components/ActionButtons';

/* eslint-disable react/prefer-stateless-function */
export class DomainsEditPage extends React.Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    if(this.state.isNewDomain) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadDomain(this.props.match.params.domainId);
    }
  }

  componentDidUpdate() {
    if (this.props.success) {
      this.props.onSuccess(`/agent/${this.props.agent.id}/sayings?filter=${this.state.filter}&page=${this.state.page}`);
    }
  }

  state = {
    isNewDomain: this.props.match.params.domainId === 'create',
    filter: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter,
    page: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page,
    formError: false,
    errorState: {
      domainName: false,
    },
  };

  submit(){
    let errors = false;
    const newErrorState = {
      domainName: false,
    }

    if (!this.props.domain.domainName || this.props.domain.domainName === ''){
      errors = true;
      newErrorState.domainName = true;
    }
    else {
      newErrorState.domainName = false;
    }

    if (!errors){
      this.setState({
        formError: false,
      });
      if (this.state.isNewDomain){
        this.props.onCreateDomain();
      }
      else {
        this.props.onUpdateDomain();
      };
    }
    else {
      this.setState({
        formError: true,
        errorState: {...newErrorState},
      });
    }
  }

  render() {
    const { intl } = this.props;
    return (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={this.state.isNewDomain ? intl.formatMessage(messages.newCategory) : this.props.domain.domainName}
          inlineElement={
            <ActionButtons
              formError={this.state.formError}
              page={this.state.page}
              filter={this.state.filter}
              agentId={this.props.agent.id}
              onFinishAction={this.submit}
            />
          }
          backButton={messages.backButton}
          goBack={() => {this.props.onGoToUrl(`/agent/${this.props.agent.id}/sayings?filter=${this.state.filter}&page=${this.state.page}`)}}
        />
        <Form
          domain={this.props.domain}
          onChangeDomainData={this.props.onChangeDomainData}
          onChangeActionThreshold={this.props.onChangeActionThreshold}
          errorState={this.state.errorState}
        />
      </Grid>
    );
  }
}

DomainsEditPage.propTypes = {
  intl: intlShape,
  agent: PropTypes.object,
  domain: PropTypes.object,
  onResetData: PropTypes.func,
  onLoadDomain: PropTypes.func,
  onCreateDomain: PropTypes.func,
  onUpdateDomain: PropTypes.func,
  onChangeDomainData: PropTypes.func,
  onChangeActionThreshold: PropTypes.func,
  onDeleteDomainExample: PropTypes.func,
  onChangeExampleSynonyms: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  domain: makeSelectDomain(),
  success: makeSelectSuccess()
});

function mapDispatchToProps(dispatch) {
  return {
    onResetData: () => {
      dispatch(resetDomainData());
    },
    onLoadDomain: (id) => {
      dispatch(loadDomain(id));
    },
    onCreateDomain: () => {
      dispatch(createDomain());
    },
    onUpdateDomain: () => {
      dispatch(updateDomain());
    },
    onChangeDomainData: (field, value) => {
      dispatch(changeDomainData({field, value}));
    },
    onSuccess: (url) => {
      dispatch(resetStatusFlag());
      dispatch(push(url));
    },
    onChangeActionThreshold: (value) => {
      dispatch(changeActionThreshold(value));
    },
    onGoToUrl: (url) => {
      dispatch(push(url));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'domain', saga });

export default compose(
  injectIntl,
  withSaga,
  withConnect
)(DomainsEditPage);
