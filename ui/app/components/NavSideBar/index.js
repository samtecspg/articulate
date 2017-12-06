import React from 'react';
import entity from '../../img/entity-icon.svg';
import folder from '../../img/folder-icon.svg';
import intent from '../../img/intent-icon.svg';
import logo from '../../img/logo.svg';
import settings from '../../img/settings-icon.svg';
import webhook from '../../img/webhook-icon.svg';

class NavSideBar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <aside id="side-nav">
        <a id="logo" href=""><img src={logo} alt="NLU Logo" /></a>
        <nav>
          <ul className="primary-nav">
            <li className="btn-agent">
              <a href="/agents/create"><span>+ Create Agent</span></a>
            </li>
            <li>
              <a href="/domains"><img src={folder} alt="" /><span>Domains</span></a>
            </li>
            <li>
              <div className="divider" />
            </li>
            <li>
              <a href="/intents"><img src={intent} alt="" /><span>Intents</span></a>
            </li>
            <li>
              <a href="/entities/create"><img src={entity} alt="" /><span>Entity</span></a>
            </li>
            <li>
              <div className="divider" />
            </li>
            <li>
              <a href="/webhooks/create"><img src={webhook} alt="" /><span>Webhooks</span></a>
            </li>
          </ul>

          <ul className="bottom-nav">
            <li>
              <a href=""><img src={settings} alt="/settings" /><span>Settings</span></a>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }
}

export default NavSideBar;
