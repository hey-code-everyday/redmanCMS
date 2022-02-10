import uuidv4 from 'uuid/v4'

export default {
  showNotification ({ commit, state }, { message, type = 'notice', action = false }) {
    commit('SHOW_NOTIFICATION', {
      id: uuidv4(),
      message,
      type,
      action,
      timeout: 0,
      when: Date.now(),
      paused: false
    })
  },

  hideNotification ({ commit }, id) {
    commit('HIDE_NOTIFICATION', id)
  },

  tickNotification ({ commit }, { id, amount }) {
    commit('TICK_NOTIFICATION', { id, amount })
  },

  resetNotification ({ commit }, id) {
    commit('RESET_NOTIFICATION', id)
  }
}
