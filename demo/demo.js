window.deck = bespoke.from('article', [
  bespoke.plugins.keys(),
  bespoke.plugins.touch(),
  bespoke.plugins.classes(),
  bespoke.themes.fancy(),
  bespoke.plugins.simpleOverview(),
  bespoke.plugins.bullets('li')
]);
