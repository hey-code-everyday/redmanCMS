/* eslint-disable */

const { encodeHTML, decodeHTML, encodeObject, decodeObject } = require('../../src/helpers/html-encode')

/* Encoding */

test('encoding string works', () => {
  const expected = "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E"

  const src = "<p><img src='//google.com/image.png' /></p>"
  const result = encodeHTML(src)

  expect(result).toEqual(expected)
})

test('encoding object (string) works', () => {
  const expected = "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E"

  const src = "<p><img src='//google.com/image.png' /></p>"
  const result = encodeObject(src)

  expect(result).toEqual(expected)
})

test('encoding object (array) works', () => {
  const expected = [
    "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E",
    [ "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E" ],
    { foo: "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E" },
    1
  ]

  const src = [
    "<p><img src='//google.com/image.png' /></p>",
    [ "<p><img src='//google.com/image.png' /></p>" ],
    { foo: "<p><img src='//google.com/image.png' /></p>" },
    1
  ]
  const result = encodeObject(src)

  expect(result).toEqual(expected)
})

test('encoding object (object) works', () => {
  const expected = {
    foo1: "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E",
    foo2: [ "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E" ],
    foo3: { foo: "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E" },
    foo4: 1
  }

  const src = {
    foo1: "<p><img src='//google.com/image.png' /></p>",
    foo2: [ "<p><img src='//google.com/image.png' /></p>" ],
    foo3: { foo: "<p><img src='//google.com/image.png' /></p>" },
    foo4: 1
  }
  const result = encodeObject(src)

  expect(result).toEqual(expected)
})

/* Decoding */

test('decoding string works', () => {
  const expected = "<p><img src='//google.com/image.png' /></p>"

  const src = "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E"
  const result = decodeHTML(src)

  expect(result).toEqual(expected)
})

test('decoding object (string) works', () => {
  const expected = "<p><img src='//google.com/image.png' /></p>"

  const src = "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E"
  const result = decodeObject(src)

  expect(result).toEqual(expected)
})

test('decoding object (array) works', () => {
  const expected = [
    "<p><img src='//google.com/image.png' /></p>",
    [ "<p><img src='//google.com/image.png' /></p>" ],
    { foo: "<p><img src='//google.com/image.png' /></p>" },
    1
  ]

  const src = [
    "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E",
    [ "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E" ],
    { foo: "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E" },
    1
  ]
  const result = decodeObject(src)

  expect(result).toEqual(expected)
})

test('decoding object (object) works', () => {
  const src = {
    foo1: "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E",
    foo2: [ "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E" ],
    foo3: { foo: "%3Cp%3E%3Cimg%20src='//google.com/image.png'%20/%3E%3C/p%3E" },
    foo4: 1
  }

  const expected = {
    foo1: "<p><img src='//google.com/image.png' /></p>",
    foo2: [ "<p><img src='//google.com/image.png' /></p>" ],
    foo3: { foo: "<p><img src='//google.com/image.png' /></p>" },
    foo4: 1
  }
  const result = decodeObject(src)

  expect(result).toEqual(expected)
})
