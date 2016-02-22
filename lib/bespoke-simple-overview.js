var fs = require('fs');
var insertCss = require('insert-css');

var optionsWithDefaults = function(defaults, options) {
    options = typeof options === 'object' ? options : {};
    Object.keys(defaults).forEach(function(option) {
      if (typeof options[option] === 'undefined') {
        options[option] = defaults[option];
      }
    });
    return options;
  },
  ensureCharCode = function(value) {
    return typeof value === 'string' ? value.toUpperCase().charCodeAt(0) : value;
  };


module.exports = function(options) {
  options = optionsWithDefaults({
    activationKey: 27,
    insertStyles: true
  }, options);
  options.activationKey = ensureCharCode(options.activationKey);

  return function(deck) {
    var onDeckActivated,
      onActivationKeyPressed,
      onDeckDestroyed,
      onSlideChange,
      toggleSimpleOverview,
      isOverviewActive;

    onDeckActivated = function() {
      deck.on('activate', onDeckActivated)(); // de-register so it happens 1x
      window.addEventListener('keydown', onActivationKeyPressed, false);

      // inserts the css if necessary
      var overviewStyles = fs.readFileSync(__dirname + '/bespoke-simple-overview.min.css', 'utf8');
      if (options.insertStyles) {
        insertCss(overviewStyles);
      }

      // if the deck.parent already has the bespoke-overview class, turn it on
      isOverviewActive = deck.parent.classList.contains('bespoke-simple-overview');
    };
    onDeckDestroyed = function() {
      window.removeEventListener('keydown', onActivationKeyPressed, false);
    };

    onSlideChange = function(direction) {
      var newSlideIndex;
      if (isOverviewActive) {
        newSlideIndex = deck.slide() + direction;
        if (newSlideIndex >= 0 && newSlideIndex < deck.slides.length) {
          deck.slide(newSlideIndex);
        }
        return false;
      }
    };

    onActivationKeyPressed = function(e) {
      switch (e.which) {
        case options.activationKey:
          toggleSimpleOverview();
          break;
        default:
          break;
      }
    };

    toggleSimpleOverview = function(toActivate) {
      isOverviewActive = typeof toActivate === 'boolean' ? toActivate : !isOverviewActive;
      deck.parent.classList.toggle('bespoke-simple-overview', isOverviewActive);
    };

    deck.on('activate', onDeckActivated);
    deck.on('destroy', onDeckDestroyed);

    // exposes 3 events to outside world so they can enable/disable/toggle this
    deck.on('simple-overview.enable', toggleSimpleOverview.bind(null, true));
    deck.on('simple-overview.disable', toggleSimpleOverview.bind(null, false));
    deck.on('simple-overview.toggle', toggleSimpleOverview.bind(null));

    // prevent bespoke-bullets from spoiling the fun
    deck.on('prev', onSlideChange.bind(null, -1));
    deck.on('next', onSlideChange.bind(null,  1));
  };
};
