import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import Row from '../Row';

function ContentSubHeader(props) { // eslint-disable-line react/prefer-stateless-function

  return (
    <Row style={props.rowStyle}>
      <header className="sub-title">
        <h1>
          <FormattedMessage {...props.title} />
        </h1>
      </header>
    </Row>
  );
}

ContentSubHeader.propTypes = {
  title: PropTypes.object,
  subTitle: PropTypes.object,
  rowStyle: PropTypes.object
};

export default ContentSubHeader;
