import React from 'react';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {

    const { breadcrumbs } = this.props;

    return (
      <header style={{position: 'fixed'}} className="valign-wrapper">
        <div className="nav-wrapper">
          <div className="col s12 ">
            {
              breadcrumbs.map( (breadcrumb, index) => {
                if (breadcrumb.link){
                  return <a key={`breadcrumb-${index}`} href={breadcrumb.link} className="breadcrumb">{breadcrumb.label}</a>
                }
                else {
                  return <a key={`breadcrumb-${index}`} href='#' className="breadcrumb">{breadcrumb.label}</a>
                }
              })
            }
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  breadcrumbs: React.PropTypes.array.isRequired,
};

export default Header;
