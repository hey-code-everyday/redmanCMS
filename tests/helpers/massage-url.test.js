/* eslint-disable */

const massageUrl = require('../../src/helpers/massage-url').default

test('vague url remains unchanged', () => {
  const expects = 'google.com'

  const src = 'google.com'
  const result = massageUrl(src)

  expect(result).toEqual(expects)
})

test('qualified urls remain unchanged', () => {
  const expects = [
    '//google.com',
    'http://google.com',
    'https://google.com'
  ]

  const src = [
    '//google.com',
    'http://google.com',
    'https://google.com'
  ]

  src.forEach((s, i) => {
    const result = massageUrl(s)
    expect(result).toEqual(expects[i])
  })
})

test('unqualified url massaged', () => {
  const expects = '//www.google.com'

  const src = 'www.google.com'
  const result = massageUrl(src)

  expect(result).toEqual(expects)
})
