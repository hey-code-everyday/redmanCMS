export default function ({
  x = 0,
  y = 0,
  blur = 1,
  color = '#000000'
} = {}) {
  return {
    x,
    y,
    blur,
    color
  }
}
