var bespoke = require('bespoke'),
  simpleOverview = require('../../lib-instrumented/bespoke-simple-overview.js'),
  bullets = require('bespoke-bullets'),
  simulant = require('simulant'),

  deck,
  createDeck = function(options, classOnParent) {
    var parent = document.createElement('article');
    parent.innerHTML = '<section></section><section></section>';
    if (typeof classOnParent === 'string') {
      parent.classList.add(classOnParent)
    }

    deck = bespoke.from(parent, [
      simpleOverview(options)
    ]);
  },
  pressKey = function(which) {
    which = typeof which === 'string' ? which.toUpperCase().charCodeAt(0) : which;
    simulant.fire(document, 'keydown', { which: which });
  };

describe('bespoke-simple-overview', function() {

  // This test HAS TO BE the first one, because the plugin uses the package
  // insert-css, which does not include the same css more than once.
  // Because of that, we can't remove the stylesheet after each test, as we
  // would be unable to put it back again (insert-css's internal silly cache)
  describe('when styled by the plugin', function() {
    it('should inject some CSS onto the document', function() {
      var numberOfStylesheets = document.styleSheets.length;
      createDeck({ insertStyles: true });
      expect(document.styleSheets.length).toBeGreaterThan(numberOfStylesheets);
    });
  });

  describe('when NOT STYLED by the plugin', function() {
    it('should NOT inject CSS onto the document', function() {
      var numberOfStylesheets = document.styleSheets.length;
      createDeck({ insertStyles: false });
      expect(document.styleSheets.length).toEqual(numberOfStylesheets);
    });
  });

  describe('options', function() {
    beforeEach(function() {
      createDeck({
        activationKey: 'd'
      });
    });

    it('should allow configuration for the activation key ("ESC")', function() {
      pressKey('d');
      expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(true);
    });

    it('should not use the default activation key ("ESC")', function() {
      pressKey(27);   // ESC
      expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(false);
    });
  });

  describe('events', function() {
    beforeEach(function() {
      createDeck();
    });

    describe('"simple-overview.enable"', function() {
      it('should ACTIVATE the overview mode when "simple-overview.enable" is received', function() {
        deck.fire('simple-overview.enable');
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(true);
      });

      it('should NOT ACTIVATE the overview mode when "simple-overview.enable" is received and we are already on overview mode', function() {
        pressKey(27);
        deck.fire('simple-overview.enable');
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(true);
      });
    });

    describe('"simple-overview.disable"', function() {
      it('should DEACTIVATE the overview mode when "simple-overview.disable" is received', function() {
        pressKey(27);
        deck.fire('simple-overview.disable');
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(false);
      });

      it('should NOT DEACTIVATE the overview mode when "simple-overview.disable" is received and we are already in regular mode', function() {
        deck.fire('simple-overview.disable');
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(false);
      });
    });

    describe('"simple-overview.toggle"', function() {
      it('should to ACTIVATE the overview mode when "simple-overview.toggle" is received and it\'s in regular mode', function() {
        deck.fire('simple-overview.toggle');
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(true);
      });

      it('should to DEACTIVATE the overview mode when "simple-overview.toggle" is received and it\'s in overview mode', function() {
        pressKey(27);
        deck.fire('simple-overview.toggle');
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(false);
      });
    });

    describe('"destroy"', function() {
      it('should detach the onkeydown handler of the window object when the deck receives the "destroy" event', function() {
        deck.fire('destroy');
        expect(window.onkeydown).toBe(null);
      });
    });
  });

  describe('navigating with bespoke-bullets', function() {
    beforeEach(function() {
      var parent = document.createElement('article');
      parent.innerHTML = '<section><ul><li>one</li><li>two</li></ul></section><section></section>';

      deck = bespoke.from(parent, [
        simpleOverview(),
        bullets('li')
      ]);
    });

    it('should IGNORE the bullets inside a slide when in overview mode', function() {
      pressKey(27);
      deck.next();
      expect(deck.slide()).toBe(1);
    });

    it('should NOT IGNORE the bullets inside a slide when in regular mode', function() {
      deck.next();
      expect(deck.slide()).toBe(0);
      deck.next()
      expect(deck.slide()).toBe(1);
    });

    it('should NOT NAVIGATE to invalid slide indices in overview mode', function() {
      pressKey(27);
      deck.prev();
      expect(deck.slide()).toBe(0);
    });
  });
});
