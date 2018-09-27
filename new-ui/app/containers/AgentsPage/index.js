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

import { Grid } from '@material-ui/core';

import ContentHeader from 'components/ContentHeader';
import SearchAgent from './Components/SearchAgent';
import AgentsCards from './Components/AgentsCards';

import injectSaga from 'utils/injectSaga';

import saga from './saga';
import messages from './messages';
import { makeSelectAgents } from '../App/selectors';
import { loadAgents, deleteAgent } from '../App/actions';

/* eslint-disable react/prefer-stateless-function */
export class AgentsPage extends React.PureComponent {

  componentDidMount() {
    this.props.onComponentMounted();
  }

  render() {
    const { agents } = this.props;
    return (
      <Grid container>
        <ContentHeader
          title={messages.title}
          subtitle={messages.subtitle}
          inlineElement={
            <SearchAgent/>
          }
          sizesForHideInlineElement={['sm', 'xs']}
        />
        <AgentsCards onDeleteAgent={this.props.onDeleteAgent} agents={agents} />
      </Grid>
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
  agents: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  agents: makeSelectAgents()
});

function mapDispatchToProps(dispatch) {
  return {
    onComponentMounted: () => {
      dispatch(loadAgents())
    },
    onDeleteAgent: (id) => {
      dispatch(deleteAgent(id));
    }
  };
}

const withSaga = injectSaga({ key: 'agents', saga });
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withSaga,
  withConnect,
)(AgentsPage);