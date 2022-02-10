/* eslint-disable */

const getSlug = require('../../src/helpers/get-page-id').getSlug

test('get slug works', () => {
  const expects = 'foo'

  const src = '/foo/bar/baz'
  const result = getSlug(src)

  expect(result).toEqual(expects)
})
