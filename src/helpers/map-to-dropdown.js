export default function mapToDropdown (source, valueKey, textKey) {
  return source.map(item => {
    return { value: item[valueKey], text: item[textKey] }
  })
}
