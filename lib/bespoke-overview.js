module.exports = function() {
  return function(deck) {
    window.addEventListener('keydown', function(e) {
      var turnedOn;
      switch (e.which) {
        case 27:
          turnedOn = deck.parent.classList.toggle('bespoke-overview');
          deck.fire('bullets.' + (turnedOn ? 'disable' : 'enable'));
          break;
        default:
          break;
      }
    });
  };
};
