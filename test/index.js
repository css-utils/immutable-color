var lib = require('..');
var should = require('should');

describe('immutable-color', function() {
  describe('set methods', function() {
    var c = 'hsla(100, 25%, 25%, 1)';
    it('#h', function() {
      'hsla(10, 25%, 25%, 1)'.should.equal(lib(c).h(10).toString());
    });
    it('#s', function() {
      'hsla(100, 55%, 25%, 1)'.should.equal(lib(c).s(.55).toString());
    });
    it('#l', function() {
      'hsla(100, 25%, 50%, 1)'.should.equal(lib(c).l(.5).toString());
    });
    it('#a', function() {
      'hsla(100, 25%, 25%, 0.5)'.should.equal(lib(c).a(.5).toString());
    });
  });

  describe('adjust methods', function() {
    runPow('darken', 'lighten', {
      '3': 'hsla(0, 100%, 17.15%, 1)',
      '2': 'hsla(0, 100%, 24.5%, 1)',
      '1': 'hsla(0, 100%, 35%, 1)',
      '0': 'hsla(0, 100%, 50%, 1)',
      '-1': 'hsla(0, 100%, 71.43%, 1)',
      '-2': 'hsla(0, 100%, 100%, 1)',
      '-3': 'hsla(0, 100%, 100%, 1)'
    });

    runPow('harden', 'soften', {
      '3': 'hsla(0, 50%, 50%, 1)',
      '2': 'hsla(0, 50%, 50%, 1)',
      '1': 'hsla(0, 50%, 50%, 0.71)',
      '0': 'hsla(0, 50%, 50%, .5)',
      '-1': 'hsla(0, 50%, 50%, 0.35)',
      '-2': 'hsla(0, 50%, 50%, 0.24)',
      '-3': 'hsla(0, 50%, 50%, 0.17)'
    });

    runPow('brighten', 'dampen', {
      '3': 'hsla(0, 100%, 50%, 1)',
      '2': 'hsla(0, 100%, 50%, 1)',
      '1': 'hsla(0, 71.43%, 50%, 1)',
      '0': 'hsla(0, 50%, 50%, 1)',
      '-1': 'hsla(0, 35%, 50%, 1)',
      '-2': 'hsla(0, 24.5%, 50%, 1)',
      '-3': 'hsla(0, 17.15%, 50%, 1)'
    });

    function runPow(pos, neg, values) {
      var c = lib(values['0']);
      for (var k in values) {
        if (k === '0') continue;
        var val = values[k];
        var int = parseInt(k);
        var getter = (int > 0 ? pos : neg).slice(0, -2) + (['', 'er', 'est'][Math.abs(int) - 1]);
        describe('#' + pos + ' ' + k, ()=> {
          it(pos + '(' + int + ')', () => c[pos](int).toString().should.equal(val));
          it(neg + '(' + (-int) + ')', () => c[neg](-int).toString().should.equal(val));
          it(getter, () => c[getter].toString().should.equal(val));
        });
      }
    }
  });

  describe('#rotate', () => {
    it('should rotate positively', () => {
      var c = lib('hsla(0, 0%, 0%, 1)');
      c.rotate(10).toString().should.equal('hsla(10, 0%, 0%, 1)');
      c.rotate(370).toString().should.equal('hsla(10, 0%, 0%, 1)');
    });

    it('should rotate negatively', () => {
      var c = lib('hsla(0, 0%, 0%, 1)');
      c.rotate(-10).toString().should.equal('hsla(350, 0%, 0%, 1)');
      c.rotate(-370).toString().should.equal('hsla(350, 0%, 0%, 1)');
    });
  });
});
