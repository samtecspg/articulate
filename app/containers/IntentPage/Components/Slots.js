import React from 'react';
import SlotsRows from './SlotsRows';

export function Slots(props) {

    return <SlotsRows 
        examples={props.examples}
        onRemoveExample={props.onRemoveExample}
        onTagEntity={props.onTagEntity} 
        agentEntities={props.agentEntities}
        colorArray={props.colorArray}
        dirOfColors={props.dirOfColors}
    />;
}

Slots.propTypes = {
    slots: React.PropTypes.array,
    onCheckboxChange: React.PropTypes.func,
    onAddTextPrompt: React.PropTypes.func,
    onDeleteTextPrompt: React.PropTypes.func,
    agentEntities: React.PropTypes.array,
    dirOfColors: React.PropTypes.object,
    colorArray: React.PropTypes.array,
};

export default Slots;
