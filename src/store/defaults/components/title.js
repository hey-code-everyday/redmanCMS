export default function ({
  html = encodeURI('Title Ipsum'),
  size = 1
} = {}) {
  return {
    html,
    size
  }
}
