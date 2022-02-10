export default function ({
  imageUrl = '//via.placeholder.com/350x350',
  title = 'Title Ipsum',
  subtitle = 'Lorem ipsum dolor sit amet',
  text1 = '100%',
  tag1 = 'Listings Sold',
  text2 = '10',
  tag2 = 'Days On Market',
  text3 = '100%',
  tag3 = 'Average Sale Price vs List',
  text4 = '100%',
  tag4 = 'Average Sale Price vs List For Buyers',
  useCustomOverlay = false,
  overlayOpacity = 85,
  overlayColor = '#000'
} = {}) {
  return {
    imageUrl,
    title,
    subtitle,
    text1,
    tag1,
    text2,
    tag2,
    text3,
    tag3,
    text4,
    tag4,
    useCustomOverlay,
    overlayOpacity,
    overlayColor
  }
}
