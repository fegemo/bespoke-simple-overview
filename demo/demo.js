var path = document.location.pathname,
  hasExtension = path.indexOf('.html') !== -1,
  theme = hasExtension ? path.substring(
    path.lastIndexOf('index-') + 'index-'.length, path.lastIndexOf('.html'))
    : 'fancy',
  camelCasify = function(s) {
    return s.replace(/(\-[a-zA-Z])/g, function(letter) {
      return letter.substr(1).toUpperCase();
    });
  };

theme = camelCasify(theme);
if (!bespoke.themes[theme]) {
  theme = 'fancy';
}

window.deck = bespoke.from('article', [
  bespoke.plugins.keys(),
  bespoke.plugins.touch(),
  bespoke.plugins.classes(),
  bespoke.themes[theme](),
  bespoke.plugins.simpleOverview(),
  bespoke.plugins.bullets('li')
]);
