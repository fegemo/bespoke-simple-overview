module.exports = function(options) {
  options.activationKey = options.activationKey || 27;  // ESC

  return function(deck) {
    window.addEventListener('keydown', function(e) {
      var turnedOn;
      switch (e.which) {
        case options.activationKey:
          turnedOn = deck.parent.classList.toggle('bespoke-overview');
          deck.fire('bullets.' + (turnedOn ? 'disable' : 'enable'));
          break;
        default:
          break;
      }
    });
  };
};
