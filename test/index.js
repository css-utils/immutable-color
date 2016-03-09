var lib = require('..');

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
    it('#darken', function() {
      var c = lib('hsla(0, 100%, 50%, 1)');
      'hsla(0, 100%, 35%, 1)'.should.equal(c.darken(1).toString());
      'hsla(0, 100%, 35%, 1)'.should.equal(c.lighten(-1).toString());
    });
    it('#lighten', function() {
      var c = lib('hsla(0, 100%, 50%, 1)');
      'hsla(0, 100%, 71.43%, 1)'.should.equal(c.lighten(1).toString());
      'hsla(0, 100%, 71.43%, 1)'.should.equal(c.darken(-1).toString());
    });
    it('#soften', function() {
      var c = lib('hsla(0, 50%, 50%, 1)');
      'hsla(0, 50%, 50%, 0.7)'.should.equal(c.harden(-1).toString());
      'hsla(0, 50%, 50%, 0.7)'.should.equal(c.soften(1).toString());
      'hsla(0, 50%, 50%, 0.49)'.should.equal(c.soften(2).toString());
      'hsla(0, 50%, 50%, 0.34)'.should.equal(c.soften(3).toString());
    });
    it('#harden', function() {
      var c = lib('hsla(0, 50%, 50%, .25)');
      'hsla(0, 50%, 50%, 0.36)'.should.equal(c.harden(1).toString());
      'hsla(0, 50%, 50%, 0.51)'.should.equal(c.harden(2).toString());
    });
    it('#brighten', function() {
      var c = lib('hsla(0, 100%, 50%, 1)');
      'hsla(0, 70%, 50%, 1)'.should.equal(c.dampen(-1).toString());
      'hsla(0, 70%, 50%, 1)'.should.equal(c.brighten(1).toString());
      'hsla(0, 49%, 50%, 1)'.should.equal(c.brighten(2).toString());
      'hsla(0, 34.3%, 50%, 1)'.should.equal(c.brighten(3).toString());
    });
    it('#dampen', function() {
      var c = lib('hsla(0, 25%, 50%, 1)');
      'hsla(0, 35.71%, 50%, 1)'.should.equal(c.dampen(1).toString());
      'hsla(0, 51.02%, 50%, 1)'.should.equal(c.dampen(2).toString());
      'hsla(0, 72.89%, 50%, 1)'.should.equal(c.dampen(3).toString());
    });
    // TODO
    // #rotate
  });
});
