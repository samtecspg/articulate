import React from 'react';
import { Icon, } from 'react-materialize';
import AgentEntities from './AgentEntities';
import FormattedText from './FormattedText';

const highlightEntity = (agentEntities, dropDownButtonId, e) => {
  if (agentEntities) {
    const dropDownButton = document.getElementById(dropDownButtonId);
    dropDownButton.dispatchEvent(new Event('click'));
  }
};

function compareEntities(a, b) {
  if (a.start < b.start)
    return -1;
  if (a.start > b.start)
    return 1;
  return 0;
}

export function UserSayingsRows(props) {

  const rows = props.examples.map((value, valueIndex) => {
    const textValue = value['userSays'];
    let formattedText = null;
    if (value.entities.length > 0) {
      const sortedEntities = value.entities.sort(compareEntities);
      formattedText = <FormattedText entities={sortedEntities} text={textValue} entityIndex={0} lastStart={0} dirOfColors={props.dirOfColors} />;
    }
    return (
      <tr style={{ width: '100%' }} key={valueIndex}>
        <td style={{ width: '100%', display: 'inline-block' }}>
          <div>
            <span id={'userSaying_' + valueIndex} onMouseUp={highlightEntity.bind(null, props.agentEntities, 'userSayingDropdown_' + valueIndex)}>{formattedText ? formattedText : textValue}</span>
            <AgentEntities
              index={valueIndex}
              agentEntities={props.agentEntities}
              userSays={textValue}
              onClickFunction={props.onTagEntity}
              dirOfColors={props.dirOfColors}
              createEntity={true}
            />
            <a onClick={props.onRemoveExample.bind(null, textValue)}>
              <Icon className="table-delete-row">delete</Icon>
            </a>
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

UserSayingsRows.propTypes = {
  examples: React.PropTypes.array,
  onRemoveExample: React.PropTypes.func,
  onTagEntity: React.PropTypes.func,
  agentEntities: React.PropTypes.array,
  dirOfColors: React.PropTypes.object,
};

export default UserSayingsRows;
