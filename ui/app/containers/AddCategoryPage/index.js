/**
 *
 * AddCategoryPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Grid, CircularProgress } from '@material-ui/core';
import ContentHeader from 'components/ContentHeader';
import injectSaga from 'utils/injectSaga';
import qs from 'query-string';
import Form from './Components/Form';

import saga from './saga';
import messages from './messages';

import {
  makeSelectAgent,
  makeSelectLoadingImportCategory,
  makeSelectPrebuiltCategories,
  makeSelectErrorImportCategory,
} from '../App/selectors';

import { loadPrebuiltCategories, importCategory, toggleChatButton, loadPrebuiltCategoriesError } from '../App/actions';

import ActionButtons from './Components/ActionButtons';

/* eslint-disable react/prefer-stateless-function */
export class AddCategoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.initForm = this.initForm.bind(this);
  }

  state = {
    filter: qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
      .filter
      ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter
      : '',
    page: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page
      ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page
      : '',
  };

  initForm() {
    this.props.onLoadPrebuiltCategories();
    this.props.onShowChatButton(true);
  }

  componentWillMount() {
    if (this.props.agent.id) {
      this.initForm();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.agent.id && this.props.agent.id) {
      this.initForm();
    }
  }

  render() {
    return this.props.agent.id ? (
      <Grid container>
        <ContentHeader
          title=""
          subtitle=""
          inlineElement={
            <ActionButtons
              page={this.state.page}
              filter={this.state.filter}
              agentId={this.props.agent.id}
              backButton={messages.backButton}
              goBack={() => {
                this.props.onGoToUrl(
                  `/agent/${this.props.agent.id}/dialogue?tab=sayings&filter=${
                  this.state.filter
                  }&page=${this.state.page}`,
                );
              }}
            />
          }
        />
        <Form
          prebuiltCategories={this.props.prebuiltCategories}
          agentId={this.props.agent.id}
          onGoToUrl={this.props.onGoToUrl}
          importCategory={this.props.onImportCategory}
          loading={this.props.loading}
          error={this.props.error}
          onSetError={this.props.onImportCategoryError}
        />
      </Grid>
    ) : (
        <CircularProgress
          style={{ position: 'absolute', top: '40%', left: '49%' }}
        />
      );
  }
}

AddCategoryPage.propTypes = {
  agent: PropTypes.object,
  loading: PropTypes.bool,
  prebuiltCategories: PropTypes.object,
  onImportCategory: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  loading: makeSelectLoadingImportCategory(),
  prebuiltCategories: makeSelectPrebuiltCategories(),
  error: makeSelectErrorImportCategory(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGoToUrl: url => {
      dispatch(push(url));
    },
    onLoadPrebuiltCategories: () => {
      dispatch(loadPrebuiltCategories());
    },
    onImportCategory: category => {
      dispatch(importCategory(category));
    },
    onShowChatButton: value => {
      dispatch(toggleChatButton(value));
    },
    onImportCategoryError: value => {
      dispatch(loadPrebuiltCategoriesError(value));
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'addCategory', saga });

export default compose(
  withSaga,
  withConnect,
)(AddCategoryPage);
