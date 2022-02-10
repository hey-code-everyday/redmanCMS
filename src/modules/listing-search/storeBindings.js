
import windowScrollToTop from './helpers/windowScrollToTop'
import {createBrowserHistory} from 'history'
const history = createBrowserHistory()

export default (store) => {
  if (!store.state.gus) return

  // we have to do this here to make sure nag data is complete and includes
  // local termsAgreement
  store.dispatch('initializeNag')

  let url = store.getters.encodeUrl
  store.subscribe(() => {
    const newUrl = store.getters.encodeUrl

    if (url !== newUrl) {
      // replace URL in the address bar
      history.push(newUrl)
      url = newUrl

      // scroll to the top of the listing-search section
      windowScrollToTop()
    }
  })
}
