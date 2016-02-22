/*!
 * bespoke-simple-overview v1.0.0
 *
 * Copyright 2016, Flávio Coutinho
 * This content is released under the MIT license
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.bespoke||(g.bespoke = {}));g=(g.plugins||(g.plugins = {}));g.simpleOverview = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var insertCss = require('insert-css');

var optionsWithDefaults = function(defaults, options) {
    options = typeof options === 'object' ? options : {};
    Object.keys(defaults).forEach(function(option) {
      options[option] = options[option] || defaults[option];
    });
    return options;
  },
  ensureCharCode = function(value) {
    return typeof value === 'string' ? value.toUpperCase().charCodeAt(0) : value;
  };


module.exports = function(options) {
  options = optionsWithDefaults({
    activationKey: 27,
    insertStyles: true
  }, options);
  options.activationKey = ensureCharCode(options.activationKey);

  return function(deck) {
    var onDeckActivated,
      onActivationKeyPressed,
      onDeckDestroyed,
      onSlideChange,
      toggleSimpleOverview,
      isOverviewActive;

    onDeckActivated = function() {
      deck.on('activate', onDeckActivated)(); // de-register so it happens 1x
      window.addEventListener('keydown', onActivationKeyPressed, false);

      // inserts the css if necessary
      var overviewStyles = ".bespoke-parent{-webkit-perspective:900px;perspective:900px}.bespoke-parent .bespoke-slide{transition-property:transform,opacity;transition-property:transform,opacity,-webkit-transform}.bespoke-simple-overview .bespoke-slide{-webkit-transform:translate3d(0,0,-2000px);transform:translate3d(0,0,-2000px);outline:4px solid silver;background-color:rgba(255,255,255,.2);opacity:initial}.bespoke-simple-overview .bespoke-slide.bespoke-active,.bespoke-simple-overview .bespoke-slide:hover{outline-color:#4682b4}.bespoke-simple-overview .bespoke-slide.bespoke-before{display:none;-webkit-transform:translate3d(-630%,0,-2000px);transform:translate3d(-630%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after{display:none;-webkit-transform:translate3d(630%,0,-2000px);transform:translate3d(630%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-1,.bespoke-simple-overview .bespoke-slide.bespoke-after-2,.bespoke-simple-overview .bespoke-slide.bespoke-after-3,.bespoke-simple-overview .bespoke-slide.bespoke-after-4,.bespoke-simple-overview .bespoke-slide.bespoke-after-5,.bespoke-simple-overview .bespoke-slide.bespoke-before-1,.bespoke-simple-overview .bespoke-slide.bespoke-before-2,.bespoke-simple-overview .bespoke-slide.bespoke-before-3,.bespoke-simple-overview .bespoke-slide.bespoke-before-4,.bespoke-simple-overview .bespoke-slide.bespoke-before-5{display:-webkit-flex;display:-ms-flexbox;display:flex}.bespoke-simple-overview .bespoke-slide.bespoke-before-1{-webkit-transform:translate3d(-105%,0,-2000px);transform:translate3d(-105%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-before-2{-webkit-transform:translate3d(-210%,0,-2000px);transform:translate3d(-210%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-before-3{-webkit-transform:translate3d(-315%,0,-2000px);transform:translate3d(-315%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-before-4{-webkit-transform:translate3d(-420%,0,-2000px);transform:translate3d(-420%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-before-5{-webkit-transform:translate3d(-525%,0,-2000px);transform:translate3d(-525%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-1{-webkit-transform:translate3d(105%,0,-2000px);transform:translate3d(105%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-2{-webkit-transform:translate3d(210%,0,-2000px);transform:translate3d(210%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-3{-webkit-transform:translate3d(315%,0,-2000px);transform:translate3d(315%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-4{-webkit-transform:translate3d(420%,0,-2000px);transform:translate3d(420%,0,-2000px)}.bespoke-simple-overview .bespoke-slide.bespoke-after-5{-webkit-transform:translate3d(525%,0,-2000px);transform:translate3d(525%,0,-2000px)}.bespoke-simple-overview .bespoke-bullet-inactive{display:list-item;opacity:initial;-webkit-transform:initial;transform:initial}";
      if (options.insertStyles) {
        insertCss(overviewStyles);
      }

      // if the deck.parent already has the bespoke-overview class, turn it on
      isOverviewActive = deck.parent.classList.contains('bespoke-simple-overview');
      if (isOverviewActive) {
        SimpleOverview();
      }
    };
    onDeckDestroyed = function() {
      window.removeEventListener('keydown', onActivationKeyPressed, false);
    };

    onSlideChange = function(direction) {
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
      switch (e.which) {
        case options.activationKey:
          toggleSimpleOverview();
          break;
        default:
          break;
      }
    };

    toggleSimpleOverview = function(toActivate) {
      isOverviewActive = typeof toActivate === 'boolean' ? toActivate : !isOverviewActive;
      deck.parent.classList.toggle('bespoke-simple-overview', isOverviewActive);
    };

    deck.on('activate', onDeckActivated);
    deck.on('destroy', onDeckDestroyed);

    // exposes 3 events to outside world so they can enable/disable/toggle this
    deck.on('simple-overview.enable', toggleSimpleOverview.bind(null, true));
    deck.on('simple-overview.disable', toggleSimpleOverview.bind(null, false));
    deck.on('simple-overview.toggle', toggleSimpleOverview.bind(null));

    // prevent bespoke-bullets from spoiling the fun
    deck.on('prev', onSlideChange.bind(null, -1));
    deck.on('next', onSlideChange.bind(null,  1));
  };
};

},{"insert-css":2}],2:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}]},{},[1])(1)
});