/* eslint-disable */

const mapToDropdown = require('../../src/helpers/map-to-dropdown').default

test('array mapped to dropdown works', () => {
  const source = [
    { id: 'world', name: 'Hello' },
    { id: 'bar', name: 'Foo' }
  ]
  const expects = [
    { text: 'Hello', value: 'world' },
    { text: 'Foo', value: 'bar' }
  ]

  const result = mapToDropdown(source, 'id', 'name')

  expect(result).toEqual(expects)
})
