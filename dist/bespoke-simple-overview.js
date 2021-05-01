/*!
 * bespoke-simple-overview v1.1.0
 *
 * Copyright 2021, Flávio Coutinho
 * This content is released under the MIT license
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.bespoke||(g.bespoke = {}));g=(g.plugins||(g.plugins = {}));g.simpleOverview = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
var css = ".bespoke-parent{perspective:900px}.bespoke-parent .bespoke-slide{transition-property:transform,opacity}.bespoke-simple-overview .bespoke-slide{transform:translate3d(0,0,-2000px);outline:4px solid silver;background-color:rgba(255,255,255,.2);opacity:initial}.bespoke-simple-overview .bespoke-slide.bespoke-active,.bespoke-simple-overview .bespoke-slide:hover{outline-color:#4682b4}.bespoke-simple-overview .bespoke-slide.bespoke-before{display:none;transform:translate3d(-630%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after{display:none;transform:translate3d(630%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-1,.bespoke-simple-overview .bespoke-slide.bespoke-after-2,.bespoke-simple-overview .bespoke-slide.bespoke-after-3,.bespoke-simple-overview .bespoke-slide.bespoke-after-4,.bespoke-simple-overview .bespoke-slide.bespoke-after-5,.bespoke-simple-overview .bespoke-slide.bespoke-before-1,.bespoke-simple-overview .bespoke-slide.bespoke-before-2,.bespoke-simple-overview .bespoke-slide.bespoke-before-3,.bespoke-simple-overview .bespoke-slide.bespoke-before-4,.bespoke-simple-overview .bespoke-slide.bespoke-before-5{display:flex}.bespoke-simple-overview .bespoke-slide.bespoke-before-1{transform:translate3d(-105%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-before-2{transform:translate3d(-210%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-before-3{transform:translate3d(-315%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-before-4{transform:translate3d(-420%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-before-5{transform:translate3d(-525%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-1{transform:translate3d(105%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-2{transform:translate3d(210%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-3{transform:translate3d(315%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-4{transform:translate3d(420%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-5{transform:translate3d(525%,0,-2000px)}.bespoke-simple-overview .bespoke-bullet-inactive{display:list-item;opacity:initial;transform:initial}"; (_dereq_("browserify-css").createStyle(css, { "href": "lib\\bespoke-simple-overview.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":3}],2:[function(_dereq_,module,exports){
const ensureCharCode = value =>
  typeof value === 'string' ? value.toUpperCase().charCodeAt(0) : value


module.exports = function ({ activationKey = 27, insertStyles = true } = {}) {
  activationKey = ensureCharCode(activationKey)

  return function (deck) {
    let onDeckActivated,
      onActivationKeyPressed,
      onDeckDestroyed,
      onSlideChange,
      toggleSimpleOverview,
      isOverviewActive

    onDeckActivated = function () {
      deck.on('activate', onDeckActivated)() // de-register so it happens 1x
      window.addEventListener('keydown', onActivationKeyPressed, false)

      // inserts the css if necessary
      if (insertStyles) {
        _dereq_('../lib/bespoke-simple-overview.css')
      }

      // if the deck.parent already has the bespoke-overview class, turn it on
      isOverviewActive = deck.parent.classList.contains(
        'bespoke-simple-overview'
      )
    }
    onDeckDestroyed = function () {
      window.removeEventListener('keydown', onActivationKeyPressed, false)
    }

    onSlideChange = function (direction) {
      let newSlideIndex
      if (isOverviewActive) {
        newSlideIndex = deck.slide() + direction
        if (newSlideIndex >= 0 && newSlideIndex < deck.slides.length) {
          deck.slide(newSlideIndex)
        }
        return false
      }
    }

    onActivationKeyPressed = function (e) {
      switch (e.which) {
      case activationKey:
        toggleSimpleOverview()
        break
      default:
        break
      }
    }

    toggleSimpleOverview = function (toActivate) {
      isOverviewActive =
        typeof toActivate === 'boolean' ? toActivate : !isOverviewActive
      deck.parent.classList.toggle('bespoke-simple-overview', isOverviewActive)
    }

    deck.on('activate', onDeckActivated)
    deck.on('destroy', onDeckDestroyed)

    // exposes 3 events to outside world so they can enable/disable/toggle this
    deck.on('simple-overview.enable', toggleSimpleOverview.bind(null, true))
    deck.on('simple-overview.disable', toggleSimpleOverview.bind(null, false))
    deck.on('simple-overview.toggle', toggleSimpleOverview.bind(null))

    // prevent bespoke-bullets from spoiling the fun
    deck.on('prev', onSlideChange.bind(null, -1))
    deck.on('next', onSlideChange.bind(null, 1))
  }
}

},{"../lib/bespoke-simple-overview.css":1}],3:[function(_dereq_,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

var styleElementsInsertedAtTop = [];

var insertStyleElement = function(styleElement, options) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];

    options = options || {};
    options.insertAt = options.insertAt || 'bottom';

    if (options.insertAt === 'top') {
        if (!lastStyleElementInsertedAtTop) {
            head.insertBefore(styleElement, head.firstChild);
        } else if (lastStyleElementInsertedAtTop.nextSibling) {
            head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
        } else {
            head.appendChild(styleElement);
        }
        styleElementsInsertedAtTop.push(styleElement);
    } else if (options.insertAt === 'bottom') {
        head.appendChild(styleElement);
    } else {
        throw new Error('Invalid value for parameter \'insertAt\'. Must be \'top\' or \'bottom\'.');
    }
};

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes, extraOptions) {
        extraOptions = extraOptions || {};

        var style = document.createElement('style');
        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }

        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        } else if (style.styleSheet) { // for IE8 and below
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        }
    }
};

},{}]},{},[2])(2)
});
