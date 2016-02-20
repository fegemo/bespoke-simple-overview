/*!
 * bespoke-simple-overview v1.0.0
 *
 * Copyright 2016, Flávio Coutinho
 * This content is released under the MIT license
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.bespoke||(g.bespoke = {}));g=(g.plugins||(g.plugins = {}));g.simpleOverview = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  options = optionsWithDefaults({ activationKey: 27 }, options);
  options.activationKey = ensureCharCode(options.activationKey);

  return function(deck) {
    var onDeckActivated,
      onActivationKeyPressed,
      onDeckDestroyed,
      onSlideChange,
      toggleSimpleOverview,
      isOverviewActive;

    onDeckActivated = function(e) {
      deck.on('activate', onDeckActivated)(); // de-register so it happens 1x
      window.addEventListener('keydown', onActivationKeyPressed, false);

      // if the deck.parent already has the bespoke-overview class, turn it on
      isOverviewActive = deck.parent.classList.contains('bespoke-simple-overview');
      if (isOverviewActive) {
        toggleSimpleOverview();
      }
    };
    onDeckDestroyed = function(e) {
      window.removeEventListener('keydown', onActivationKeyPressed, false);
    };

    onSlideChange = function(direction, e) {
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
      var turnedOn;
      switch (e.which) {
        case options.activationKey:
          toggleSimpleOverview();
          break;
        default:
          break;
      }
    };

    toggleSimpleOverview = function(e) {
      isOverviewActive = !isOverviewActive;
      deck.parent.classList.toggle('bespoke-simple-overview', isOverviewActive);
    };


    deck.on('activate', onDeckActivated);
    deck.on('destroy', onDeckDestroyed);

    // exposes 2 events to outside world so they can enable/disable this
    deck.on('simple-overview.enable', toggleSimpleOverview.bind(null, true));
    deck.on('simple-overview.disable', toggleSimpleOverview.bind(null, false));

    // prevent bespoke-bullets from spoiling the fun
    deck.on('prev', onSlideChange.bind(null, -1));
    deck.on('next', onSlideChange.bind(null,  1));
  };
};

},{}]},{},[1])(1)
});