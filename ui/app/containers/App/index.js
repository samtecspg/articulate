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
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { ROUTE_AGENT } from '../../../common/constants';
import { AUTH_ENABLED } from '../../../common/env';
import logger from '../../../server/logger';
import AppContent from '../../components/AppContent';
import AppHeader from '../../components/AppHeader';
import PrivateRoute from '../../components/PrivateRoute';
import injectSaga from '../../utils/injectSaga';
import { getWS } from '../../utils/locationResolver';
import ActionPage from '../ActionPage/Loadable';
import AddCategoryPage from '../AddCategoryPage/Loadable';
import AgentPage from '../AgentPage/Loadable';
import AgentsPage from '../AgentsPage/Loadable';
import CategoryPage from '../CategoryPage/Loadable';
import ConnectionPage from '../ConnectionPage/Loadable';
import DialoguePage from '../DialoguePage/Loadable';
import KeywordsEditPage from '../KeywordsEditPage/Loadable';
import MissingAPIPage from '../MissingAPIPage/Loadable';
import NotFoundPage from '../NotFoundPage/Loadable';
import ReviewPage from '../ReviewPage/Loadable';
import AnalyticsPage from '../AnalyticsPage/Loadable';
import SettingsPage from '../SettingsPage/Loadable';
import SharedChatPage from '../SharedChatPage/Loadable';
import UserAuthPage from '../UserAuthPage/Loadable';
import CheatSheetPage from '../CheatSheetPage/Loadable';
import SayingsInfoPage from '../SayingsInfoPage/Loadable';

import UsersPage from '../UsersPage/Loadable';
import {
  checkAPI,
  loadAgent,
  loadAgentSuccess,
  loadServerInfo,
  loadSettings,
  refreshServerInfo,
  toggleConversationBar,
  updateSetting,
} from './actions';
import saga from './saga';
import {
  makeSelectAgent,
  makeSelectConversationBarOpen,
  makeSelectShowChatButton,
  makeSelectLocation,
  makeSelectMissingAPI,
  makeSelectNotifications,
  makeSelectSettings,
} from './selectors';

class App extends React.Component {
  state = {
    agent: null,
    client: null,
    socketClientConnected: false,
    serverStatusConnected: false,
  };

  getAgentIdFromPath() {
    const regex = /\/agent\/([0-9]+)(\/.+)?/;
    const matches = this.props.location.pathname.match(regex);
    let agentId = null;
    if (matches) {
      agentId = matches[1];
    }
    return agentId;
  }

  componentWillMount() {
    this.props.onLoadServerInfo();
    this.props.onLoadSettings();
    this.props.onCheckAPI();
    const agentId = this.getAgentIdFromPath();
    if (agentId && !this.props.agent.id) {
      this.props.onLoadAgent(agentId);
    }
    if (!this.state.socketClientConnected) {
      const client = new Nes.Client(getWS());
      client.onConnect = () => {
        logger.log(`[WS] Connected to ${getWS()}`);
        this.setState({
          client,
          socketClientConnected: true,
        });
      };
      client.onError = err => {
        logger.error(`[WS] Error ${getWS()}`);
        logger.error(err);
      };
      client.onDisconnect = (willReconnect, log) => {
        logger.log(`[WS] Disconnect from ${getWS()}`);
        logger.log(log);
        logger.log(`[WS] Will Reconnect = ${willReconnect}`);
      };
      client.onHeartbeatTimeout = willReconnect => {
        logger.log(`[WS] Heartbeat Timeout from ${getWS()}`);
        logger.log(`[WS] Will Reconnect = ${willReconnect}`);
      };
      client.connect({
        delay: 1000,
        auth: AUTH_ENABLED
          ? { headers: { cookie: document.cookie } }
          : undefined,
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
        if (this.state.client) {
          // If the socket was already subscribed to an agent
          if (this.state.agent) {
            // Unsubscribe from the agent
            this.state.client.unsubscribe(
              `/${ROUTE_AGENT}/${this.state.agent}`,
            );
          }
          const handler = agent => {
            if (agent) {
              this.props.onRefreshAgent(agent);
            }
          };
          this.state.client.subscribe(
            `/${ROUTE_AGENT}/${this.props.agent.id}`,
            handler,
          );
          this.setState({
            agent: this.props.agent.id,
          });
        }
      }
    }
    if (this.state.socketClientConnected && !this.state.serverStatusConnected) {
      const handler = server => {
        if (server) {
          this.props.onRefreshServerInfo(server);
        }
      };
      this.state.client.subscribe('/', handler);
      this.setState({
        serverStatusConnected: true,
      });
    }
  }

  render() {
    const {
      conversationBarOpen,
      chatButtonOpen,
      onToggleConversationBar,
      notifications,
    } = this.props;
    const demoMode = this.props.location.pathname.indexOf('demo') !== -1;
    const disableHeader = this.props.location.pathname.indexOf('discovery') !== -1;
    return (
      disableHeader ?
      <div>
        <Switch>
          <Route
            exact
            path="/agent/:id/discovery"
            component={CheatSheetPage}
          />
          <Route
            exact
            path="/agent/:id/discovery/saying/:sayingId"
            component={SayingsInfoPage}
          />
          <Redirect
            from="/agent/:id/discovery/sayingDummy/:sayingId"
            to={`/agent/:id/discovery/saying/:sayingId?${this.props.location.search}`}
          />
        </Switch>
      </div> :
      <div>
        <AppHeader
          agent={this.props.agent}
          uiLanguages={this.props.settings.uiLanguages}
          uiLanguage={this.props.settings.uiLanguage}
          onChangeLanguage={this.props.onChangeLanguage}
          onToggleConversationBar={onToggleConversationBar}
          conversationBarOpen={conversationBarOpen}
          chatButtonOpen = {chatButtonOpen}
          notifications={notifications}
          demoMode={demoMode}
          onShareAgent={this.props.onShareAgent}
        />
        <AppContent
          demoMode={demoMode}
          conversationBarOpen={conversationBarOpen}
        >
          <Switch>
            <PrivateRoute
              exact
              path="/"
              component={AgentsPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/agent/:id"
              component={AgentPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/connection/:id"
              component={ConnectionPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/agent/:id/dialogue"
              component={DialoguePage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/agent/:id/review"
              component={ReviewPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/agent/:id/analytics"
              component={AnalyticsPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/agent/:id/keyword/:keywordId"
              component={KeywordsEditPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/agent/:id/addCategory"
              component={AddCategoryPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/agent/:id/category/:categoryId"
              component={CategoryPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/agent/:id/action/:actionId"
              component={ActionPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/settings"
              component={SettingsPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/missing-api"
              component={MissingAPIPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <Redirect
              from="/agent/:id/actionDummy/:actionId"
              to={`/agent/:id/action/:actionId?${this.props.location.search}`}
            />
            <Route exact path="/login" component={UserAuthPage} />
            <PrivateRoute
              exact
              path="/users"
              component={UsersPage}
              isAuthEnabled={AUTH_ENABLED}
            />
            <PrivateRoute
              exact
              path="/demo/:id"
              component={SharedChatPage}
              isAuthEnabled={AUTH_ENABLED}
            />
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
  onToggleConversationBar: PropTypes.func,
  onRefreshAgent: PropTypes.func,
  onChangeLanguage: PropTypes.func,
  notifications: PropTypes.array,
  settings: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    onMissingAPI: refURL => {
      if (refURL !== '/missing-api') {
        dispatch(push('/missing-api'));
      }
    },
    onCheckAPI: refURL => {
      if (refURL && refURL !== '/missing-api') {
        dispatch(checkAPI(refURL));
      }
      dispatch(checkAPI());
    },
    onToggleConversationBar: value => {
      dispatch(toggleConversationBar(value));
    },
    onRefreshAgent: agent => {
      agent.categoryClassifierThreshold *= 100;
      dispatch(loadAgentSuccess({ agent, socket: true }));
    },
    onLoadAgent: agentId => {
      dispatch(loadAgent(agentId));
    },
    onLoadSettings: () => {
      dispatch(loadSettings());
    },
    onLoadServerInfo: () => {
      dispatch(loadServerInfo());
    },
    onChangeLanguage: language => {
      dispatch(updateSetting('uiLanguage', language));
    },
    onRefreshServerInfo: server => {
      dispatch(refreshServerInfo(server));
    },
    onShareAgent: agentId => {
      dispatch(push(`/connection/create?channel=web-demo&agent=${agentId}`));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  agent: makeSelectAgent(),
  missingAPI: makeSelectMissingAPI(),
  location: makeSelectLocation(),
  conversationBarOpen: makeSelectConversationBarOpen(),
  chatButtonOpen: makeSelectShowChatButton(),
  notifications: makeSelectNotifications(),
  settings: makeSelectSettings(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'app', saga });

export default withRouter(withSaga(withConnect(App)));
