export function parseBlogUrl (url) {
  const parts = url.split('?')

  const path = parts[0]
  const query = parts[1]

  const pathParts = path
    .replace('https://', '')
    .replace('http://', '')
    .replace('//', '')
    .split('/')

  const params = {}

  if (query) {
    const queryParts = query.replace('?', '').split('&')
    queryParts.forEach(q => {
      const p = q.split('=')
      params[p[0]] = p[1]
    })
  }

  if (pathParts[1]) params.slug = pathParts[1] // slug
  if (pathParts[5]) params.postID = pathParts[5] // postID
  if (pathParts[2] === 'category') params.category = pathParts[3] // category

  return params
}
