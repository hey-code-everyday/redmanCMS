import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const filters = {
  listingPrice (value, sep = ' ') {
    if (!value) return ''

    if (value <= 1000) return '$' + value + '/sqft'
    else return '$' + filters.bigNumber(value)
  },

  phoneNumber (value, sep = '-') {
    if (!value) return ''
    const original = value

    value = value.replace(/[()\-.\s+]/g, '')

    let number = parseInt(value)
    if (isNaN(number)) return original
    number = String(number)

    const groups = number.match(/^(\d{1,3})*(\d{3})(\d{3})(\d{4})$/)
    if (!groups) return original

    const callCode = groups[1]
    groups.shift()
    groups.shift()

    const result = (callCode ? '+' + callCode + ' ' : '') + groups.join(sep)

    return result
  },

  bigNumber (value, sep = ',') {
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
  },

  fullName (value, keys) {
    if (!value) return ''

    if (!keys) {
      keys = {
        first: 'first',
        last: 'last'
      }
    }

    let fullName = ''
    if (value[keys.first] && value[keys.last]) {
      fullName = value[keys.first] + ' ' + value[keys.last]
    } else if (value.first) {
      fullName = value.first
    } else if (value[keys.last]) {
      fullName = value[keys.last]
    } else {
      fullName = 'Not supplied'
    }

    return fullName
  },

  fromNow (value) {
    return dayjs(value).fromNow()
  },

  formatKey (value) {
    value = value.replace(/[-_]/g, ' ')
    value = value.toLowerCase()
    value = value[0].toUpperCase() + value.slice(1)

    return value
  },

  formatField (value) {
    // True
    if (value === true || value.toString().toLowerCase() === 'true') {
      return '<span class="icon is-primary"><i class="icon-check"></i></span>'
    }

    // False
    if (value === false || value.toString().toLowerCase() === 'false') {
      return '<span class="icon is-danger"><i class="icon-cross"></i></span>'
    }

    // Object
    if (typeof value === 'object') {
      return '<pre>' + JSON.stringify(value, undefined, 2) + '</pre>'
    }

    // Email
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
    if (regex.test(value)) {
      return `<a href="mailto:${value}">${value}</a>`
    }

    return value
  },

  monthYearFormat (date) {
    try {
      const a = new Date(date)
      const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
      return `${monthNames[a.getMonth()]} ${a.getFullYear()}`
    } catch (e) {
      return date
    }
  },

  firstLetterUppercase(stringVal) {
    if (typeof(stringVal) === 'string') {
      return `${stringVal[0].toUpperCase()}${stringVal.slice(1, stringVal.length)}`
    } else {
      return stringVal
    }
  }
}

export default filters
