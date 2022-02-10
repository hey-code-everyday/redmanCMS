function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function clamp (val, min, max) {
  return Math.min(Math.max(val, min), max)
}

function clamp01 (val) {
  return clamp(val, 0, 1)
}

function kebabToCamel (str) {
  const parts = str.split('-')
  parts.forEach((p, i) => {
    parts[i] = p[0].toUpperCase() + p.substring(1)
  })
  return parts.join('')
}

export {
  clone,
  clamp,
  clamp01,
  kebabToCamel
}
