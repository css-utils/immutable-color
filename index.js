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
  this.values = parse(val);
  this.h = set.bind(this, 'h');
  this.s = set.bind(this, 's');
  this.l = set.bind(this, 'l');
  this.a = set.bind(this, 'a');
  this.darken = pow.call(this, 1, 'l');
  this.lighten = pow.call(this, 0, 'l');
  this.soften = pow.call(this, 1, 'a', 100);
  this.harden = pow.call(this, 0, 'a', 100);
  return this;
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

ImmutableColor.prototype.clone = function() {
  return new ImmutableColor(JSON.parse(JSON.stringify(this.values)));
};

function set(prop, num) {
  var cloned = this.clone();
  cloned.values[prop] = num;
  return cloned;
}

function pow(isPositive, prop, by) {
  var pow = isPositive ? POW : NPOW;
  return function(k) {
    k = k == null ? pow : Math.pow(pow, k);
    return this[prop](round(this.values[prop] * k, by));
  };
}

function round(num, by) {
  by = by || 10000;
  return Math.round(num * by) / by;
}

exports['default'] = module.exports = ImmutableColor;
