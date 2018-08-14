/**
 *
 * SettingsPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';

import saga from './saga';
import messages from './messages';

import { Grid } from '@material-ui/core';
import ContentHeader from 'components/ContentHeader';
import Form from './Components/Form';
import ActionButtons from './Components/ActionButtons';

import { makeSelectSettings } from '../App/selectors';

import {
  loadSettings,
  updateSettings,
  changeSettingsData,
  addFallbackResponse,
  deleteFallbackResponse,
} from '../App/actions';

/* eslint-disable react/prefer-stateless-function */
export class SettingsPage extends React.PureComponent {

  componentWillMount() {
    this.props.onLoadSettings();
  }

  render() {
    return (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={messages.createSubtitle}
          inlineElement={
            <ActionButtons
              onFinishAction={this.props.onSaveChanges}
            />
          }
        />
        <Form
          settings={this.props.settings}
          onChangeSettingsData={this.props.onChangeSettingsData}
          onAddFallbackResponse={this.props.onAddFallbackResponse}
          onDeleteFallbackResponse={this.props.onDeleteFallbackResponse}
        />
      </Grid>
    );
  }
}

SettingsPage.propTypes = {
  settings: PropTypes.object,
  onChangeSettingsData: PropTypes.func,
  onSaveChanges: PropTypes.func,
  onAddFallbackResponse: PropTypes.func.isRequired,
  onDeleteFallbackResponse: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  settings: makeSelectSettings()
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadSettings: () => {
      dispatch(loadSettings());
    },
    onChangeSettingsData: (field, value) => {
      dispatch(changeSettingsData({ field, value }))
    },
    onSaveChanges: () => {
      dispatch(updateSettings());
    },
    onAddFallbackResponse: (newFallback) => {
      dispatch(addFallbackResponse(newFallback));
    },
    onDeleteFallbackResponse: (fallbackIndex) => {
      dispatch(deleteFallbackResponse(fallbackIndex));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'settings', saga });

export default compose(
  withSaga,
  withConnect
)(SettingsPage);
