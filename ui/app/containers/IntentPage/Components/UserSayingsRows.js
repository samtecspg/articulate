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
    if (!value.entities){
      value.entities = [];
    }
    const entities = _.cloneDeep(value.entities);
    const regexEntitiesDefinedAsSlot = props.agentEntities.entities.filter((ent) => {

      return ent.type === 'regex' && props.slots.filter((slot) => {

        return slot.entity === ent.entityName;
      }).length > 0
    });
    if (entities.length > 0 || regexEntitiesDefinedAsSlot.length > 0) {

      regexEntitiesDefinedAsSlot.forEach((regexEntity) => {

        const entityName = regexEntity.entityName;
        regexEntity.examples.forEach((regexExample) => {

          const entityValue = regexExample.value;

          if (regexExample.synonyms.indexOf(entityValue) < 0) {
            regexExample.synonyms.push(entityValue);
          }
          regexExample.synonyms.forEach((syn) => {

            const regexToTest = new RegExp(syn, 'i');
            if (regexToTest.test(textValue)) {
              const resultParsed = regexToTest.exec(textValue);
              const startIndex = textValue.indexOf(resultParsed[0]);
              const endIndex = startIndex + resultParsed[0].length;
              const resultToSend = { value: resultParsed[0], entity: entityName, start: startIndex, end: endIndex };
              entities.push(_.cloneDeep(resultToSend));
            }
          });
        })
      });
      const sortedEntities = [...entities].sort(compareEntities);
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
            <a onClick={props.onRemoveExample.bind(null, props.page * props.defaultPageSize + valueIndex)}>
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
  page: React.PropTypes.number,
  defaultPageSize: React.PropTypes.number,
  examples: React.PropTypes.array,
  onRemoveExample: React.PropTypes.func,
  onTagEntity: React.PropTypes.func,
  setWindowSelection: React.PropTypes.func,
  agentEntities: React.PropTypes.object,
  slots: React.PropTypes.array
};

export default UserSayingsRows;
