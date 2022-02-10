export default {
  invalidateCache (state, pageID) {
    return {
      method: 'POST',
      url: `__invalidate__`,
      headers: {
        'Accept': 'application/json'
      }
    }
  }
}
