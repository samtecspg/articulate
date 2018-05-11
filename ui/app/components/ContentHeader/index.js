import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import Row from '../Row';

function ContentHeader(props) { // eslint-disable-line react/prefer-stateless-function

  return (
    <Row>
      <header style={props.headerStyle} className="main-title">
        <h1>
          <FormattedMessage {...props.title} />
        </h1>
        <p>
          <FormattedMessage {...props.subTitle} />
        </p>
        { props.children }
      </header>
    </Row>
  );
}

ContentHeader.propTypes = {
  children: PropTypes.node,
  title: PropTypes.object,
  subTitle: PropTypes.object,
  headerStyle: PropTypes.object,
};

ContentHeader.defaultProps = {
  headerStyle: {},
}

export default ContentHeader;
