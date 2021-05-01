const bespoke = require('bespoke')
const keys = require('bespoke-keys')
const touch = require('bespoke-touch')
const classes = require('bespoke-classes')
const simpleOverview = require('../dist/bespoke-simple-overview.js')
const bullets = require('bespoke-bullets')

// themes
const themes = {
  fancy: require('bespoke-theme-fancy'),
  cube: require('bespoke-theme-cube'),
  'mozilla-sandstone': require('bespoke-theme-mozilla-sandstone'),
  nebula: require('bespoke-theme-nebula'),
  voltaire: require('bespoke-theme-voltaire')
}

const path = document.location.pathname
const hasExtension = path.indexOf('.html') !== -1

let theme = (hasExtension ? path.substring(
  path.lastIndexOf('index-') + 'index-'.length, path.lastIndexOf('.html'))
  : 'fancy')
if (theme === 'x') {
  theme = 'fancy'
}

window.deck = bespoke.from('article', [
  keys(),
  touch(),
  classes(),
  themes[theme](),
  simpleOverview(),
  bullets('li')
])
