import Color from 'color'

export default {
  'gus-app': {
    background: {value: 'backgroundColor'},
    color: {value: 'textColor'},
    'font-family': {value: 'textFontFamily'},
    ' .awesome-bar__border': {
      backgroundColor: {
        value: function (styles) {
          const lightBg = Color(styles.backgroundColor).light()
          return lightBg
            ? Color(styles.textColor).alpha(0.05).string()
            : '#fff'
        }
      }
    },
    ' .awesome-bar .icon': {
      color: {
        value: function (styles) {
          const lightBg = Color(styles.backgroundColor).light()
          return lightBg
            ? Color(styles.textColor).alpha(0.4).string()
            : '#141414'
        },
        important: true
      }
    },
    ' .awesome-bar .input': {
      color: {
        value: function (styles) {
          const lightBg = Color(styles.backgroundColor).light()
          return lightBg
            ? styles.textColor
            : '#141414'
        },
        important: true
      }
    },
    ' .awesome-bar__mobile-bg': {
      backgroundColor: {
        value: 'backgroundColor',
        important: true
      }
    },
    ' input:focus ~ .awesome-bar__border': {
      borderColor: {
        value: 'primaryColor'
      },
      backgroundColor: {
        value: function (styles) {
          const lightBg = Color(styles.backgroundColor).light()
          return lightBg
            ? styles.backgroundColor
            : '#fff'
        }
      }
    },
    ' input, select': {
      'font-family': {value: 'textFontFamily'}
    }
  },

  'gus-reset-colors': {
    background: {value: 'backgroundColor'},
    color: {value: 'textColor'}
  },

  'gus-primary': {
    color: {value: 'primaryColor', important: true}
  },

  'app-default .var--gus-primary': {
    color: {value: 'primaryColor', important: true}
  },

  'gus-bg-primary': {
    background: {value: 'primaryColor'},
    color: {value: 'primaryTextColor', important: true},
    ':disabled': {
      background: {value: 'primaryColor'},
      color: {value: 'primaryTextColor'}
    }
  },

  'app-default .var--gus-bg-primary': {
    background: {value: 'primaryColor'},
    color: {value: 'primaryTextColor', important: true},
    ':disabled': {
      background: {value: 'primaryColor'},
      color: {value: 'primaryTextColor'}
    }
  },

  'gus-text': {
    color: {value: 'textColor'}
  },

  'gus-light-text': {
    color: {value: 'lightTextColor'}
  },

  'gus-box': {
    'box-shadow': {value: 'boxShadow'},
    background: {value: 'backgroundColor'},
    color: {value: 'textColor'}
  },

  'gus-hover-box-shadow': {
    ':hover': {
      'box-shadow': {value: 'boxShadow'}
    }
  },

  'gus-title': {
    'font-family': {value: 'titleFontFamily'}
  },

  'gus-border-primary': {
    'border-color': {value: 'primaryColor', important: true},
    'border-bottom-color': {value: 'primaryColor', important: true}
  },

  'gus-light-text-color': {
    'border-color': {value: 'lightTextColor', important: true}
  },

  'gus-radio__label': {
    'border-color': {value: 'primaryColor', important: true}
  },

  'gus-radio__input': {
    ':checked + .var--gus-radio__label': {
      background: {value: 'primaryColor', important: true},
      color: {value: 'primaryTextColor', important: true}
    }
  },

  'gus-checkbox__label': {
    '::after': {
      'border-color': {value: 'primaryColor', important: true}
    }
  },

  'gus-checkbox__input': {
    ':checked + .var--gus-checkbox__label::after': {
      background: {value: 'primaryColor', important: true}
    }
  },

  'gus-tag__label': {
    'border-color': {value: 'primaryColor', important: true}
  },

  'gus-tag__input': {
    ':checked + .var--gus-tag__label': {
      background: {value: 'primaryColor', important: true},
      color: {value: 'primaryTextColor', important: true}
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
        value: '1.25rem'
      }
    },
    ' .icon': {
      color: {
        value: 'textColor'
      }
    }
  }
}
