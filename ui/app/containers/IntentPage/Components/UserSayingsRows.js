import React from 'react';
import { Icon, } from 'react-materialize';
import AgentEntities from './AgentEntities';
import FormattedText from './FormattedText';

const highlightEntity = (agentEntities, dropDownButtonId, setWindowSelection, e) => {
  if (agentEntities) {
    const dropDownButton = document.getElementById(dropDownButtonId);
    const selection = window.getSelection().toString();
    if (selection.length > 0) {
      setWindowSelection(selection);
      dropDownButton.dispatchEvent(new Event('click'));
    }
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
      const sortedEntities = [...value.entities].sort(compareEntities);
      formattedText = <FormattedText agentEntities={props.agentEntities} entities={sortedEntities} text={textValue} entityIndex={0} lastStart={0} />;
    }
    return (
      <tr style={{ width: '100%' }} key={valueIndex}>
        <td style={{ width: '100%', display: 'inline-block' }} onMouseUp={highlightEntity.bind(null, props.agentEntities, 'userSayingDropdown_' + valueIndex, props.setWindowSelection)}>
          <div>
            <span id={'userSaying_' + valueIndex}>{formattedText ? formattedText : textValue + ' '}</span>
            <AgentEntities
              index={valueIndex}
              agentEntities={props.agentEntities}
              userSays={textValue}
              onClickFunction={props.onTagEntity}
              createEntity={true}
            />
            <a onClick={props.onRemoveExample.bind(null, valueIndex)}>
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
  setWindowSelection: React.PropTypes.func,
  agentEntities: React.PropTypes.object,
};

export default UserSayingsRows;
