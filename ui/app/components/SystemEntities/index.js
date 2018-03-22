import React from 'react';
import * as material from 'material-colors';
import {
  NavItem,
} from 'react-materialize';
import systemEntities from 'systemEntities';

function SystemEntities(userSays, onClickFunction) { // eslint-disable-line react/prefer-stateless-function

  const entitiesItems = systemEntities
    .map((systemEntity, systemEntityIndex) => {
      return (
        <NavItem
          onClick={userSays ?
            onClickFunction.bind(null, userSays, systemEntity) :
            onClickFunction.bind(null, systemEntity)}
          key={`sys.entity.${systemEntityIndex}`}
        >
          <span style={{ color: systemEntity.uiColor }}>
                        @{systemEntity.entityName}
          </span>
        </NavItem>
      );
    });

  return entitiesItems;
}

export default SystemEntities;
