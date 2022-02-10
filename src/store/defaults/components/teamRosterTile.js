import defaultQuill from './quill'

export default function ({
  imageUrl = '//via.placeholder.com/450x450',
  title = 'Title Ipsum',
  subtitle = 'Lorem ipsum dolor sit amet',
  subtext = 'Lorem ipsum',
  subtextImage = '//via.placeholder.com/30x30',
  useCustomOverlay = false,
  overlayOpacity = 85,
  useLinkout = false,
  externalLinkOut = false,
  href = "#",
  overlayColor = '#000',
  textModalColor ='#ffffff',
  useDropShadow = false,
  textShadowX = 0,
  textShadowY = 0,
  textShadowBlur = 0,
  textShadowColor = '#000000',
  bio = defaultQuill()
} = {}) {
  return {
    imageUrl,
    title,
    subtitle,
    subtext,
    subtextImage,
    useCustomOverlay,
    overlayOpacity,
    overlayColor,
    externalLinkOut,
    useLinkout,
    href,
    textModalColor,
    useDropShadow,
    textShadowX,
    textShadowY,
    textShadowBlur,
    textShadowColor,
    bio
  }
}
