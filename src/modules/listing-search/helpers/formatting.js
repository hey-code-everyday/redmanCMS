// @flow

import kebabCase from 'lodash/kebabCase'
const slugify = text => kebabCase(text.replace(/&/g,'-and-'))

export function thousandsSeparator (input: string | number, separator: string = ' ') {
  const inputStr = String(input)
  if (inputStr.length < 4) {
    return inputStr
  }
  const head = inputStr.substring(0, inputStr.length - 3)
  const tail = inputStr.substring(inputStr.length - 3)
  return `${thousandsSeparator(head, separator)}${separator}${tail}`
}

export function formatSqft (sqft: number) {
  if (!sqft) {
    return sqft
  }
  return `${Math.round(sqft)} sqft`
}

export function formatPrice (price: number) {
  if (!price || price < 0 || isNaN(price)) {
    return null
  }
  const dollars = Math.round(price)
  return `$${thousandsSeparator(dollars)}`
}

export function formatPriceRounded (price: number) {
  if (price <= 0 || isNaN(price)) {
    return null
  } else if (price < 1000) {
    return `$${Math.round(price)}`
  } else if (price < 1000000) {
    return `$${Math.round(price / 1000)}K`
  } else {
    return `$${Math.round(price / 1000000)}M`
  }
}

export function createDecodeSlug (pattern: RegExp, key: string, value: string) {
  return function (slug: string) {
    const match = pattern.exec(slug)
    if (match && match.length >= 2) {
      return {[key]: value.replace('%', match[1])}
    }
    return null
  }
}

export function listingDetailsHref (template: string, mls: string, address: ?string) {
  if (address && address.indexOf('-') > 0) address = address.replace(/-/g, '')

  const slug = address
    ? `${slugify(address).toLowerCase()}--${mls}`
    : mls
  return template.replace('%mls%', slug).replace('%slug%', slug)
}

export function deslugify (slug: string): string {
  return slug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}
