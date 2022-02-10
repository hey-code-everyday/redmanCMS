import styles from './styles'

export default {
  config: {
    styles,
    api: {
      gus: {
        url: 'https://gus.rmcloud.com/'
      },
      grandcentral: {
        url: 'https://grandcentral.rmcloud.com/'
      },
      auth0: {
        clientID: 'oFfbuQ1_WHsNIqAOxkP71SBfkmPjOsSV',
        domain: 'redman.auth0.com',
        redirectUrl: 'https://gus.rmcloud.com/login/auth0/callback'
      },
      googleMaps: {
        url: 'https://www.google.com/maps/embed/v1/place',
        key: 'AIzaSyAPmxzrNGkf_2tdVBSfyJZmjF-ZZUP1J14'
      },
      redforms: {
        url: '//forms.redmantech.com/forms/'
      }
    }
  }
}
