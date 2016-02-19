module.exports = function(options) {
  options = options || {};
  options.activationKey = options.activationKey || 27;  // ESC

  return function(deck) {
    var onDeckActivated,
      onActivationKeyPressed,
      onDeckDestroyed,
      onSlideChange,
      toggleSimpleOverview,
      isOverviewActive;

    onDeckActivated = function(e) {
      deck.on('activate', onDeckActivated)(); // de-register so it happens 1x
      window.addEventListener('keydown', onActivationKeyPressed, false);

      // if the deck.parent already has the bespoke-overview class, turn it on
      isOverviewActive = deck.parent.classList.contains('bespoke-overview');
      if (isOverviewActive) {
        toggleSimpleOverview();
      }
    };
    onDeckDestroyed = function(e) {
      window.removeEventListener('keydown', onActivationKeyPressed, false);
    };

    onSlideChange = function(direction, e) {
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
      var turnedOn;
      switch (e.which) {
        case options.activationKey:
          toggleSimpleOverview();
          break;
        default:
          break;
      }
    };

    toggleSimpleOverview = function(e) {
      isOverviewActive = !isOverviewActive;
      deck.parent.classList.toggle('bespoke-overview', isOverviewActive);
      deck.fire('bullets.' + (isOverviewActive ? 'disable' : 'enable'));
    };



    deck.on('activate', onDeckActivated);
    deck.on('destroy', onDeckDestroyed);
    deck.on('activate', onDeckActivated);
    deck.on('destroy', onDeckDestroyed);

    // exposes 2 events to outside world so they can enable/disable this
    deck.on('simple-overview.enable', toggleSimpleOverview.bind(null, true));
    deck.on('simple-overview.disable', toggleSimpleOverview.bind(null, false));

    // prevent bespoke-bullets from spoiling the fun
    deck.on('prev', onSlideChange.bind(null, -1));
    deck.on('next', onSlideChange.bind(null,  1));
  };
};
