const ErrorComponent = {
  render (h) {
    return h('div', 'Error loading the component!')
  }
}

// See: https://vuejs.org/v2/guide/components-dynamic-async.html#Handling-Loading-State
export default function createAsyncStrapFactory (loader) {
  return () => ({
    component: loader(),
    error: ErrorComponent
  })
}
