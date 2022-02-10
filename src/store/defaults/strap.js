import uuid from 'uuid/v4'
import defaultQuill from './components/quill'
import defaultTitle from './components/title'
import defaultButton from './components/button'
import defaultSearchBar from './components/searchBar'
import defaultText from '@/store/defaults/components/text'
import defaultVueSlider from '@/store/defaults/components/vueSlider'
import defaultNumberDropdown from '@/store/defaults/components/numberDropdown'
import defaultVueSliderMultiple from '@/store/defaults/components/vueSliderMultiple'

export default function (id, order, name, color1, color2) {
  const defaultHeroState = {
    text: defaultQuill(),
    title: defaultTitle({ html: 'Hero Basic' }),
    buttonList: [defaultButton()],
    searchBar: defaultSearchBar({ background: 'dark' }),
    footerComponent: 'search',
    area: defaultVueSlider({ min: 0, max: 10000, initial: 1400 }),
    baths: defaultNumberDropdown({ min: 1, max: 10, initial: 2 }),
    beds: defaultNumberDropdown({ min: 1, max: 10, initial: 2 }),
    buttonText: defaultText({ text: 'Find Listings' }),
    priceRange: defaultVueSliderMultiple({min: 0, max: 1000000, initialStart: 200000, initialEnd: 600000, interval: 50000 }),
  }

  const state = id === 'hero' ? defaultHeroState : {}

  return {
    id: id || uuid(),
    order: order || 0,
    name: name || (id === 'hero' ? 'hero-basic' : 'strap-text'),
    config: {
      hidden: false,
      outerClasses: '',
      innerClasses: '',
      style: {
        rule: true,
        theme: id === 'hero' ? 'feature' : 'default',
        textAlign: 'centered',
        bgTransparent: false,
        bgImage: {
          imageUrls: [''],
          repeat: false,
          greyscale: false,
          transitionInterval: 4,
          transitionStyle: 'slide'
        },
        bgVideo: {
          mp4Url: '',
          webmUrl: '',
          oggUrl: ''
        },
        overlayStyle: 'solid',
        overlayAlpha: 85,
        overlayColor: color1 || '#000000',
        overlayGradient: {
          angle: 135,
          colors: [
            { color: color1 || '#000000', pos: 0 },
            { color: color2 || '#000000', pos: 1 }
          ]
        }
      }
    },
    state
  }
}
