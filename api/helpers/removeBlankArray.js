'use strict';

module.exports = (object) => {

    Object.keys(object).forEach((key) => {

        if (Array.isArray(object[key]) && object[key].length === 0){
            object[key] = '';
        }
    });
    return object;
};
