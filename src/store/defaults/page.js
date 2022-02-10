import createStrap from './strap'

export default function (slug, noHero) {
  const hero = createStrap('hero')

  return {
    slug: slug || '',
    metaInfo: {
      title: 'My Page',
      imageUrl: '',
      description: 'This is a brand new page.'
    },
    hero: noHero ? undefined : hero,
    straps: []
  }
}
