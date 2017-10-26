'use strict';

// Load modules

const Tty = require('tty');
const Hoek = require('hoek');
const Joi = require('joi');

const Schemas = require('./schemas');

// Declare internals

const internals = {};


exports.parse = function (definition, options) {

    Joi.assert(definition, Schemas.definition, 'Invalid definition:');
    Joi.assert(options, Schemas.parseOptions, 'Invalid options argument:');

    const flags = {};
    const keys = {};
    definition = Joi.validate(definition, Schemas.definition).value;
    options = options || {};

    const names = Object.keys(definition);
    for (let i = 0; i < names.length; ++i) {
        const name = names[i];
        const def = Hoek.clone(definition[name]);
        def.name = name;
        keys[name] = def;
        if (def.alias) {
            for (let j = 0; j < def.alias.length; ++j) {
                keys[def.alias[j]] = def;
            }
        }

        if (def.type === 'boolean' && def.default !== undefined) {
            flags[name] = def.default;
        }
        else if (def.type === 'boolean') {
            flags[name] = false;
        }
    }

    const args = options.argv || process.argv.slice(2);
    let last = null;
    const errors = [];
    let help = false;

    for (let i = 0; i < args.length; ++i) {
        const arg = args[i];
        if (arg[0] === '-') {

            // Key

            const char = arg[1];
            if (!char) {
                errors.push(internals.formatError('Invalid empty \'-\' option'));
                continue;
            }

            if (char === '-' && arg.length <= 2) {
                errors.push(internals.formatError('Invalid empty \'--\' option'));
                continue;
            }

            const opts = (char === '-' ? [arg.slice(2)] : arg.slice(1).split(''));
            for (let j = 0; j < opts.length; ++j) {

                if (last) {
                    errors.push(internals.formatError('Invalid option:', last.name, 'missing value'));
                    continue;
                }

                const opt = opts[j];
                const def = keys[opt];
                if (!def) {
                    errors.push(internals.formatError('Unknown option:', opt));
                    continue;
                }

                if (def.type === 'help') {
                    flags[def.name] = true;
                    help = true;
                }
                else if (def.type === 'boolean') {
                    flags[def.name] = true;
                }
                else if (def.type === 'number' && opts.length > 1) {
                    args.splice(i + 1, 0, arg.split(char)[1]);
                    last = def;
                    break;
                }
                else {
                    last = def;
                }
            }
        }
        else {

            // Value

            let value = arg;
            if (last &&
                last.type) {

                if (last.type === 'number') {
                    value = parseInt(arg, 10);

                    if (!Hoek.isInteger(value)) {
                        errors.push(internals.formatError('Invalid value (non-number) for option:', last.name));
                        continue;
                    }
                }
            }

            if (last &&
                last.valid &&
                last.valid.indexOf(value) === -1) {

                const validValues = [];
                for (let j = 0; j < last.valid.length; ++j) {
                    const valid = last.valid[j];
                    validValues.push(`'${valid}'`);
                }
                errors.push(internals.formatError('Invalid value for option:', last.name, '(valid: ' + validValues.join(',') + ')'));
                continue;
            }

            const name = last ? last.name : '_';
            if (flags.hasOwnProperty(name)) {

                if (!last ||
                    last.multiple) {

                    flags[name].push(value);
                }
                else {
                    errors.push(internals.formatError('Multiple values are not allowed for option:', name));
                    continue;
                }
            }
            else {

                if (!last ||
                    last.multiple) {

                    flags[name] = [].concat(value);
                }
                else {
                    flags[name] = value;
                }
            }

            last = null;
        }
    }

    for (let i = 0; i < names.length; ++i) {
        const def = keys[names[i]];
        if (def.type === 'range') {
            internals.parseRange(def, flags);
        }

        if (flags[def.name] === undefined) {
            flags[def.name] = def.default;
        }

        if (def.require && flags[def.name] === undefined) {
            errors.push(internals.formatError(definition));
        }

        if (def.alias) {
            for (let j = 0; j < def.alias.length; ++j) {
                const alias = def.alias[j];
                flags[alias] = flags[def.name];
            }
        }
    }

    if (errors.length && !help) {
        return errors[0];
    }

    return flags;
};


exports.usage = function (definition, usage, options) {

    if ((arguments.length === 2) && (typeof usage === 'object')) {
        options = usage;
        usage = '';
    }

    Joi.assert(definition, Schemas.definition, 'Invalid definition:');
    Joi.assert(options, Schemas.usageOptions, 'Invalid options argument:');

    definition = Joi.validate(definition, Schemas.definition).value;
    options = Joi.validate(options || { colors: null }, Schemas.usageOptions).value;
    const color = internals.colors(options.colors);
    const output = usage ? 'Usage: ' + usage + '\n\n' : '\n';
    const col1 = ['Options:'];
    const col2 = ['\n'];

    const names = Object.keys(definition);
    for (let i = 0; i < names.length; ++i) {
        const name = names[i];
        const def = definition[name];

        let shortName = internals.getShortName(name, def.alias);
        let longName = (shortName === name) ? def.alias : name;
        if (shortName.length > 1 && !longName) {
            longName = shortName;
            shortName = '';
        }

        let formattedName = shortName ? '  -' + shortName : '';
        if (longName) {
            const aliases = [].concat(longName);
            for (let j = 0; j < aliases.length; ++j) {
                formattedName += shortName ? ', ' : '  ';
                formattedName += '--' + aliases[j];
            }
        }

        let formattedDesc = def.description ? color.gray(def.description) : '';
        if (def.default) {
            formattedDesc += formattedDesc.length ? ' ' : '';
            formattedDesc += color.gray('(' + def.default + ')');
        }
        if (def.require) {
            formattedDesc += formattedDesc.length ? ' ' : '';
            formattedDesc += color.yellow('(required)');
        }

        col1.push(color.green(formattedName));
        col2.push(formattedDesc);
    }

    return output + internals.formatColumns(col1, col2);
};


internals.formatError = function (definition) {

    let msg = '';
    if (arguments.length > 1) {
        msg = Array.prototype.slice.call(arguments, 0).join(' ');
    }
    else if (typeof definition === 'string') {
        msg = definition;
    }
    else {
        msg = exports.usage(definition);
    }

    return new Error(msg);
};


internals.getShortName = function (shortName, aliases) {

    if (!aliases) {
        return shortName;
    }

    for (let i = 0; i < aliases.length; ++i) {
        if (aliases[i] && aliases[i].length < shortName.length) {
            shortName = aliases[i];
        }
    }

    return shortName;
};


internals.formatColumns = function (col1, col2) {

    const rows = [];
    let col1Width = 0;
    col1.forEach((text) => {

        if (text.length > col1Width) {
            col1Width = text.length;
        }
    });

    for (let i = 0; i < col1.length; ++i) {
        let row = col1[i];
        const padding = new Array((col1Width - row.length) + 5).join(' ');

        row += padding + col2[i];
        rows.push(row);
    }

    return rows.join('\n');
};


internals.parseRange = function (def, flags) {

    const value = flags[def.name];
    if (!value) {
        return;
    }

    const values = [];
    const nums = [].concat(value).join(',');
    const ranges = nums.match(/(?:\d+\-\d+)|(?:\d+)/g);
    for (let i = 0; i < ranges.length; ++i) {
        let range = ranges[i];

        range = range.split('-');
        const from = parseInt(range[0], 10);
        if (range.length === 2) {
            const to = parseInt(range[1], 10);
            if (from > to) {
                for (let j = from; j >= to; --j) {
                    values.push(j);
                }
            }
            else {
                for (let j = from; j <= to; ++j) {
                    values.push(j);
                }
            }
        }
        else {
            values.push(from);
        }
    }

    flags[def.name] = values;
};


internals.colors = function (enabled) {

    if (enabled === null) {
        enabled = Tty.isatty(1) && Tty.isatty(2);
    }

    const codes = {
        'black': 0,
        'gray': 90,
        'red': 31,
        'green': 32,
        'yellow': 33,
        'magenta': 35,
        'redBg': 41,
        'greenBg': 42
    };

    const colors = {};
    const names = Object.keys(codes);
    for (let i = 0; i < names.length; ++i) {
        const name = names[i];
        colors[name] = internals.color(name, codes[name], enabled);
    }

    return colors;
};


internals.color = function (name, code, enabled) {

    if (enabled) {
        const color = '\u001b[' + code + 'm';
        return function colorFormat(text) {

            return color + text + '\u001b[0m';
        };
    }

    return function plainFormat(text) {

        return text;
    };
};
