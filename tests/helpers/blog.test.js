/* eslint-disable */

const { parseBlogUrl } = require('../../src/helpers/blog')

const feedUrls = [
  'https://localhost:8080/posts',
  'http://localhost:8080/posts',
  '//localhost:8080/posts',
  'localhost:8080/posts',
  'https://www.redmantech.ca/posts',
  'http://www.redmantech.ca/posts',
  '//www.redmantech.ca/posts',
  'www.redmantech.ca/posts'
]

test('parsing feed url works', () => {
  feedUrls.forEach(url => {
    expect(parseBlogUrl(url)).toEqual({
      slug: 'posts'
    })
    expect(parseBlogUrl(url + '/')).toEqual({
      slug: 'posts'
    })
  })
})

test('parsing feed url with page works', () => {
  feedUrls.forEach(url => {
    expect(parseBlogUrl(url + '?page=1')).toEqual({
      slug: 'posts',
      page: '1'
    })
    expect(parseBlogUrl(url + '/?page=1')).toEqual({
      slug: 'posts',
      page: '1'
    })
  })
})

const categoryUrls = [
  'https://localhost:8080/posts/category/hello-world',
  'http://localhost:8080/posts/category/hello-world',
  '//localhost:8080/posts/category/hello-world',
  'localhost:8080/posts/category/hello-world',
  'https://www.redmantech.ca/posts/category/hello-world',
  'http://www.redmantech.ca/posts/category/hello-world',
  '//www.redmantech.ca/posts/category/hello-world',
  'www.redmantech.ca/posts/category/hello-world'
]

test('parsing category url works', () => {
  categoryUrls.forEach(url => {
    expect(parseBlogUrl(url)).toEqual({
      slug: 'posts',
      category: 'hello-world'
    })
    expect(parseBlogUrl(url + '/')).toEqual({
      slug: 'posts',
      category: 'hello-world'
    })
  })
})

test('parsing category url with page works', () => {
  categoryUrls.forEach(url => {
    expect(parseBlogUrl(url + '?page=1')).toEqual({
      slug: 'posts',
      category: 'hello-world',
      page: '1'
    })
    expect(parseBlogUrl(url + '/?page=1')).toEqual({
      slug: 'posts',
      category: 'hello-world',
      page: '1'
    })
  })
})

const postUrls = [
  'https://localhost:8080/post/2018/01/25/hello-world',
  'http://localhost:8080/post/2018/01/25/hello-world',
  '//localhost:8080/post/2018/01/25/hello-world',
  'localhost:8080/post/2018/01/25/hello-world',
  'https://www.redmantech.ca/post/2018/01/25/hello-world',
  'http://www.redmantech.ca/post/2018/01/25/hello-world',
  '//www.redmantech.ca/post/2018/01/25/hello-world',
  'www.redmantech.ca/post/2018/01/25/hello-world'
]

test('parsing feed url works', () => {
  postUrls.forEach(url => {
    expect(parseBlogUrl(url)).toEqual({
      slug: 'post',
      postID: 'hello-world'
    })
    expect(parseBlogUrl(url + '/')).toEqual({
      slug: 'post',
      postID: 'hello-world'
    })
  })
})
