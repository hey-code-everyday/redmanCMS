export default function () {
  return [
    {
      title: 'Slider',
      tabs: [
        {
          title: 'Slides',
          initial: true,
          fields: [
            {
              key: 'state.numSlides',
              type: 'number',
              label: 'Number of Slides',
              step: 1,
              minValue: 1,
              maxValue: 25,
              hint: 'Number of slides to display. Between 1 and 25.'
            }
          ]
        },
        {
          title: 'Configuration',
          fields: [
            {
              key: 'state.sliderOptions.wrapAround',
              type: 'checkbox',
              label: 'Wrap Around',
              text: 'Wrap around to the first slide after the last',
              onValue: true,
              offValue: false
            },
            {
              key: 'state.sliderOptions.autoPlay',
              type: 'number',
              label: 'Auto-Play Interval',
              step: 1000,
              minValue: 0,
              maxValue: 300000,
              hint: 'Interval in milliseconds to hold each slide for. 0 to disable.'
            },
            {
              key: 'state.sliderOptions.prevNextButtons',
              type: 'checkbox',
              label: 'Pagination Buttons',
              text: 'Show next and previous buttons',
              onValue: true,
              offValue: false
            },
            {
              key: 'state.sliderOptions.pageDots',
              type: 'checkbox',
              label: 'Pagination Dots',
              text: 'Show pagination dots',
              onValue: true,
              offValue: false
            }
          ]
        },
        {
          title: 'Advanced',
          fields: [
            {
              key: 'state.sliderOptions.draggable',
              type: 'checkbox',
              label: 'Draggable',
              text: 'Allow dragging/touch to change slides',
              onValue: true,
              offValue: false
            },
            {
              key: 'state.sliderOptions.freeScroll',
              type: 'checkbox',
              label: 'Free Scroll',
              text: 'Don\'t snap to the nearest slide after dragging',
              onValue: true,
              offValue: false
            },
            {
              key: 'state.sliderOptions.pauseAutoPlayOnHover',
              type: 'checkbox',
              label: 'Pause Auto-Play on Hover',
              text: 'Pause auto-play when hovering over a slide',
              onValue: true,
              offValue: false
            },
            {
              key: 'state.sliderOptions.friction',
              type: 'number',
              label: 'Scroll Friction',
              step: 0.01,
              minValue: 0,
              maxValue: 2,
              placeholder: '0.28'
            },
            {
              key: 'state.sliderOptions.selectedAttraction',
              type: 'number',
              label: 'Scroll Gravity',
              step: 0.01,
              minValue: 0,
              maxValue: 2,
              placeholder: '0.025'
            }
          ]
        }
      ]
    }
  ]
}
