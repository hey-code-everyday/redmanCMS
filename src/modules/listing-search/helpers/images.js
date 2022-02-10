// @flow

import {thousandsSeparator} from './formatting'

type sizesDef = {
  name: string,
  width: number
}

type fitParameters = {
  innerW: number,
  innerH: number,
  outerW: number,
  outerH: number
}

type fitReturn = {
  innerW: number,
  offsetT?: number,
  offsetL?: ?number
}

export const listingSizes = '(max-width: 768px) 100vw, (max-width: 1007px) 50vw, (max-width: 1199px) 340px, (max-width: 1391px) 362px, 426px'

export function getSrcForSize (src: string, size: string) {
  const parts = src.split('/')
  if (parts.length < 4) {
    throw new Error('getSrcForSize: provided src is not a URL')
  }
  const [filename] = parts.slice().reverse()
  return src.replace(filename, `${size}/${filename}`)
}

export function getSrcset (src: string, sizes: Array<sizesDef>) {
  if (src.indexOf("https://photos.brivity.com/images/") !== -1) {
    return getSoldSrcset(src, sizes)
  }
  return sizes.map(size =>
    `${getSrcForSize(src, size.name)} ${size.width}w`
  ).join(', ')
}

export function getSoldSrcset (src: string, sizes: Array<sizesDef>) {
  return sizes.map(size =>{
    if (src.split('/').length < 4) return null
    return `${src}&width=${size.width}`
  }).join(', ')
}

export function getAltText (source: Object): string {
  const parts = [
    (source.address || 'Property'),
    (source.bedrooms ? `${source.bedrooms} bed` : false),
    (source.bathrooms ? `${source.bathrooms} bath` : false),
    (source.price ? `at $${thousandsSeparator(source.price, ',')}` : false)
  ].filter(x => x)
  return parts.join(', ')
}

export function fitBoxes ({innerW, innerH, outerW, outerH}: fitParameters): fitReturn {
  const innerAspect = innerW / innerH
  const outerAspect = outerW / outerH
  if (innerAspect > outerAspect) {
    return {
      innerW: outerW,
      offsetT: (outerH - innerH) / 2
    }
  } else {
    const newInnerW = outerH * innerAspect
    return {
      innerW: newInnerW,
      offsetL: (outerW - newInnerW) / 2
    }
  }
}
