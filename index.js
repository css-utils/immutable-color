/**
 * Module dependencies
 */

var parse = require('color-to-hsla');

/**
 * Define constants
 */

var POW = 0.7;
var NPOW = 1 / POW;

function ImmutableColor(val, opts) {
  if (!(this instanceof ImmutableColor)) return new ImmutableColor(val, opts);
  var value = Object.freeze(parse(val));
  if (!value) throw new Error('Invalid color \'' + val + '\'');
  Object.defineProperties(this, {
    mutated: {
      writable: true,
      value: {}
    },
    options: {
      value: Object.freeze(opts || {})
    },
    values: {
      value: Object.freeze(parse(val))
    }
  });
};

ImmutableColor.prototype.toString = function(notation) {
  var vals = this.values;
  return 'hsla(' + [
    Math.round(vals.h || 0),
    taper(0, 100, vals.s, 100) + '%',
    taper(0, 100, vals.l, 100) + '%',
    Math.max(0, Math.min(1, vals.a || 1)),
  ].join(', ') + ')';
};

ImmutableColor.prototype.clone = function() {
  console.warn('Method \'clone\' will be deprecated in version 2.');
  return clone(this.values);
};

ImmutableColor.prototype.rotate = function(num) {
  var value = this.values.h + num;
  if (value < 0) value = 360 + (value % 360);
  else if (value > 360) value = value % 360;
  return this.h(value);
};

set('h');
set('s');
set('l');
set('a');
pow('darken', 1, 'l');
pow('lighten', 0, 'l');
pow('soften', 1, 'a', 100);
pow('harden', 0, 'a', 100);
pow('dampen', 1, 's');
pow('brighten', 0, 's');

function set(prop) {
  ImmutableColor.prototype[prop] = function(num) {
    if (!arguments.length) return this.values[prop];
    return clone(this.values, {[prop]: num});
  };
}

function pow(name, isPositive, prop, by) {
  var pow = isPositive ? POW : NPOW;
  ImmutableColor.prototype[name] = function(k) {
    k = k == null ? pow : Math.pow(pow, k);
    var value = taper(0, 1, this.values[prop] * k, by);
    return this[prop](value);
  };
  generateGetters(name);
}

function generateGetters(name) {
  var prefix = name.slice(0, -2);
  ['', 'er', 'est'].map((ending, i) => {
    var prop = prefix + ending;
    Object.defineProperty(ImmutableColor.prototype, prop, {
      get: function() {
        if (!this.options.mutable || typeof this.mutated[prop] === 'undefined') {
          return this[name](i + 1);
        } else {
          return this.mutated[prop].value;
        }
      },
      set: function(newValue) {
        if (!this.options.mutable) return this[name](i + 1);
        return this.mutated[prop] = {value: newValue};
      }
    });
  });
}

function clone(values, newValues) {
  return new ImmutableColor(merge(values, newValues));
}

function taper(min, max, num, by) {
  by = by || 10000;
  return Math.round(Math.max(min, Math.min(max, (num || 0) * max)) * by) / by;
}

function merge(a, b) {
  a = a || {};
  b = b || {};
  var z = {};
  for (var ak in a) z[ak] = a[ak] || 0;
  for (var bk in b) z[bk] = b[bk] || 0;
  return z;
}

module.exports = exports['default'] = ImmutableColor;
