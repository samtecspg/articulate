var React = require('react');
var Head = require('./includes/head.jsx');
var Foot = require('./includes/foot.jsx');

var Component = React.createClass({
  render: function() {
    return (
      <html>
        <Head />
        <body>
          {this.props.children}
          <Foot />
        </body>
      </html>
    );
  }
});

module.exports = Component;
