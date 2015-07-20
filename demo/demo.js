window.deck = bespoke.from('article', [
  bespoke.plugins.keys(),
  bespoke.plugins.touch(),
  bespoke.plugins.classes(),
  bespoke.themes.fancy(),
  bespoke.plugins.bullets('li'),
  bespoke.plugins.overview()
]);
