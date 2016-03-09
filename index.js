/**
 * Module dependencies
 */

var parse = require('color-to-hsla');

/**
 * Define constants
 */

var POW = 0.7;
var NPOW = 1 / POW;

function ImmutableColor(val) {
  if (!(this instanceof ImmutableColor)) return new ImmutableColor(val);
  return Object.defineProperty(this, 'values', {
    value: Object.freeze(parse(val))
  });
};

ImmutableColor.prototype.toString = function(notation) {
  var vals = this.values;
  return 'hsla(' + [
    (vals.h || 0),
    round(Math.max(0, Math.min(100, (vals.s || 0) * 100)), 100) + '%',
    round(Math.max(0, Math.min(100, (vals.l || 0) * 100)), 100) + '%',
    Math.max(0, Math.min(1, vals.a || 1)),
  ].join(', ') + ')';
};

set('h');
set('s');
set('l');
set('a');
pow('darken', 1, 'l');
pow('lighten', 0, 'l');
pow('soften', 1, 'a', 100);
pow('harden', 0, 'a', 100);
pow('brighten', 1, 's');
pow('dampen', 0, 's');

function set(prop) {
  ImmutableColor.prototype[prop] = function(num) {
    if (!arguments.length) return this.values[prop];
    return clone(this.values, {[prop]: num});
  };
}

function clone(values, newValues) {
  return new ImmutableColor(merge(values, newValues));
}

function pow(name, isPositive, prop, by) {
  var pow = isPositive ? POW : NPOW;
  ImmutableColor.prototype[name] = function(k) {
    k = k == null ? pow : Math.pow(pow, k);
    return this[prop](round(this.values[prop] * k, by));
  };
}

function round(num, by) {
  by = by || 10000;
  return Math.round(num * by) / by;
}

function merge(a, b) {
  a = a || {};
  b = b || {};
  var z = {};
  for (var ak in a) z[ak] = a[ak] || 0;
  for (var bk in b) z[bk] = b[bk] || 0;
  return z;
}

exports['default'] = module.exports = ImmutableColor;
