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
      this.props.onSuccess(`/agent/${this.props.agent.id}/sayings`);
    }
  }


  state = {
    isNewDomain: this.props.match.params.domainId === 'create'
  };

  render() {
    const { intl } = this.props;
    return (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={this.state.isNewDomain ? intl.formatMessage(messages.newCategory) : this.props.domain.domainName}
          inlineElement={
            <ActionButtons
              agentId={this.props.agent.id}
              onFinishAction={this.state.isNewDomain ? this.props.onCreateDomain : this.props.onUpdateDomain}
            />
          }
          backButton={messages.backButton}
        />
        <Form
          domain={this.props.domain}
          onChangeDomainData={this.props.onChangeDomainData}
          onChangeActionThreshold={this.props.onChangeActionThreshold}
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
