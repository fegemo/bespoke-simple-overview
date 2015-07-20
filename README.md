[![Build Status](https://secure.travis-ci.org/fegemo/bespoke-overview.png?branch=master)](https://travis-ci.org/fegemo/bespoke-overview) [![Coverage Status](https://coveralls.io/repos/fegemo/bespoke-overview/badge.png)](https://coveralls.io/r/fegemo/bespoke-overview)

# bespoke-overview

Displays an overview version of a bespoke presentation

## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/fegemo/bespoke-overview/master/dist/bespoke-overview.min.js
[max]: https://raw.github.com/fegemo/bespoke-overview/master/dist/bespoke-overview.js

## Usage

This plugin is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
var bespoke = require('bespoke'),
  overview = require('bespoke-overview');

bespoke.from('#presentation', [
  overview()
]);
```

When using browser globals:

```js
bespoke.from('#presentation', [
  bespoke.plugins.overview()
]);
```

## Package managers

### npm

```bash
$ npm install bespoke-overview
```

### Bower

```bash
$ bower install bespoke-overview
```

## Credits

This plugin was built with [generator-bespokeplugin](https://github.com/markdalgleish/generator-bespokeplugin).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
