import createStrap from './strap'

export default function (error, code) {
  let title = 'An Error Has Occurred'
  let description = 'There was a problem loading the page.'
  switch (code) {
    case 404:
      title = 'Page Not Found'
      description = 'The page you are looking for could not be found.'
      break
    case 500:
      title = 'Internal Server Error'
      description = 'There was a problem loading the page.'
      break
  }

  const errorStrap = createStrap('error', -1, 'strap-error')
  errorStrap.state = {
    error,
    code
  }

  return {
    error: true,
    slug: '/',
    metaInfo: {
      title,
      description,
      htmlAttrs: {
        statusCode: code
      }
    },
    hero: undefined,
    straps: [ errorStrap ]
  }
}
