function getRoundedClientRect (el) {
  const rect = el.getBoundingClientRect()

  const x = Math.round(rect.x)
  const y = Math.round(rect.y)
  const width = Math.round(rect.width)
  const height = Math.round(rect.height)

  return { x, y, width, height }
}

export default {
  getRoundedClientRect
}
