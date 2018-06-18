'use strict';

const IsBuffer = require('is-buffer');

const flatten = (target, opts) => {

    opts = opts || {};

    const delimiter = opts.delimiter || '.';
    const maxDepth = opts.maxDepth;
    const output = {};

    const step = (object, prev, currentDepth) => {

        currentDepth = currentDepth || 1;
        Object.keys(object).forEach((key) => {

            const value = object[key];
            const isarray = opts.safe && Array.isArray(value);
            const type = Object.prototype.toString.call(value);
            const isbuffer = IsBuffer(value);
            const isobject = (
                type === '[object Object]' ||
                type === '[object Array]'
            );

            const newKey = prev ?
                prev + delimiter + key :
                key;

            if (!isarray && !isbuffer && isobject && Object.keys(value).length &&
                (!opts.maxDepth || currentDepth < maxDepth)) {
                return step(value, newKey, currentDepth + 1);
            }

            output[newKey] = value;
        });
    };

    step(target);

    return output;
};

const unflatten = (target, opts) => {

    opts = opts || {};

    const delimiter = opts.delimiter || '.';
    const overwrite = opts.overwrite || false;

    const isbuffer = IsBuffer(target);
    if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
        return target;
    }

    // safely ensure that the key is
    // an integer.
    const getkey = (key) => {

        const parsedKey = Number(key);
        return (
                isNaN(parsedKey) ||
                key.indexOf('.') !== -1 ||
                opts.object
            ) ? key :
            parsedKey;
    };

    const sortedKeys = Object.keys(target).sort((keyA, keyB) => {

        return keyA.length - keyB.length;
    });

    //Try to parse every key to an integer. If the first char in the key name is a number the is an array
    const parsedKeys = Object.keys(target).map((key) => {

        return parseInt(key);
    });

    //If there exist a NaN that means the target is not an array
    const isArray = parsedKeys.filter((key) => {

        return isNaN(key);
    }).length === 0;

    const result = isArray ? [] : {};

    sortedKeys.forEach((key) => {

        const split = key.split(delimiter);
        let key1 = getkey(split.shift());
        let key2 = getkey(split[0]);
        let recipient = result;

        while (key2 !== undefined) {
            const type = Object.prototype.toString.call(recipient[key1]);
            const isobject = (
                type === '[object Object]' ||
                type === '[object Array]'
            );

            // do not write over falsey, non-undefined values if overwrite is false
            if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
                return;
            }

            if ((overwrite && !isobject) || (!overwrite && !recipient[key1])) {
                recipient[key1] = (
                    typeof key2 === 'number' &&
                    !opts.object ? [] : {}
                );
            }

            recipient = recipient[key1];
            if (split.length > 0) {
                key1 = getkey(split.shift());
                key2 = getkey(split[0]);
            }
        }

        // unflatten again for 'messy objects'
        recipient[key1] = unflatten(target[key], opts);
    });

    return result;
};

module.exports = flatten;
flatten.flatten = flatten;
flatten.unflatten = unflatten;
