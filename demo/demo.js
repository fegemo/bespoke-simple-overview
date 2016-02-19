window.deck = bespoke.from('article', [
  bespoke.plugins.keys(),
  bespoke.plugins.touch(),
  bespoke.plugins.classes(),
  bespoke.themes.fancy(),
  bespoke.plugins.simpleOverview({activationKey: 'd'.charCodeAt(0)}),
  bespoke.plugins.bullets('li')
]);
