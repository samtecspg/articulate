import React from 'react';
import { Icon, } from 'react-materialize';

export function ResponsesRows(props) {

  const rows = props.fallbackResponses.map((response, responseIndex) => {
    return (
      <tr style={{ width: '100%' }} key={responseIndex}>
        <td style={{ width: '100%', display: 'inline-block' }}>
          <div>
            <span id={'intentResponse_' + responseIndex}>{response}</span>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <tbody>
    {rows}
    </tbody>
  );
}

ResponsesRows.propTypes = {
  fallbackResponses: React.PropTypes.array,
};

export default ResponsesRows;
