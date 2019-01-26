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

import { Grid } from '@material-ui/core';
import ContentHeader from 'components/ContentHeader';
import Form from './Components/Form';

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import messages from './messages';

import qs from 'query-string';

import {
  makeSelectCategory,
  makeSelectAgent,
  makeSelectSuccess,
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
  }

  componentDidMount() {
    if(this.state.isNewCategory) {
      this.props.onResetData();
    }
    else {
      this.props.onLoadCategory(this.props.match.params.categoryId);
    }
  }

  componentDidUpdate() {
    if (this.props.success) {
      this.props.onSuccess(`/agent/${this.props.agent.id}/sayings?filter=${this.state.filter}&page=${this.state.page}`);
    }
  }

  state = {
    isNewCategory: this.props.match.params.categoryId === 'create',
    filter: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).filter,
    page: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).page,
    formError: false,
    errorState: {
      categoryName: false,
      tabs: [],
    },
  };

  submit(){
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
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={this.state.isNewCategory && this.props.category.categoryName === '' ? intl.formatMessage(messages.newCategory) : this.props.category.categoryName}
          inlineElement={
            <ActionButtons
              formError={this.state.formError}
              page={this.state.page}
              filter={this.state.filter}
              agentId={this.props.agent.id}
              onFinishAction={this.submit}
              backButton={messages.backButton}
              goBack={() => {this.props.onGoToUrl(`/agent/${this.props.agent.id}/sayings?filter=${this.state.filter}&page=${this.state.page}`)}}
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
      </Grid>
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
};

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  category: makeSelectCategory(),
  success: makeSelectSuccess(),
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
