export default {
  data () {
    return {
      documentEvents_handlers: {}
    }
  },

  created () {
    const methods = this.$options.methods
    const handlers = this.documentEvents_handlers

    if (methods.onDocumentClick) {
      handlers.onDocumentClick = methods.onDocumentClick.bind(this)
      window.addEventListener('click', handlers.onDocumentClick, false)
    }
  },

  destroyed () {
    const methods = this.$options.methods
    const handlers = this.documentEvents_handlers

    if (methods.onDocumentClick) {
      window.removeEventListener('click', handlers.onDocumentClick)
    }
  }
}
