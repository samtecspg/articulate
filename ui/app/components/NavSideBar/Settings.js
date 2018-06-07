import React, { Component } from 'react';
import settings from '../../img/settings-icon.svg';
import {
    Link,
  } from 'react-router';

class Settings extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        showOptions: false
    };

    onShowSettings = (evt) => {
        this.setState({
            showOptions: !this.state.showOptions
        })
    }

    render (){
        return (
            <li className="settings-link" onClick={this.onShowSettings}>
                <img src={settings} alt="" /><span>Settings</span>
                <ul className="sublinks" style={{display: this.state.showOptions ? 'block' : 'none'}}>
                    {this.props.options.map((option, optionIndex) => {
                        return (
                            <li className={'slide-in'} key={`option_${optionIndex}`}>
                                <Link to={option.href}>{option.label}</Link>
                            </li>
                        )
                    })}
                </ul>
            </li>
        );
    }
}

Settings.propTypes = {
  options: React.PropTypes.array,
};

export default Settings;
