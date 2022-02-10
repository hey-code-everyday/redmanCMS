import heroes from '@/components/heroes/heroes'

const heroOptions = Object.keys(heroes).map(key => {
  return { text: heroes[key].name, value: key }
})

export default function (strap) {
  const title = strap.id === 'hero' ? 'Hero Settings' : 'Strap Settings'

  const schema = {
    groups: [
      {
        key: 'strapConfig',
        title,
        panels: [
          {
            title: 'General',
            tabs: [
              {
                title: 'General',
                initial: true,
                fields: [
                  {
                    key: 'config.hidden',
                    type: 'checkbox',
                    label: 'Hidden',
                    text: 'Hide this strap',
                    default: false,
                    onValue: true,
                    offValue: false,
                    hint: 'Hidden straps will only be visible while editing.'
                  },
                  {
                    key: 'config.outerClasses',
                    type: 'text',
                    label: 'Outer Classes',
                    default: '',
                    hint: 'CSS classes on the outer area of the strap.',
                    placeholder: 'my-class1 my-class2'
                  },
                  {
                    key: 'config.innerClasses',
                    type: 'text',
                    label: 'Inner Classes',
                    default: '',
                    hint: 'CSS classes on the inner area of the strap.',
                    placeholder: 'my-class1 my-class2'
                  },
                  {
                    key: 'name',
                    type: 'readOnlyText',
                    label: 'Strap Name',
                    hint: 'Useful for developers.'
                  },
                  {
                    key: 'id',
                    type: 'readOnlyText',
                    label: 'Strap ID',
                    hint: 'Useful for developers.'
                  }
                ]
              }
            ]
          },
          {
            title: 'Appearance',
            tabs: [
              {
                title: 'Appearance',
                fields: [
                  {
                    key: 'config.style.theme',
                    type: 'dropdown',
                    label: 'Palette',
                    default: 'value1',
                    hint: 'This straps colors for buttons, links, text, etc.',
                    options: [
                      { text: 'Normal', value: 'default' },
                      { text: 'Alternate', value: 'alternate' },
                      { text: 'Featured', value: 'feature' }
                    ]
                  },
                  {
                    key: 'config.style.textAlign',
                    type: 'dropdown',
                    label: 'Text Alignment',
                    default: 'center',
                    hint: 'Not supported by every strap.',
                    options: [
                      { text: 'Left', value: 'left' },
                      { text: 'Center', value: 'centered' },
                      { text: 'Right', value: 'right' },
                      { text: 'Justify', value: 'justify' }
                    ]
                  },
                  {
                    key: 'config.style.rule',
                    type: 'checkbox',
                    label: 'Divider',
                    hint: 'Display a horizontal divider below this strap.',
                    text: 'Show divider',
                    default: true,
                    onValue: true,
                    offValue: false
                  }
                ]
              },
              {
                title: 'Overlay',
                fields: [
                  {
                    key: 'config.style.overlayStyle',
                    type: 'dropdown',
                    label: 'Overlay Style',
                    default: 'center',
                    hint: 'Use colors from the strap palette or use your own.',
                    options: [
                      { text: 'Solid (from palette)', value: 'solid' },
                      { text: 'Solid (custom)', value: 'solid-custom' },
                      { text: 'Gradient (from palette)', value: 'gradient' },
                      { text: 'Gradient (custom)', value: 'gradient-custom' }
                    ]
                  },
                  {
                    key: 'config.style.overlayAlpha',
                    type: 'number',
                    label: 'Overlay Transparency',
                    default: 85,
                    hint: 'Overlay transparency between 0 and 100 percent.',
                    placeholder: '100',
                    minValue: 0,
                    maxValue: 100,
                    step: 5
                  },
                  {
                    key: 'config.style.overlayColor',
                    type: 'color',
                    label: 'Custom Color',
                    default: '#000000',
                    hint: 'The custom color to use for the overlay.',
                    placeholder: '#000000'
                  },
                  {
                    key: 'config.style.overlayGradient',
                    type: 'gradient',
                    label: 'Custom Gradient',
                    default: {
                      angle: 0,
                      colors: [
                        { color: '#ffffff', pos: 0 },
                        { color: '#000000', pos: 1 }
                      ]
                    },
                    hint: 'The custom gradient to use for the overlay.'
                  }
                ]
              },
              {
                title: 'Background',
                fields: [
                  {
                    key: 'config.style.bgImage',
                    type: 'backgroundImages',
                    label: 'Background Images',
                    default: { imageUrls: [''] },
                    hint: 'A list of background images to use.',
                    hasManyImages: false
                  },
                  {
                    key: 'config.style.bgImage.transitionStyle',
                    type: 'dropdown',
                    label: 'Transition Style',
                    default: 'slide',
                    hint: 'How do you want slides to transition?',
                    options: [
                      { text: 'Slide', value: 'slide' },
                      { text: 'Fade', value: 'fade' },
                      { text: 'Slide w/controls', value: 'slide-controls'}
                    ]
                  },
                  {
                    key: 'config.style.bgImage.transitionInterval',
                    type: 'number',
                    label: 'Transition Interval',
                    default: 4,
                    hint: 'How long (in seconds) do you want to hold each slide for?',
                    placeholder: '4',
                    minValue: 0.1,
                    maxValue: 300,
                    step: 1
                  },
                  {
                    type: 'hr'
                  },
                  {
                    key: 'config.style.bgVideo',
                    type: 'backgroundVideo',
                    label: 'Background Video',
                    default: { webmUrl: '', oggUrl: '', mp4Url: '' },
                    hint: 'If only one format is available, mp4 is prefered.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }

  if (strap.id === 'hero') {
    const appearanceTab = schema.groups[0].panels[1].tabs[0]
    appearanceTab.fields.unshift({
      key: 'name',
      type: 'dropdown',
      label: 'Template',
      default: 'default',
      hint: 'Set the visual style and layout of your hero.',
      options: heroOptions
    })
  }

  return schema
}
