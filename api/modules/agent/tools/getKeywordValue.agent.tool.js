'use strict';

module.exports = (recognizedKeyword, userText) => {

    let value;
    switch (recognizedKeyword.keyword){

        case 'sys.duckling_time':
            value = {
                from : recognizedKeyword.value.from.value,
                to: recognizedKeyword.value.to.value
            };
            break;
        case 'sys.duckling_distance':
        case 'sys.duckling_temperature':
        case 'sys.duckling_volume':
            value = {
                value : recognizedKeyword.value.value,
                unit: recognizedKeyword.value.unit
            };
            break;
        case 'sys.duckling_duration':
            value = {
                value : recognizedKeyword.value.value,
                unit: recognizedKeyword.value.unit,
                normalized: {
                    value: recognizedKeyword.value.normalized.value,
                    unit: recognizedKeyword.value.normalized.unit
                }
            };
            break;
        case 'sys.duckling_quantity':
            value = {
                value : recognizedKeyword.value.value,
                unit: recognizedKeyword.value.unit,
                product: recognizedKeyword.value.product
            };
            break;
        case 'sys.duckling_url':
            value = {
                value : recognizedKeyword.value.value,
                domain: recognizedKeyword.value.domain
            };
            break;
        default:
            value = {
                value: recognizedKeyword.value.value
            };
            break;
    };
    value.original = userText.substring(recognizedKeyword.start, recognizedKeyword.end);
    return value;
};
