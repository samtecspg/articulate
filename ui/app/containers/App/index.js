import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
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

  componentDidMount() {
    this.props.onComponentMounting();
  }

  render() {
    const { agents, children } = this.props;
    return (
      <div>
        <NavSideBar agents={agents} />
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
  return {
    onComponentMounting: () => {
      dispatch(loadAgents());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  agents: makeSelectAgents(),
});

export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));

