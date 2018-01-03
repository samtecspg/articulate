import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import NavSideBar from '../../components/NavSideBar';
import withProgressBar from '../../components/ProgressBar';
import { loadAgents } from '../../containers/App/actions';
import {
  makeSelectAgents,
  makeSelectError,
  makeSelectLoading,
} from '../../containers/App/selectors';
import ConversationBar from '../ConversationBar';

// import normalizeCSS from 'stylesheets/normalize-min.css';

export class App extends React.PureComponent {

  render() {
    const { agents, children } = this.props;
    return (
      <div>
        <Alert stack={false} timeout={3000} />
        <NavSideBar />
        <main className="group" role="main">
          {React.Children.toArray(children)}
        </main>
        <ConversationBar />
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
  agents: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onComponentMounting: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {};
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agents: makeSelectAgents(),
});

export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));

