import Color from 'color'
import lightMapStyles from './map-light'
import darkMapStyles from './map-dark'

export default {
  map: {
    light: lightMapStyles,
    dark: darkMapStyles
  },
  schema: {
    'gus-app': {
      background: {value: 'backgroundColor'},
      color: {value: 'textColor'},
      'font-family': {value: 'textFontFamily'}
    },

    'gus-reset-colors': {
      background: {value: 'backgroundColor'},
      color: {value: 'textColor'}
    },

    'gus-primary': {
      color: {value: 'primaryColor'}
    },

    'gus-bg-primary': {
      background: {value: 'primaryColor'},
      color: {value: 'primaryTextColor'}
    },

    'gus-border-primary': {
      'border-color': {value: 'primaryColor', important: true},
      'border-bottom-color': {value: 'primaryColor', important: true},
      'border-radius': {value: 'borderRadius'}
    },

    'gus-light-text': {
      color: {value: 'lightTextColor'}
    },

    // Main panel
    'gus-panel': {
      color: {
        value: 'textColor'
      }
    },

    // Box
    'gus-box': {
      backgroundColor: {
        value: 'backgroundColor'
      },
      color: {
        value: 'textColor'
      },
      boxShadow: {
        value: 'boxShadow'
      },
      borderRadius: {
        value: 'borderRadius'
      }
    },

    // Box
    'gus-box-fixed': {
      backgroundColor: {
        value: 'backgroundColor'
      },
      color: {
        value: 'textColor'
      },
      boxShadow: {
        value: 'boxShadowFixed'
      }
    },

    // Light coloured text
    'gus-text-soft': {
      color: {
        value: 'lightTextColor',
        important: true
      }
    },

    // Titles
    'gus-title': {
      color: {
        value: 'titleColor',
        important: true
      },
      fontFamily: {
        value: 'titleFontFamily',
        important: true
      },
      fontWeight: {
        value: 'titleFontWeight',
        important: true
      }
    },

    // Primary buttons
    'gus-button': {
      backgroundColor: {
        value: 'primaryColor',
        important: true
      },
      color: {
        value: 'primaryTextColor',
        important: true
      },
      borderRadius: {
        value: 'borderRadius'
      }
    },

    // Outline buttons
    'gus-button-outline': {
      backgroundColor: {
        value: 'transparent',
        important: true,
        literal: true
      },
      borderColor: {
        value: 'primaryColor',
        important: true
      },
      color: {
        value: 'primaryColor',
        important: true
      }
    },

    // Media buttons
    'gus-button-media': {
      backgroundColor: {
        value: 'mediaColor',
        important: true
      },
      color: {
        value: 'mediaTextColor',
        important: true
      }
    },

    // Media text
    'gus-text-media': {
      color: {
        value: 'mediaTextColor',
        important: true
      }
    },

    // Media gradient
    'gus-media-grad': {
      backgroundImage: {
        value (styles) {
          const max = 0.6
          const min = 0
          const mid = (min + max) / 2

          const colorFrom = Color(styles.mediaColor).fade(1 - max).string()
          const colorMid = Color(styles.mediaColor).fade(1 - mid).string()
          const colorMid2 = Color(styles.mediaColor).fade(1 - ((mid + min) / 2)).string()
          const colorTo = Color(styles.mediaColor).fade(1 - min).string()

          return `linear-gradient(to top, ${colorFrom} 0%, ${colorMid} 40%, ${colorMid2} 60%, ${colorTo} 100%)`
        },
        important: true
      }
    },

    // Input
    'gus-input': {
      borderColor: {
        value (styles) { return Color(styles.lightTextColor).fade(0.6).string() },
        important: true
      },
      borderRadius: {
        value: 'borderRadius'
      },
      fontFamily: {
        value: 'textFontFamily'
      },
      color: {
        value: 'textColor'
      },
      ':focus': {
        borderColor: {
          value: 'primaryColor',
          important: true
        }
      }
    },

    // Icons
    'gus-icon': {
      color: {
        value: 'lightTextColor',
        important: true
      }
    },

    // Icon links
    'gus-icon-link': {
      color: {
        value: 'lightTextColor',
        important: true
      },
      ':hover': {
        color: {
          value: 'primaryColor',
          important: true
        }
      }
    },

    // Links
    'gus-link': {
      color: {
        value: 'primaryColor',
        important: true
      }
    },

    // Neutral links
    'gus-link-text': {
      color: {
        value: 'textColor',
        important: true
      }
    },

    // Light coloured links
    'gus-link-soft': {
      color: {
        value: 'lightTextColor',
        important: true
      }
    },

    // Modal background
    'gus-modal-bg': {
      backgroundColor: {
        value (styles) {
          return Color(styles.mediaColor).fade(0.5).string()
        }
      }
    },

    // Modal
    'gus-modal': {
      backgroundColor: {
        value: 'backgroundColor'
      },
      color: {
        value: 'textColor'
      },
      boxShadow: {
        value: 'boxShadow'
      },
      borderRadius: {
        value (styles) { return `calc(${styles.borderRadius} * 2)` }
      }
    },

    // Header
    'gus-header': {
      ' .navbar': {
        backgroundColor: {
          value: 'backgroundColor'
        },
        color: {
          value: 'textColor'
        },
        fontFamily: {
          value: 'textFontFamily'
        }
      },
      ' .navbar-item': {
        color: {
          value: 'textColor'
        }
      },
      ' .navbar-item:hover': {
        color: {
          value: 'textColor'
        }
      },
      ' h1 a': {
        color: {
          value: 'textColor'
        },
        fontFamily: {
          value: 'titleFontFamily'
        },
        fontSize: {
          value () { return '1.25rem' }
        }
      },
      ' .icon': {
        color: {
          value: 'textColor'
        }
      }
    }
  }

}
