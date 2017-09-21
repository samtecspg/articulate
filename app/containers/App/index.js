import React from 'react';
//import normalizeCSS from 'stylesheets/normalize-min.css';

import NavSideBar from 'components/NavSideBar';
import ConversationBar from 'components/ConversationBar';
import withProgressBar from 'components/ProgressBar';

export function App(props) {
  
  return (
    <div>
      <NavSideBar />
      <main className="group" role="main">
        {React.Children.toArray(props.children)}
      </main>
      <ConversationBar/>
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default withProgressBar(App);
