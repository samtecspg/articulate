/*
 * AgentsPage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { Grid, CircularProgress } from '@material-ui/core';

import MainContentHeader from './Components/MainContentHeader';
import AgentsCards from './Components/AgentsCards';

import injectSaga from 'utils/injectSaga';

import saga from './saga';
import messages from './messages';
import { makeSelectAgents } from '../App/selectors';
import { loadAgents } from '../App/actions';
import { push } from 'react-router-redux';

/* eslint-disable react/prefer-stateless-function */
export class AgentsPage extends React.PureComponent {

  componentWillMount() {
    this.props.onComponentMounted();
  }

  render() {
    const { agents } = this.props;
    return (
      agents ? 
        <Grid container>
          <MainContentHeader
            title={messages.title}
            sizesForHideInlineElement={['sm', 'xs']}
          />
          <AgentsCards onGoToUrl={this.props.onGoToUrl} agents={agents} />
        </Grid>
        :
        <CircularProgress style={{position: 'absolute', top: '40%', left: '49%'}}/>
    );
  }
}

AgentsPage.propTypes = {
  onComponentMounted: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  agents: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
};

const mapStateToProps = createStructuredSelector({
  agents: makeSelectAgents(),
});

function mapDispatchToProps(dispatch) {
  return {
    onComponentMounted: () => {
      dispatch(loadAgents())
    },
    onGoToUrl: (url) => {
      dispatch(push(url));
    },
  };
}

const withSaga = injectSaga({ key: 'agents', saga });
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withSaga,
  withConnect,
)(AgentsPage);