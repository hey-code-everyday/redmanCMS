export default function ({
  x = 0,
  y = 4,
  blur = 7,
  spread = 0,
  color = '#000000'
} = {}) {
  return {
    x,
    y,
    blur,
    spread,
    color
  }
}
