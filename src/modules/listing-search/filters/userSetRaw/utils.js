
export const encodeValue = (value, config) => {
  if (typeof value !== 'number' && !value.length) return null

  // in the special case where value is a string and there is no operator or
  // operator is just ≈ we dont bother with the square brackets
  if (
    typeof value === 'string' &&
    (!config.rawFieldOperator || config.rawFieldOperator === '≈')
  ) return value

  const operator = config.rawFieldOperator || ''
  return `${operator}[${value}]`
}
