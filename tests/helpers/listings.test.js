/* eslint-disable */

const { isDetailsUrl, isSearchUrl } = require('../../src/helpers/listings')

test("urls aren't details", () => {
  const urls = [
    'http://www.purrfect-properties.com/southwest-edmonton-properties',
    'http://www.purrfect-properties.com/edmonton-props-for-sale/listing--e12345',
    'http://www.purrfect-properties.com/edmonton-for-lease-url/listing--e12345',
    'http://www.purrfect-properties.com/for-sale-lease/listing--e12345',
    'http://www.purrfect-properties.com/edmonton-props-for-sale',
    'http://www.purrfect-properties.com/edmonton-for-lease-url'
  ]

  urls.forEach(url => {
    expect(isDetailsUrl(url)).toEqual(false)
  })
})

test("urls are details", () => {
  const urls = [
    'http://www.purrfect-properties.com/for-sale/listing--e12345',
    'http://www.purrfect-properties.com/for-lease/listing--e12345'
  ]

  urls.forEach(url => {
    expect(isDetailsUrl(url)).toEqual(true)
  })
})

test("urls aren't search", () => {
  const urls = [
    'http://www.purrfect-properties.com/search-edmonton',
    'http://www.purrfect-properties.com/edmonton-search/'
  ]

  urls.forEach(url => {
    expect(isSearchUrl(url)).toEqual(false)
  })
})

test("urls are search", () => {
  const urls = [
    'http://www.purrfect-properties.com/search',
    'http://www.purrfect-properties.com/search/',
    'http://www.purrfect-properties.com/search/99999'
  ]

  urls.forEach(url => {
    expect(isSearchUrl(url)).toEqual(true)
  })
})