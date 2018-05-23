import React from 'react';
import { Link, } from 'react-router';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {

    const { breadcrumbs, actionButtons } = this.props;

    return (
      <header style={{ position: 'fixed', width: 'calc(100% - 500px)' }} className="valign-wrapper">
        <div className="nav-wrapper">
          <div className="col s12 ">
            {
              breadcrumbs.map((breadcrumb, index) => {
                if (breadcrumb.link) {
                  return <Link key={`breadcrumb-${index}`} to={breadcrumb.link} className="breadcrumb"><span>{breadcrumb.label}</span></Link>;
                }
                else {
                  return <span key={`breadcrumb-${index}`} className="breadcrumb">{breadcrumb.label}</span>;
                }
              })
            }
          </div>
          {actionButtons}
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  breadcrumbs: React.PropTypes.array.isRequired,
  actionButtons: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
  ]),
};

Header.defaultProps = {
  actionButtons: [],
}

export default Header;
