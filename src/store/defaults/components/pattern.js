export default function ({
  height = 15,
  filter = 'none',
  imageUrl = '//via.placeholder.com/64x64',
  squish = true
} = {}) {
  return {
    height,
    imageUrl,
    filter,
    squish
  }
}
