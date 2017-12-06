import React from 'react';
import ResponsesRows from './ResponsesRows';

export function Responses(props) {

  return <ResponsesRows
    intentResponses={props.intentResponses}
    onRemoveResponse={props.onRemoveResponse}
  />;
}

Responses.propTypes = {
  intentResponses: React.PropTypes.array,
  onRemoveResponse: React.PropTypes.func,
};

export default Responses;
