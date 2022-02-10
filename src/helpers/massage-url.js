export default function massageUrl (url) {
  if (url.slice(0, 3) === 'www') {
    return '//' + url
  }
  return url
}
