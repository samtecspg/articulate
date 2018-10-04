'use strict';

module.exports = (recognizedEntity, userText) => {

    let value;
    switch (recognizedEntity.entity){

        case 'sys.duckling_time':
            value = {
                from : recognizedEntity.value.from.value,
                to: recognizedEntity.value.to.value
            };
            break;
        case 'sys.duckling_distance':
        case 'sys.duckling_temperature':
        case 'sys.duckling_volume':
            value = {
                value : recognizedEntity.value.value,
                unit: recognizedEntity.value.unit
            };
            break;
        case 'sys.duckling_duration':
            value = {
                value : recognizedEntity.value.value,
                unit: recognizedEntity.value.unit,
                normalized: {
                    value: recognizedEntity.value.normalized.value,
                    unit: recognizedEntity.value.normalized.unit
                }
            };
            break;
        case 'sys.duckling_quantity':
            value = {
                value : recognizedEntity.value.value,
                unit: recognizedEntity.value.unit,
                product: recognizedEntity.value.product
            };
            break;
        case 'sys.duckling_url':
            value = {
                value : recognizedEntity.value.value,
                domain: recognizedEntity.value.domain
            };
            break;
        default:
            value = {
                value: recognizedEntity.value.value
            };
            break;
    };
    if (recognizedEntity.start && recognizedEntity.end){
        value.original = userText.substring(recognizedEntity.start, recognizedEntity.end);
    }
    else {
        value.original = value.value;
    }
    return value;
};
