import { parseBlogUrl } from '@/helpers/blog'
import { isDetailsUrl, isSearchUrl } from '@/helpers/listings'

export function getSlug (path) {
  const fullPath = (path.replace('/', '')).split('/')
  return fullPath[0]
}

export default function getPageId (config) {
  const requestUrl = config.requestUrl
  const blogUrl = parseBlogUrl(config.requestUrl)

  if (blogUrl.slug === 'blog' && blogUrl.postID) {
    return 'blog-post'
  } else if (isDetailsUrl(requestUrl)) {
    return 'listing-details'
  } else if (isSearchUrl(requestUrl)) {
    return 'listing-search'
  }

  return getSlug(window.location.pathname)
}
