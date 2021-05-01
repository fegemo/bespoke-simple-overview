/* eslint-env jasmine */
const bespoke = require('bespoke')
const bullets = require('bespoke-bullets')
const simpleOverview = require('../../dist/bespoke-simple-overview.js')

let deck = null

const keyCodes = {
  Esc: 27,
  Enter: 13,
  Tab: 9,
}

function pressKey(key) {
  const options = {
    key,
    keyCode: key.length > 1 ? keyCodes[key] : key.toUpperCase().charCodeAt(0),
  }
  const event = new KeyboardEvent('keydown', options)
  window.dispatchEvent(event)
}

const createDeck = (options, classOnParent) => {
  const parent = document.createElement('article')
  parent.innerHTML = '<section></section><section></section>'
  if (typeof classOnParent === 'string') {
    parent.classList.add(classOnParent)
  }

  deck = bespoke.from(parent, [simpleOverview(options)])
}

describe('bespoke-simple-overview', function () {
  describe('when NOT STYLED by the plugin', function () {
    it('should NOT inject CSS onto the document', function () {
      const numberOfStylesheets = document.styleSheets.length
      createDeck({ insertStyles: false })
      expect(document.styleSheets.length).toEqual(numberOfStylesheets)
    })
  })

  describe('when styled by the plugin', function () {
    it('should inject some CSS onto the document', function () {
      const numberOfStylesheets = document.styleSheets.length
      createDeck({ insertStyles: true })
      expect(document.styleSheets.length).toBeGreaterThan(numberOfStylesheets)
    })
  })

  describe('options', function () {
    beforeEach(function () {
      createDeck({
        activationKey: 'd',
      })
    })

    it('should allow configuration for the activation key ("ESC")', function () {
      pressKey('d')
      expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(
        true
      )
    })

    it('should not use the default activation key ("ESC")', function () {
      pressKey('Esc')
      expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(
        false
      )
    })
  })

  describe('events', function () {
    beforeEach(function () {
      createDeck()
    })

    describe('"simple-overview.enable"', function () {
      it('should ACTIVATE the overview mode when "simple-overview.enable" is received', function () {
        deck.fire('simple-overview.enable')
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(
          true
        )
      })

      it('should NOT ACTIVATE the overview mode when "simple-overview.enable" is received and we are already on overview mode', function () {
        pressKey('Esc')
        deck.fire('simple-overview.enable')
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(
          true
        )
      })
    })

    describe('"simple-overview.disable"', function () {
      it('should DEACTIVATE the overview mode when "simple-overview.disable" is received', function () {
        pressKey('Esc')
        deck.fire('simple-overview.disable')
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(
          false
        )
      })

      it('should NOT DEACTIVATE the overview mode when "simple-overview.disable" is received and we are already in regular mode', function () {
        deck.fire('simple-overview.disable')
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(
          false
        )
      })
    })

    describe('"simple-overview.toggle"', function () {
      it('should to ACTIVATE the overview mode when "simple-overview.toggle" is received and it\'s in regular mode', function () {
        deck.fire('simple-overview.toggle')
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(
          true
        )
      })

      it('should to DEACTIVATE the overview mode when "simple-overview.toggle" is received and it\'s in overview mode', function () {
        pressKey('Esc')
        deck.fire('simple-overview.toggle')
        expect(deck.parent.classList.contains('bespoke-simple-overview')).toBe(
          false
        )
      })
    })

    describe('"destroy"', function () {
      it('should detach the onkeydown handler of the window object when the deck receives the "destroy" event', function () {
        deck.fire('destroy')
        expect(window.onkeydown).toBe(null)
      })
    })
  })

  describe('navigating with bespoke-bullets', function () {
    beforeEach(function () {
      let parent = document.createElement('article')
      parent.innerHTML =
        '<section><ul><li>one</li><li>two</li></ul></section><section></section>'

      deck = bespoke.from(parent, [simpleOverview(), bullets('li')])
    })

    it('should IGNORE the bullets inside a slide when in overview mode', function () {
      pressKey('Esc')
      deck.next()
      expect(deck.slide()).toBe(1)
    })

    it('should NOT IGNORE the bullets inside a slide when in regular mode', function () {
      deck.next()
      expect(deck.slide()).toBe(0)
      deck.next()
      expect(deck.slide()).toBe(1)
    })

    it('should NOT NAVIGATE to invalid slide indices in overview mode', function () {
      pressKey('Esc')
      deck.prev()
      expect(deck.slide()).toBe(0)
    })
  })
})
