import React from 'react';
import { Input } from 'react-materialize';
import { connect } from 'react-redux';
import {
  browserHistory,
  Link,
} from 'react-router';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import {
  resetCurrentAgent,
  selectCurrentAgent,
} from '../../containers/App/actions';
import {
  makeSelectAgents,
  makeSelectCurrentAgent,
} from '../../containers/App/selectors';
import entity from '../../img/entity-icon.svg';
import folder from '../../img/folder-icon.svg';
import intent from '../../img/intent-icon.svg';
import logo from '../../img/logo.svg';
import settings from '../../img/settings-icon.svg';
import webhook from '../../img/webhook-icon.svg';
import messages from './messages';

class NavSideBar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.renderAgentSelectOptions = this.renderAgentSelectOptions.bind(this);
    this.onSelectAgent = this.onSelectAgent.bind(this);
  }

  onSelectAgent(evt) {
    const agentId = evt.target.value;
    if (agentId !== '-1') {
      const agent = this.props.agents.find((a) => a.id === agentId);
      this.props.onChangeCurrentAgent(agent);
      browserHistory.push(`/agent/${agent.id}`);
    } else {
      this.props.onChangeCurrentAgent(false);
    }
  }

  renderAgentSelectOptions(options) {
    return options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.text}
      </option>
    ));
  }

  render() {
    const { agents, currentAgent } = this.props;
    let agentsSelect = [];
    if (agents !== false) {
      const defaultOption = { value: -1, text: messages.agentDropDownDefault.defaultMessage, disabled: 'disabled' };
      agentsSelect = agents.map((agent) => ({
        value: agent.id,
        text: agent.agentName,
      }));
      agentsSelect.unshift(defaultOption);
    }
    return (
      <aside id="side-nav">
        <Link id="logo" to="/"><img src={logo} alt="NLU Logo" /></Link>
        <nav>
          <ul className="primary-nav">
            <li className="btn-agent">
              <div hidden={agents && agents.length === 0}>
                <Input
                  s={12}
                  name="agent"
                  type="select"
                  value={currentAgent ? currentAgent.id.toString() : '-1'}
                  onChange={this.onSelectAgent}
                >{this.renderAgentSelectOptions(agentsSelect)}</Input>
              </div>
              <Link to="/agents/create" activeClassName={'selected'}><span>+ Create Agent</span></Link>
            </li>
            <li>
              <Link to="/domains" activeClassName={'selected'}><img src={folder} alt="" /><span>Domains</span></Link>
            </li>
            <li>
              <div className="divider" />
            </li>
            <li>
              <Link to="/intents" activeClassName={'selected'}><img src={intent} alt="" /><span>Intents</span></Link>
            </li>
            <li>
              <Link to="/entities" activeClassName={'selected'}><img src={entity} alt="" /><span>Entity</span></Link>
            </li>
            <li>
              <div className="divider" />
            </li>
            <li>
              <Link to="/webhooks/create" activeClassName={'selected'}><img src={webhook} alt="" /><span>Webhooks</span></Link>
            </li>
          </ul>

          <ul className="bottom-nav">
            <li>
              <Link to="" activeClassName={'selected'}><img src={settings} alt="/settings" /><span>Settings</span></Link>
            </li>
          </ul>
        </nav>
      </aside>
    )
      ;
  }
}

NavSideBar.propTypes = {
  agents: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onChangeCurrentAgent: React.PropTypes.func,
  onChangeUrl: React.PropTypes.func,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeCurrentAgent: (agent) => {
      return agent ? dispatch(selectCurrentAgent(agent)) : dispatch(resetCurrentAgent());
    },
    onChangeUrl: (url) => dispatch(push(url)),
  };
}

const mapStateToProps = createStructuredSelector({
  agents: makeSelectAgents(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavSideBar);
