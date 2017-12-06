import NavSideBar from 'components/NavSideBar';
import withProgressBar from 'components/ProgressBar';
import React from 'react';
import ConversationBar from '../ConversationBar';

// import normalizeCSS from 'stylesheets/normalize-min.css';

export function App(props) {

  return (
    <div>
      <NavSideBar />
      <main className="group" role="main">
        {React.Children.toArray(props.children)}
      </main>
      <ConversationBar />
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default withProgressBar(App);
