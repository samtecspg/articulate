import React from 'react';

class Toggle extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
        <div className="switch">
            <label>
                Disable
                <input type="checkbox" />
                <span className="lever"></span>
                Enable
            </label>
        </div>
    );
  }
}

export default Toggle;