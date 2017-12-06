import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import Row from '../Row';

function ContentHeader(props) { // eslint-disable-line react/prefer-stateless-function

  return (
    <Row>
      <header className="main-title">
        <h1>
          <FormattedMessage {...props.title} />
        </h1>
        <p>
          <FormattedMessage {...props.subTitle} />
        </p>
      </header>
    </Row>
  );
}

ContentHeader.propTypes = {
  title: PropTypes.object,
  subTitle: PropTypes.object,
};

export default ContentHeader;
