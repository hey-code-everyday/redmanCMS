function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function clamp01 (value) {
  return clamp(value, 0, 1)
}

export default {
  clamp,
  clamp01
}