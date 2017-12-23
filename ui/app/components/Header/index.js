import React from 'react';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <header style={{position: 'fixed'}} className="valign-wrapper">
        <div className="nav-wrapper">
          <div className="col s12 ">
            <a href="#!" className="breadcrumb">First</a>
            <a href="#!" className="breadcrumb">Second</a>
            <a href="#!" className="breadcrumb">Third</a>
            <a href="#!" className="breadcrumb">Forth</a>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
