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
    if (!value.entities) {
      value.entities = [];
    }
    const entities = _.cloneDeep(value.entities);
    let regexEntityIsList = [];
    const regexEntitiesDefinedAsSlot = props.agentEntities.entities.filter((ent) => {

      return ent.type === 'regex' && props.slots.filter((slot) => {
        if (slot.entity === ent.entityName && ent.type === 'regex' && slot.isList) {
          regexEntityIsList.push(ent.entityName);
        }
        return slot.entity === ent.entityName;
      }).length > 0
    });
    if (entities.length > 0 || regexEntitiesDefinedAsSlot.length > 0) {
      regexEntitiesDefinedAsSlot.forEach((regexEntity) => {

        const entityName = regexEntity.entityName;
        let entityIsList = regexEntityIsList.indexOf(entityName) >= 0;
        let lastRegexMatch;
        let indexLastMatch = 0;
        regexEntity.examples.forEach((regexExample) => {

          const entityValue = regexExample.value;

          if (regexExample.synonyms.indexOf(entityValue) < 0) {
            regexExample.synonyms.push(entityValue);
          }
          regexExample.synonyms.forEach((syn) => {

            let regexToTest = null; // re intialize the regex as it has been defined globally
            let match;
            regexToTest = new RegExp(syn, 'ig');
            match = regexToTest.exec(textValue)
            while (match !==null) {
              const startIndex = match.index;
              const endIndex = startIndex + match[0].length;
              const resultToSend = { value: match[0], entity: entityName, start: startIndex, end: endIndex };
              match = regexToTest.exec(textValue);
              if (entityIsList) {
                entities.push(_.cloneDeep(resultToSend));
              }
              if (match === null && startIndex >= indexLastMatch){ //save the last match to use it if slot is not a list
                lastRegexMatch = _.cloneDeep(resultToSend);
                indexLastMatch = startIndex;
              }
            }
          });
        })
         if (!entityIsList){
          //this is the last match kept int user saying row
          entities.push(_.cloneDeep(lastRegexMatch));
        }
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
