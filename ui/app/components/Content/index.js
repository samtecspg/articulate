import React from 'react';

export function Content(props) {

  return (
    <section className="content-area">
      <div className="container">
        {React.Children.toArray(props.children)}
      </div>
    </section>
  );
}

Content.propTypes = {
  children: React.PropTypes.node,
};

export default Content;
