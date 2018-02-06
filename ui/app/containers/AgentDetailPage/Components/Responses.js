import React from 'react';
import ResponsesRows from './ResponsesRows';

export function Responses(props) {

  return <ResponsesRows
    fallbackResponses={props.fallbackResponses}
  />;
}

Responses.propTypes = {
  fallbackResponses: React.PropTypes.array,
};

export default Responses;
