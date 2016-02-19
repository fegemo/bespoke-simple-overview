Function.prototype.bind = Function.prototype.bind || require('function-bind');

var bespoke = require('bespoke'),
  overview = require('../../lib-instrumented/bespoke-simple-overview.js'),
  simulant = require('simulant'),

  deck,
  createDeck = function(options) {
    var parent = document.createElement('article');
    parent.innerHTML = '<section></section><section></section>';

    deck = bespoke.from(parent, [
      overview(options)
    ]);
  },
  pressKey = function(which) {
    simulant.fire(document, 'keydown', { which: which });
  };

describe('bespoke-simple-overview', function() {


  describe('options', function() {
    beforeEach(createDeck.bind(null, {
      activationKey: 'c'
    }));

    it('should allow configuration for the activation key ("ESC")', function() {
      pressKey('c');
      expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(true);
    });

    it('should not use the default activation key ("ESC")', function() {
      pressKey(27);   // ESC
      expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(false);
    });
  });

  describe('general things', function() {
    beforeEach(createDeck.bind(null, {}));
    beforeEach(function() {
      spyOn(deck, 'fire');
    });

    it('should disable bulletting (bespoke-bullets) when "ESC" is hit', function() {
      pressKey(27);   // ESC
      expect(deck.fire).toHaveBeenCalledWith('bullets.disable');
    });

    it('should re-enable bulletting (bespoke-bullets) when "ESC" is hit again', function() {
      pressKey(27);   // ESC
      pressKey(27);   // ESC
      expect(deck.fire.calls.argsFor(1)).toEqual(['bullets.enable']);
    });
  });

  describe('styled by the theme', function() {


  });

  describe('styled by the plugin', function() {

  });

});
