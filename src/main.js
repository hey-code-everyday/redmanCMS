import Vue from 'vue'
import App from './App'
import Meta from 'vue-meta'
import VueLazyload from 'vue-lazyload'
import "core-js/modules/es6.promise";
import "core-js/modules/es6.array.iterator";

Vue.config.productionTip = false

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});

export default function (store, router, context) {
  Vue.use(Meta)
  Vue.use(VueLazyload, {
    lazyComponent: true,
    observer: true
  })

  /* eslint-disable no-new */
  const app = new Vue({
    el: '#phoenix',
    store,
    router,
    components: {
      AgentSelector: () => import('./components/AgentSelector')
    },
    render: h => h(App)
  })

  return new Promise((resolve, reject) => {
    if (context) {
      context.state = store.state
      context.meta = app.$meta()
    }
    resolve(app)
  })
}
