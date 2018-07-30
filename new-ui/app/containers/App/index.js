/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import AppHeader from 'components/AppHeader';
import AppContent from 'components/AppContent';

import AgentsPage from 'containers/AgentsPage/Loadable';
import AgentPage from 'containers/AgentPage/Loadable';
import SayingsPage from 'containers/SayingsPage/Loadable';
import KeywordsPage from 'containers/KeywordsPage/Loadable';
import KeywordsEditPage from 'containers/KeywordsEditPage/Loadable';
import ActionPage from 'containers/ActionPage/Loadable';
import SettingsPage from 'containers/SettingsPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

function App() {
  return (
    <div>
      <AppHeader/>
      <AppContent>
        <Switch>
          <Route exact path='/' component={AgentsPage} />
          <Route exact path='/agent/:id' component={AgentPage} />
          <Route exact path='/agent/:id/sayings' component={SayingsPage} />
          <Route exact path='/agent/:id/keywords' component={KeywordsPage} />
          <Route exact path='/agent/:id/keyword/:keywordId' component={KeywordsEditPage} />
          <Route exact path='/agent/:id/action/:actionId' component={ActionPage} />
          <Route exact path='/settings' component={SettingsPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </AppContent>
    </div>
  );
}

export default App;
