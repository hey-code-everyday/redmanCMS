import Color from 'color'

function themeSchema (theme, darkMode) {
  return {
    // General
    backgroundColor: {
      important: true,
      value (styles) { return styles.straps[theme].bgColor }
    },
    color: {
      important: true,
      value (styles) { return styles.straps[theme].text }
    },
    ' .title': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].titleText }
      }
    },
    ' .is-strong': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].titleText }
      }
    },
    ' .is-label': {
      color: {
        important: true,
        value (styles) {
          return darkMode
            ? Color(styles.straps[theme].text).string()
            : Color(styles.straps[theme].text).alpha(0.6).string()
        }
      }
    },
    ' strong': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].titleText }
      }
    },
    ' a': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].linkText }
      }
    },
    ' a:visited': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].linkText }
      }
    },
    ' a:hover': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].linkText }
      }
    },
    ' .masthead a': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].titleText }
      }
    },

    // Buttons
    ' .button.is-primary': {
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      },
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    },
    ' .strap-button.is-primary': {
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      },
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    },
    ' .strap-button.is-secondary': {
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiSecondary.bgColor }
      },
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiSecondary.text }
      }
    },
    ' .strap-button.is-outlined': {
      borderColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      },
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },
    ' .strap-button.is-outlined-light': {
      borderColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      },
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    },

    // Icons
    ' .strap-icon': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].text }
      }
    },
    ' .strap-icon.is-enclosed': {
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      },
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    },

    // Tiles
    ' .strap-tile .overlay-inner .subtitle': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    },
    ' .strap-tile .overlay-inner .title': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    },
    ' .strap-tile .overlay.is-overlay': {
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      },
      opacity: {
        important: true,
        value (styles) { return styles.straps[theme].overlayAlpha }
      }
    },

    // Form elements
    ' .form-input > *': {
      borderColor: {
        important: true,
        value (styles) { return Color(styles.straps[theme].text).alpha(0.4).string() }
      }
    },

    // Social icons
    ' .social-icon': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      },
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },
    ' .social-icon:hover': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      },
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },
    ' .social-icon:visited': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      },
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },

    // Nav bar
    ' .nav-bar .navbar-item': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].text }
      }
    },
    ' .nav-bar .navbar-link:after': {
      borderColor: {
        important: true,
        value (styles) { return styles.straps[theme].text }
      }
    },
    ' .nav-bar .navbar-item.has-dropdown .navbar-link': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].text }
      }
    },

    // Branded navbar
    ' .nav-bar.is-branded .navbar-dropdown': {
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },
    ' .nav-bar.is-branded .navbar-dropdown .navbar-item': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      },
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },
    ' .nav-bar.is-branded .navbar-item.has-dropdown .navbar-link': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].text }
      }
    },
    ' .nav-bar.is-branded .navbar-item.has-dropdown:hover .navbar-link': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      },
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },
    ' .nav-bar.is-branded .navbar-item.has-dropdown:hover .navbar-link:after': {
      borderColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    },
    ' .nav-bar.is-branded .navbar-item:hover': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      },
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },
    ' .nav-bar.is-branded .navbar-link:hover': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      },
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },
    '.nav-bar.is-branded .navbar-item.has-dropdown:hover .navbar-link': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      },
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },
    ' .nav-bar.is-branded .navbar-link:hover:after': {
      borderColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    },
    '.nav-bar.is-branded .navbar-item.has-dropdown:hover .navbar-link:after': {
      borderColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    },
    ' .nav-bar.is-branded .navbar-dropdown .navbar-item:hover': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      },
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    },
    ' .navbar-burger': {
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].bgColor }
      }
    },

    // Search bar
    ' .search-bar .dropdown-content': {
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps['default'].bgColor }
      },
      color: {
        important: true,
        value (styles) { return styles.straps['default'].text }
      }
    },
    ' .search-bar .dropdown-item': {
      color: {
        important: true,
        value (styles) { return styles.straps['default'].text }
      }
    },
    ' .redform .progress-label': {
      borderColor: {
        important: true,
        value (styles) { return Color(styles.straps[theme].text).alpha(0.4).string() }
      },
      boxShadow: {
        important: true,
        value (styles) { return `0 0 0 4px ${styles.straps[theme].bgColor}` }
      },
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].bgColor }
      }
    },

    // Redforms
    ' .redform .progress-step.active .progress-label': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      },
      borderColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      },
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },
    ' .redform input.navigation': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      },
      borderColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },

    // Mobile menu
    ' .menu-label': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    },
    '.menu .menu-list a': {
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      }
    },
    ' .menu-list a:hover': {
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.bgColor }
      },
      color: {
        important: true,
        value (styles) { return styles.straps[theme].uiPrimary.text }
      }
    }
  }
}

export default function (darkMode) {
  return {
    'app': {
      fontFamily: {
        important: true,
        value (styles) { return styles.fonts.body.family }
      },
      ' .title': {
        fontFamily: {
          important: true,
          value (styles) { return styles.fonts.title.family }
        }
      }
    },
    'app-default': themeSchema('default', darkMode),
    'app-feature': themeSchema('feature', darkMode),
    'app-alternate': themeSchema('alternate', darkMode),
    'app-primary': {
      backgroundColor: {
        important: true,
        value (styles) { return styles.straps['default'].uiPrimary.bgColor }
      },
      color: {
        important: true,
        value (styles) { return styles.straps['default'].uiPrimary.text }
      },
      ' .social-icon': {
        color: {
          important: true,
          value (styles) { return styles.straps['default'].uiPrimary.bgColor }
        },
        backgroundColor: {
          important: true,
          value (styles) { return styles.straps['default'].uiPrimary.text }
        }
      },
      ' .social-icon:hover': {
        color: {
          important: true,
          value (styles) { return styles.straps['default'].uiPrimary.bgColor }
        },
        backgroundColor: {
          important: true,
          value (styles) { return styles.straps['default'].uiPrimary.text }
        }
      },
      ' .social-icon:visited': {
        color: {
          important: true,
          value (styles) { return styles.straps['default'].uiPrimary.bgColor }
        },
        backgroundColor: {
          important: true,
          value (styles) { return styles.straps['default'].uiPrimary.text }
        }
      },
      ' a': {
        color: {
          important: true,
          value (styles) { return styles.straps['default'].uiPrimary.text }
        }
      },
      ' a:visited': {
        color: {
          important: true,
          value (styles) { return styles.straps['default'].uiPrimary.text }
        }
      },
      ' a:hover': {
        color: {
          important: true,
          value (styles) { return styles.straps['default'].uiPrimary.text }
        }
      }
    }
  }
}
