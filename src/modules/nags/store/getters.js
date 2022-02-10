export default {
  message: (state) => (message) => {
    return state.remoteProfile.listingDetails[message] || null
  },

  isVow: (state) => {
    return state.remoteProfile.isUserVow.complete
  },

  // update this so that if any of the conditions is to register, that
  // condition is returned first
  nextCondition: (state) => {
    const conditions = state.remoteProfile.isUserVow.conditions

    const isNotLoggedIn = conditions.find(condition =>
      (condition.item === "loggedIn" && !condition.complete)
    )
    if (isNotLoggedIn) return isNotLoggedIn

    const condition = conditions.find(condition =>
      !condition.complete
    )
    return condition || null
  }
}
