/**
 *
 * CategoriesEditPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Grid, CircularProgress } from '@material-ui/core';
import ContentHeader from 'components/ContentHeader';
import Form from './Components/Form';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import messages from './messages';

import qs from 'query-string';

import {
  makeSelectCategory,
  makeSelectAgent,
  makeSelectLoading,
  makeSelectSuccessCategory,
  makeSelectCategoryTouched
} from '../App/selectors';

import {
  changeCategoryData,
  loadCategory,
  resetCategoryData,
  createCategory,
  updateCategory,
  resetStatusFlag,
  changeActionThreshold,
  deleteCategory,
  addNewCategoryParameter,
  deleteCategoryParameter,
  changeCategoryParameterName,
  changeCategoryParameterValue,
} from '../App/actions';

import ActionButtons from './Components/ActionButtons';

/* eslint-disable react/prefer-stateless-function */
export class CategoriesEditPage extends React.Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.initForm = this.initForm.bind(this);
  }

  state = {
    isNewCategory: this.props.match.params.categoryId === 'create',
    filter: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter : '',
    page: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page ? qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page : '',
    formError: false,
    exitAfterSubmit: false,
    errorState: {
      categoryName: false,
      tabs: [],
    },
  };

  initForm(){
    if(this.state.isNewCategory) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadCategory(this.props.match.params.categoryId);
    }
  }

  componentWillMount() {
    if(this.props.agent.id) {
      this.initForm();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.agent.id && this.props.agent.id){
      this.initForm();
    }
    if (this.props.success) {
      if (this.state.exitAfterSubmit){
        this.props.onSuccess(`/agent/${this.props.agent.id}/dialogue?tab=sayings&filter=${this.state.filter}&page=${this.state.page}`);
      }
      if (this.state.isNewCategory) {
        this.setState({
          isNewCategory: false,
        });
      }
    }
  }

  submit(exit){
    let errors = false;
    const newErrorState = {
      categoryName: false,
      tabs: []
    };

    if (!this.props.category.categoryName || this.props.category.categoryName === ''){
      errors = true;
      newErrorState.categoryName = true;
      newErrorState.tabs.push(0);
    }
    else {
      newErrorState.categoryName = false;
    }

    if (!errors){
      this.setState({
        formError: false,
        exitAfterSubmit: exit,
        errorState: {...newErrorState},
      });
      if (this.state.isNewCategory){
        this.props.onCreateCategory();
      }
      else {
        this.props.onUpdateCategory();
      }
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
      this.props.agent.id ?
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={this.state.isNewCategory && this.props.category.categoryName === '' ? intl.formatMessage(messages.newCategory) : this.props.category.categoryName}
          inlineElement={
            <ActionButtons
              touched={this.props.touched}
              loading={this.props.loading}
              success={this.props.success}
              formError={this.state.formError}
              page={this.state.page}
              filter={this.state.filter}
              agentId={this.props.agent.id}
              onFinishAction={this.submit}
              backButton={messages.backButton}
              goBack={() => {this.props.onGoToUrl(`/agent/${this.props.agent.id}/dialogue?tab=sayings&filter=${this.state.filter}&page=${this.state.page}`)}}
              onSaveAndExit={() => { this.submit(true) }}
            />
          }
        />
        <Form
          category={this.props.category}
          onChangeCategoryData={this.props.onChangeCategoryData}
          onChangeActionThreshold={this.props.onChangeActionThreshold}
          errorState={this.state.errorState}
          onDelete={this.props.onDelete.bind(null, this.props.category.id)}
          newCategory={this.state.isNewCategory}
          onAddNewParameter={this.props.onAddNewParameter}
          onDeleteParameter={this.props.onDeleteParameter}
          onChangeParameterName={this.props.onChangeParameterName}
          onChangeParameterValue={this.props.onChangeParameterValue}
        />
      </Grid> : 
      <CircularProgress style={{position: 'absolute', top: '40%', left: '49%'}}/>
    );
  }
}

CategoriesEditPage.propTypes = {
  intl: intlShape,
  agent: PropTypes.object,
  category: PropTypes.object,
  onResetData: PropTypes.func,
  onLoadCategory: PropTypes.func,
  onCreateCategory: PropTypes.func,
  onUpdateCategory: PropTypes.func,
  onChangeCategoryData: PropTypes.func,
  onChangeActionThreshold: PropTypes.func,
  onDeleteCategoryExample: PropTypes.func,
  onChangeExampleSynonyms: PropTypes.func,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  touched: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  category: makeSelectCategory(),
  loading: makeSelectLoading(),
  touched: makeSelectCategoryTouched(),
  success: makeSelectSuccessCategory(),
});

function mapDispatchToProps(dispatch) {
  return {
    onResetData: () => {
      dispatch(resetCategoryData());
    },
    onLoadCategory: (id) => {
      dispatch(loadCategory(id));
    },
    onCreateCategory: () => {
      dispatch(createCategory());
    },
    onUpdateCategory: () => {
      dispatch(updateCategory());
    },
    onChangeCategoryData: (field, value) => {
      dispatch(changeCategoryData({field, value}));
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
    onDelete: (id) => {
      dispatch(deleteCategory(id));
    },
    onAddNewParameter: (payload) => {
      dispatch(addNewCategoryParameter(payload));
    },
    onDeleteParameter: (parameterName) => {
      dispatch(deleteCategoryParameter(parameterName));
    },
    onChangeParameterName: (oldParameterName, newParameterName) => {
      dispatch(changeCategoryParameterName(oldParameterName, newParameterName));
    },
    onChangeParameterValue: (parameterName, value) => {
      dispatch(changeCategoryParameterValue(parameterName, value));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'category', saga });

export default compose(
  injectIntl,
  withSaga,
  withConnect
)(CategoriesEditPage);
