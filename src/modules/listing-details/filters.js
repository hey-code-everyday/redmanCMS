export default {
  phoneNumber (value, sep = '-') {
    if (!value) return ''
    const original = value

    value = value.replace(/[()\-.\s+]/g, '')

    let number = parseInt(value)
    if (isNaN(number)) return original
    number = String(number)

    const groups = number.match(/^(\d{1,3})*(\d{3})(\d{3})(\d{4})$/)
    if (!groups || !groups[1]) return original

    const callCode = groups[1]
    groups.shift()
    groups.shift()

    return (callCode ? `+${callCode} ` : '') + groups.join(sep)
  },

  price (value, sep = ' ') {
    return value
      .toString()
      .split('')
      .reverse()
      .join('')
      .match(/([\w\d]{1,3})/g)
      .join(sep)
      .split('')
      .reverse()
      .join('')
  }
}
