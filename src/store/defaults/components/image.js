export default function ({
  height = 0,
  width = 0,
  filter = 'none',
  imageUrl = '//via.placeholder.com/64x64',
  href = '',
  linkOut = false,
  altText = ''
} = {}) {
  return {
    height,
    width,
    filter,
    imageUrl,
    href,
    linkOut,
    altText
  }
}
