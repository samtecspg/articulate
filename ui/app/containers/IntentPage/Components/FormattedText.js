import React from 'react';

export function FormattedText(props) {

    const entity = props.entities.length > 0 ? props.entities.splice(0,1)[0] : null;
    let formattedElement = null;
    if (entity) {
        const beforeTaggedText = props.text.substring(0, entity.start - props.lastStart);
        const taggedText = props.text.substring(entity.start - props.lastStart, entity.end - props.lastStart);
        const afterTaggedText = props.text.substring(entity.end - props.lastStart, props.text.length);
        let highlightColor = props.dirOfColors[entity.entity];
        if (!highlightColor){
            const randomColorIndex = Math.floor(Math.random() * props.colorArray.length);
            highlightColor = props.colorArray[randomColorIndex];
            props.colorArray.splice(randomColorIndex, 1);
        }
        formattedElement = (
            <span key={'entityTag_' + props.entityIndex}>
                <span key={'beforeEntityTagText_' + props.entityIndex}>{beforeTaggedText}</span>
                <span key={'entityTagText_' + props.entityIndex} style={{ backgroundColor: highlightColor, color: 'white'}}>{taggedText}</span>
                <FormattedText entities={props.entities} text={afterTaggedText} entityIndex={props.entityIndex + 1} lastStart={entity.end} dirOfColors={props.dirOfColors} colorArray={props.colorArray} />
            </span>
        );
    }
    else{
        formattedElement = (
            <span key={'entityTag_' + props.entityIndex}>
                {props.text}
            </span>
        );
    }

    return formattedElement;
}

FormattedText.propTypes = {
    entities: React.PropTypes.array,
    text: React.PropTypes.string,
    entityIndex: React.PropTypes.number,
    lastStart: React.PropTypes.number,
    dirOfColors: React.PropTypes.object,
    colorArray: React.PropTypes.array,
};

export default FormattedText;
