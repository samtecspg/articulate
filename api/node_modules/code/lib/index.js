'use strict';

// Load modules

const NodeUtil = require('util');
const Hoek = require('hoek');


// Declare internals

const internals = {
    flags: ['not', 'once', 'only', 'part', 'shallow'],
    grammar: ['a', 'an', 'and', 'at', 'be', 'have', 'in', 'to'],
    locations: {},
    count: 0
};


exports.settings = {
    truncateMessages: false,
    comparePrototypes: false
};


exports.expect = function (value, prefix) {

    const at = exports.thrownAt();
    const location = at.filename + ':' + at.line + '.' + at.column;
    internals.locations[location] = true;
    ++internals.count;
    return new internals.Assertion(value, prefix, location);
};


exports.fail = function (message) {

    throw new Error(message);
};


exports.incomplete = function () {

    const locations = Object.keys(internals.locations);
    return locations.length ? locations : null;
};


exports.count = function () {

    return internals.count;
};


internals.Assertion = function (ref, prefix, location) {

    this._ref = ref;
    this._prefix = prefix || '';
    this._location = location;
    this._flags = {};
};


internals.filterLocal = function (line) {

    return line.indexOf(__dirname) === -1;
};


internals.Assertion.prototype.assert = function (result, verb, actual, expected) {

    delete internals.locations[this._location];

    if (this._flags.not ? !result : result) {
        this._flags = {};
        return this;
    }

    if (verb === 'exist' &&
        this._flags.not &&
        this._ref instanceof Error) {

        const original = this._ref;
        original.at = exports.thrownAt();

        throw original;
    }

    let message = '';

    if (this._prefix) {
        message += this._prefix + ': ';
    }

    message += 'Expected ' + internals.display(this._ref) + ' to ';

    if (this._flags.not) {
        message += 'not ';
    }

    message += verb;

    if (this._flags.once) {
        message += ' once';
    }

    if (arguments.length === 3) {           // 'actual' without 'expected'
        message += ' but got ' + internals.display(actual);
    }

    const error = new Error(message);
    Error.captureStackTrace(error, this.assert);
    error.actual = actual;
    error.expected = expected;
    error.at = exports.thrownAt(error);
    throw error;
};


internals.flags.forEach((word) => {

    Object.defineProperty(internals.Assertion.prototype, word, {
        get: function () {

            this._flags[word] = !this._flags[word];
            return this;
        },
        configurable: true
    });
});


internals.grammar.forEach((word) => {

    Object.defineProperty(internals.Assertion.prototype, word, {
        get: function () {

            return this;
        },
        configurable: true
    });
});


internals.addMethod = function (names, fn) {

    const method = function (name) {

        internals.Assertion.prototype[name] = fn;
    };

    names = [].concat(names);
    names.forEach(method);
};


['arguments', 'array', 'boolean', 'buffer', 'date', 'function', 'number', 'regexp', 'string', 'object'].forEach((word) => {

    const article = ['a', 'e', 'i', 'o', 'u'].indexOf(word[0]) !== -1 ? 'an ' : 'a ';
    const method = function () {

        const type = internals.type(this._ref);
        return this.assert(type === word, 'be ' + article + word, type);
    };

    internals.addMethod(word, method);
});

internals.addMethod('error', function (/*type, message*/) {

    const type = arguments.length && typeof arguments[0] !== 'string' && !(arguments[0] instanceof RegExp) ? arguments[0] : Error;
    const lastArg = arguments[1] || arguments[0];
    const message = typeof lastArg === 'string' || lastArg instanceof RegExp ? lastArg : null;
    const err = this._ref;

    if (!this._flags.not || message === null) {
        this.assert(err instanceof type, 'be an error with ' + (type.name || 'provided') + ' type');
    }

    if (message !== null) {
        const error = err.message || '';
        this.assert(typeof message === 'string' ? error === message : error.match(message), 'be an error with specified message', error, message);
    }
});


[true, false, null, undefined].forEach((value) => {

    const name = NodeUtil.inspect(value);
    const method = function () {

        return this.assert(this._ref === value, 'be ' + name);
    };

    internals.addMethod(name, method);
});


internals.nan = function () {

    return this.assert(Number.isNaN(this._ref), 'be NaN');
};

internals.addMethod('NaN', internals.nan);


internals.include = function (value) {

    internals.assert(this, arguments.length === 1, 'Can only assert include with a single parameter');

    this._flags.deep = !this._flags.shallow;
    this._flags.part = this._flags.hasOwnProperty('part') ? this._flags.part : false;
    return this.assert(Hoek.contain(this._ref, value, this._flags), 'include ' + internals.display(value));
};

internals.addMethod(['include', 'includes', 'contain', 'contains'], internals.include);


internals.endWith = function (value) {

    internals.assert(this, typeof this._ref === 'string' && typeof value === 'string', 'Can only assert endsWith on a string, with a string');

    const comparator = this._ref.slice(-value.length);
    return this.assert(comparator === value, 'endWith ' + internals.display(value));
};

internals.addMethod(['endWith', 'endsWith'], internals.endWith);


internals.startWith = function (value) {

    internals.assert(this, typeof this._ref === 'string' && typeof value === 'string', 'Can only assert startsWith on a string, with a string');

    const comparator = this._ref.slice(0, value.length);
    return this.assert(comparator === value, 'startWith ' + internals.display(value));
};

internals.addMethod(['startWith', 'startsWith'], internals.startWith);


internals.exist = function () {

    return this.assert(this._ref !== null && this._ref !== undefined, 'exist');
};

internals.addMethod(['exist', 'exists'], internals.exist);


internals.empty = function () {

    internals.assert(this, typeof this._ref === 'object' || typeof this._ref === 'string', 'Can only assert empty on object, array or string');

    const length = this._ref.length !== undefined ? this._ref.length : Object.keys(this._ref).length;
    return this.assert(!length, 'be empty');
};

internals.addMethod('empty', internals.empty);


internals.length = function (size) {

    internals.assert(this, typeof this._ref === 'object' || typeof this._ref === 'string', 'Can only assert empty on object, array or string');

    const length = this._ref.length !== undefined ? this._ref.length : Object.keys(this._ref).length;
    return this.assert(length === size, 'have a length of ' + size, length);
};

internals.addMethod('length', internals.length);


internals.equal = function (value, options) {

    options = options || {};
    const settings = Hoek.applyToDefaults({ prototype: exports.settings.comparePrototypes }, options);

    const compare = this._flags.shallow ? (a, b) => a === b
                                        : (a, b) => Hoek.deepEqual(a, b, settings);

    return this.assert(compare(this._ref, value), `equal specified value: ${internals.display(value)}`, this._ref, value);
};

internals.addMethod(['equal', 'equals'], internals.equal);


internals.above = function (value) {

    return this.assert(this._ref > value, 'be above ' + value);
};

internals.addMethod(['above', 'greaterThan'], internals.above);


internals.least = function (value) {

    return this.assert(this._ref >= value, 'be at least ' + value);
};

internals.addMethod(['least', 'min'], internals.least);


internals.below = function (value) {

    return this.assert(this._ref < value, 'be below ' + value);
};

internals.addMethod(['below', 'lessThan'], internals.below);


internals.most = function (value) {

    return this.assert(this._ref <= value, 'be at most ' + value);
};

internals.addMethod(['most', 'max'], internals.most);


internals.within = function (from, to) {

    return this.assert(this._ref >= from && this._ref <= to, 'be within ' + from + '..' + to);
};

internals.addMethod(['within', 'range'], internals.within);


internals.between = function (from, to) {

    return this.assert(this._ref > from && this._ref < to, 'be between ' + from + '..' + to);
};

internals.addMethod('between', internals.between);


internals.above = function (value, delta) {

    internals.assert(this, internals.type(this._ref) === 'number', 'Can only assert about on numbers');
    internals.assert(this, internals.type(value) === 'number' && internals.type(delta) === 'number', 'About assertion requires two number arguments');

    return this.assert(Math.abs(this._ref - value) <= delta, 'be about ' + value + ' \u00b1' + delta);
};

internals.addMethod('about', internals.above);


internals.instanceof = function (type) {

    return this.assert(this._ref instanceof type, 'be an instance of ' + (type.name || 'provided type'));
};

internals.addMethod(['instanceof', 'instanceOf'], internals.instanceof);


internals.match = function (regex) {

    return this.assert(regex.exec(this._ref), 'match ' + regex);
};

internals.addMethod(['match', 'matches'], internals.match);


internals.satisfy = function (validator) {

    return this.assert(validator(this._ref), 'satisfy rule');
};

internals.addMethod(['satisfy', 'satisfies'], internals.satisfy);


internals.throw = function (/* type, message */) {

    internals.assert(this, typeof this._ref === 'function', 'Can only assert throw on functions');
    internals.assert(this, !this._flags.not || !arguments.length, 'Cannot specify arguments when expecting not to throw');

    const type = arguments.length && typeof arguments[0] !== 'string' && !(arguments[0] instanceof RegExp) ? arguments[0] : null;
    const lastArg = arguments[1] || arguments[0];
    const message = typeof lastArg === 'string' || lastArg instanceof RegExp ? lastArg : null;

    let thrown = false;

    try {
        this._ref();
    }
    catch (err) {
        thrown = true;

        if (type) {
            this.assert(err instanceof type, 'throw ' + (type.name || 'provided type'));
        }

        if (message !== null) {
            const error = err.message || '';
            this.assert(typeof message === 'string' ? error === message : error.match(message), 'throw an error with specified message', error, message);
        }

        this.assert(thrown, 'throw an error', err);
    }

    return this.assert(thrown, 'throw an error');
};

internals.addMethod(['throw', 'throws'], internals.throw);


internals.display = function (value) {

    const string = value instanceof Error ? `[${value.toString()}]` :
                                            NodeUtil.inspect(value);

    if (!exports.settings.truncateMessages || string.length <= 40) {
        return string;
    }

    if (Array.isArray(value)) {
        return '[Array(' + value.length + ')]';
    }

    if (typeof value === 'object') {
        const keys = Object.keys(value);
        return '{ Object (' + (keys.length > 2 ? (keys.splice(0, 2).join(', ') + ', ...') : keys.join(', ')) + ') }';
    }

    return string.slice(0, 40) + '...\'';
};


internals.natives = {
    '[object Arguments]': 'arguments',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object Function]': 'function',
    '[object Number]': 'number',
    '[object RegExp]': 'regexp',
    '[object String]': 'string'
};


internals.type = function (value) {

    if (value === null) {
        return 'null';
    }

    if (value === undefined) {
        return 'undefined';
    }

    if (Buffer.isBuffer(value)) {
        return 'buffer';
    }

    const name = Object.prototype.toString.call(value);
    if (internals.natives[name]) {
        return internals.natives[name];
    }

    if (value === Object(value)) {
        return 'object';
    }

    return typeof value;
};


exports.thrownAt = function (error) {

    error = error || new Error();
    const stack = typeof error.stack === 'string' ? error.stack : '';
    const frame = stack.replace(error.toString(), '').split('\n').slice(1).filter(internals.filterLocal)[0] || '';
    const at = frame.match(/^\s*at \(?(.+)\:(\d+)\:(\d+)\)?$/);
    return Array.isArray(at) ? {
        filename: at[1],
        line: at[2],
        column: at[3]
    } : undefined;
};


internals.assert = function (assertion, condition, error) {

    if (!condition) {
        delete internals.locations[assertion._location];
        Hoek.assert(condition, error);
    }
};
