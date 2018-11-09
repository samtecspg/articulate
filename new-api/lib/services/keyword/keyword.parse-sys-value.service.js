import {
    DUCKLING_DISTANCE,
    DUCKLING_DURATION,
    DUCKLING_QUANTITY,
    DUCKLING_TEMPERATURE,
    DUCKLING_TIME,
    DUCKLING_URL,
    DUCKLING_VOLUME,
    KEYWORD_PREFIX_SYS
} from '../../../util/constants';

module.exports = ({ keyword, text }) => {

    let value;
    switch (keyword.keyword) {

        case `${KEYWORD_PREFIX_SYS}${DUCKLING_TIME}`:
            value = {
                from: keyword.value.from.value,
                to: keyword.value.to.value
            };
            break;
        case `${KEYWORD_PREFIX_SYS}${DUCKLING_DISTANCE}`:
        case `${KEYWORD_PREFIX_SYS}${DUCKLING_TEMPERATURE}`:
        case `${KEYWORD_PREFIX_SYS}${DUCKLING_VOLUME}`:
            value = {
                value: keyword.value.value,
                unit: keyword.value.unit
            };
            break;
        case `${KEYWORD_PREFIX_SYS}${DUCKLING_DURATION}`:
            value = {
                value: keyword.value.value,
                unit: keyword.value.unit,
                normalized: {
                    value: keyword.value.normalized.value,
                    unit: keyword.value.normalized.unit
                }
            };
            break;
        case `${KEYWORD_PREFIX_SYS}${DUCKLING_QUANTITY}`:
            value = {
                value: keyword.value.value,
                unit: keyword.value.unit,
                product: keyword.value.product
            };
            break;
        case `${KEYWORD_PREFIX_SYS}${DUCKLING_URL}`:
            value = {
                value: keyword.value.value,
                domain: keyword.value.domain
            };
            break;
        default:
            value = {
                value: keyword.value.value
            };
            break;
    }
    value.original = text.substring(keyword.start, keyword.end);
    return value;
};
