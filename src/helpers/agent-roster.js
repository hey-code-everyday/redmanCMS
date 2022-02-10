import api from '@/api'

export function prefetch (resolve, reject, store, state) {
  api.getAgentRoster(store.state)
  .then(res => {
    if (res.status !== 200) {
      return reject(new Error(`Error fetching roster. (${res.status})`))
    }
    resolve(res.body)
  })
  .catch(err => {
    reject(err)
  })
}

export function afterPrefetch (err, result) {
  if (err) {
    this.error = err
    console.warn(err)
    return
  }

  this.$set(this.$data, 'agentRoster', result.roster)

  this.loading = false
}
