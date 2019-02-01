/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import Nes from 'nes';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import AppContent from '../../components/AppContent';
import AppHeader from '../../components/AppHeader';
import injectSaga from '../../utils/injectSaga';
import ActionPage from '../ActionPage/Loadable';
import AgentPage from '../AgentPage/Loadable';
import AgentsPage from '../AgentsPage/Loadable';
import CategoryPage from '../CategoryPage/Loadable';
import KeywordsEditPage from '../KeywordsEditPage/Loadable';
import KeywordsPage from '../KeywordsPage/Loadable';
import MissingAPIPage from '../MissingAPIPage/Loadable';
import NotFoundPage from '../NotFoundPage/Loadable';
import ReviewPage from '../ReviewPage/Loadable';
import SayingsPage from '../SayingsPage/Loadable';
import SettingsPage from '../SettingsPage/Loadable';
import {
  checkAPI,
  loadAgent,
  loadAgentSuccess,
  loadSettings,
  toggleConversationBar,
} from './actions';
import saga from './saga';
import {
  makeSelectAgent,
  makeSelectConversationBarOpen,
  makeSelectLocation,
  makeSelectMissingAPI,
  makeSelectNotifications,
} from './selectors';

class App extends React.Component {

  state = {
    agent: null,
    client: null,
    socketClientConnected: false,
  };

  componentWillMount() {
    this.props.onLoadSettings();
    this.props.onCheckAPI();
    if (!this.state.socketClientConnected) {
      const client = new Nes.Client(process.env.WS_URL || 'ws://localhost:7500');
      client.connect((err) => {

        if (err) {
          console.error('An error occurred connecting to the socket: ', err);
        }
        this.setState({
          client,
          socketClientConnected: true,
        });
      });
    }
  }

  componentDidMount() {
    if (this.props.missingAPI) {
      this.props.onMissingAPI(this.props.location.pathname);
    }
  }

  componentWillUpdate() {
    this.props.onCheckAPI(this.props.location.pathname);
  }

  componentDidUpdate() {
    if (this.props.missingAPI) {
      this.props.onMissingAPI(this.props.location.pathname);
    }
    // If an agent is loaded
    if (this.props.agent.id) {
      // If is different than the current agent
      if (this.props.agent.id !== this.state.agent) {
        // If the client was already initialized
        if (this.state.client){
          // If the socket was already subscribed to an agent
          if (this.state.agent) {
            // Unscribe from the agent
            this.state.client.unsubscribe(`/agent/${this.state.agent}`);
          }
          const handler = (agent) => {

            if (agent) {
              this.props.onRefreshAgent(agent);
            }
          };
          this.state.client.subscribe(`/agent/${this.props.agent.id}`, handler, (errSubscription) => {
            if (errSubscription) {
              console.error(`An error occurred subscribing to the agent ${this.props.agent.agentName}: ${errSubscription}`);
            }
          });
          this.setState({
            agent: this.props.agent.id,
          });
        }
      }
    }
  }

  render() {
    const { conversationBarOpen, onToggleConversationBar, notifications } = this.props;
    return (
      <div>
        <AppHeader onToggleConversationBar={onToggleConversationBar} conversationBarOpen={conversationBarOpen} notifications={notifications} />
        <AppContent conversationBarOpen={conversationBarOpen}>
          <Switch>
            <Route exact path='/' component={AgentsPage} />
            <Route exact path='/agent/:id' component={AgentPage} />
            <Route exact path='/agent/:id/sayings' component={SayingsPage} />
            <Route exact path='/agent/:id/review' component={ReviewPage} />
            <Route exact path='/agent/:id/keywords' component={KeywordsPage} />
            <Route exact path='/agent/:id/keyword/:keywordId' component={KeywordsEditPage} />
            <Route exact path='/agent/:id/category/:categoryId' component={CategoryPage} />
            <Route exact path='/agent/:id/action/:actionId' component={ActionPage} />
            <Route exact path='/settings' component={SettingsPage} />
            <Route exact path='/missing-api' component={MissingAPIPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </AppContent>
      </div>
    );
  }
}

App.propTypes = {
  agent: PropTypes.object,
  missingAPI: PropTypes.bool,
  location: PropTypes.object,
  onMissingAPI: PropTypes.func,
  onCheckAPI: PropTypes.func,
  onLoadSettings: PropTypes.func,
  onToggleConversationBar: PropTypes.func,
  onRefreshAgent: PropTypes.func,
  notifications: PropTypes.array,
};

export function mapDispatchToProps(dispatch) {
  return {
    onMissingAPI: (refURL) => {
      if (refURL !== '/missing-api') {
        dispatch(push('/missing-api'));
      }
    },
    onCheckAPI: (refURL) => {
      if (refURL && refURL !== '/missing-api') {
        dispatch(checkAPI(refURL));
      }
      dispatch(checkAPI());
    },
    onLoadSettings: () => {
      dispatch(loadSettings());
    },
    onToggleConversationBar: (value) => {
      dispatch(toggleConversationBar(value));
    },
    onRefreshAgent: (agent) => {
      dispatch(loadAgentSuccess({ agent }));
    },
    onLoadAgent: (agentId) => {
      dispatch(loadAgent(agentId));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  missingAPI: makeSelectMissingAPI(),
  location: makeSelectLocation(),
  conversationBarOpen: makeSelectConversationBarOpen(),
  notifications: makeSelectNotifications(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'app', saga });

export default withRouter(withSaga(withConnect(App)));
