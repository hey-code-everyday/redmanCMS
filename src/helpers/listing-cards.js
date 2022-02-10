import api from '../api'

export function getSrcForSize (src, size) {
  const parts = src.split('/')
  if (parts.length < 4) {
    throw new Error('getSrcForSize: provided src is not a URL')
  }
  const [filename] = parts.slice().reverse()
  return src.replace(filename, `${size}/${filename}`)
}

export function getSrcset (src, sizes) {
  return sizes.map(size =>
    `${getSrcForSize(src, size.name)} ${size.width}w`
  ).join(', ')
}

export function setSrcset (listing) {
  const images = listing.images
  if (!images || !images.length) return null

  const image = images[0]

  return getSrcset(image, [
    { name: 'retina-medium', width: 1000 },
    { name: 'medium', width: 500 }
  ])

}

export function setSrc (listing) {
  const images = listing.images
  if (!images || !images.length) return ''

  let src = images[0]
  src = src.split('/')
  src.splice(src.length - 1, 0, 'medium')
  src = src.join('/')

  const image = new Image()
  image.onerror = () => {
    //this.imageSrc = images[0]
    return images[0]
  }
  image.src = src
  //this.imageSrc = src
  return src
}

export function setBgsrc (listing) {
  const images = listing.images
  if (!images || !images.length) return null

  let src = images[0]
  src = src.split('/')
  src.splice(src.length - 1, 0, 'medium')
  src = src.join('/')

  const image = new Image()
  image.onerror = () => {
    return images[0]
    //this.bgSrc = images[0]
  }
  image.src = src
  // this.bgSrc = src
  return src
}

export function getAlt (listing) {
  if (listing.address && listing.id) return "MLS® listing #"+ listing.id + " for sale located at " + listing.address
  if (listing.id) return "MLS® listing #"+ listing.id + " for sale"
  return ''
}

export function getSoldAlt (listing) {
  if (listing.streetAddress && listing.mlsNum) return "MLS® sold listing #"+ listing.mlsNum + " located at " + listing.streetAddress
  if (listing.mlsNum) return "MLS® listing #"+ listing.mlsNum + " sold"
  return ''
}

export function randomString (from, to) {
  const numChars = from + (Math.floor(Math.random() * (to - from)))

  let str = ''
  for (let i = 0; i < numChars; i++) {
    str += String.fromCharCode((65 + Math.floor(Math.random() * 25)))
  }
  return str
}

export function randomPrice () {
  const parts = [
    this.randomString(3, 3),
    this.randomString(3, 3)
  ]
  return parts.join(' ')
}

export function randomAddress () {
  const parts = [
    this.randomString(4, 6),
    this.randomString(2, 3),
    this.randomString(2, 6)
  ]
  return parts.join(' ')
}

export function getSearchResultAlt (listing) {
  return `${listing.address ? listing.address + ',' : ''} ${listing.publicId ? listing.publicId + ',' : ''} ${listing.province ? listing.province + ',' : ''}`
}
