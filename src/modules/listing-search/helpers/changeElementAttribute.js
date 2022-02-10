export function changeMapListingSearchSectionZindexTop (state, anchor) {
  try {
    if (!state.page.straps) return
    const strapMapListingSearch = state.page.straps.find(strap => strap.name === 'strap-map-listing-search')
    if (strapMapListingSearch && anchor === 'map') {
      document.getElementById(`strap-${strapMapListingSearch.id}`).style.zIndex = 9999
      return
    }
  } catch (e) {
    throw new Error('Attempt to access DOM API in non-browser')
  }
}