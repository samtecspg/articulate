import React from 'react';
import ResponsesRows from './ResponsesRows';

export function Responses(props) {

  return <ResponsesRows
    fallbackResponses={props.fallbackResponses}
    onRemoveResponse={props.onRemoveResponse}
  />;
}

Responses.propTypes = {
  fallbackResponses: React.PropTypes.array,
  onRemoveResponse: React.PropTypes.func,
};

export default Responses;
