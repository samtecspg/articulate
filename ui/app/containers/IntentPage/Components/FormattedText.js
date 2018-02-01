import React from 'react';

export function FormattedText(props) {
  const entity = props.entities.length > 0 ? props.entities.splice(0, 1)[0] : null;
  let formattedElement = null;
  if (entity) {
    const start = +entity.start;
    const end = +entity.end;
    const lastStart = +props.lastStart;
    const beforeTaggedText = props.text.substring(0, start - lastStart);
    const taggedText = props.text.substring(start - lastStart, end - lastStart);
    const afterTaggedText = props.text.substring(end - lastStart, props.text.length);
    let highlightColor = props.dirOfColors[entity.entity];
    formattedElement = (
      <span key={`entityTag_${props.entityIndex}`}>
        <span key={`beforeEntityTagText_${props.entityIndex}`}>{beforeTaggedText}</span>
        <span key={`entityTagText_${props.entityIndex}`} style={{ backgroundColor: highlightColor, color: 'white' }}>{taggedText}</span>
        <FormattedText entities={props.entities} text={afterTaggedText} entityIndex={props.entityIndex + 1} lastStart={end} dirOfColors={props.dirOfColors} />
      </span>
    );
  } else {
    formattedElement = (
      <span key={`entityTag_${props.entityIndex}`}>
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
};

export default FormattedText;
