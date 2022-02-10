function encodeHTML (source) {
  return encodeURI(source)
}

function decodeHTML (source) {
  return decodeURI(source)
}

function encodeObject (source) {
  source = JSON.parse(JSON.stringify(source))

  if (typeof source === 'string') {
    return encodeHTML(source)
  }

  if (source instanceof Object && !(source instanceof Array)) {
    for (let key in source) {
      source[key] = encodeObject(source[key])
    }
    return source
  }

  if (source instanceof Array) {
    return source.map(item => {
      return encodeObject(item)
    })
  }

  return source
}

function decodeObject (source) {
  source = JSON.parse(JSON.stringify(source))

  if (typeof source === 'string') {
    return decodeHTML(source)
  }

  if (source instanceof Object && !(source instanceof Array)) {
    for (let key in source) {
      source[key] = decodeObject(source[key])
    }
    return source
  }

  if (source instanceof Array) {
    return source.map(item => {
      return decodeObject(item)
    })
  }

  return source
}

export {
  encodeHTML,
  decodeHTML,
  encodeObject,
  decodeObject
}
