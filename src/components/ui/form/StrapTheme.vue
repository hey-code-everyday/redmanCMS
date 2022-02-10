<template>
  <div class="strap-theme app-control control">
    <div class="strap-theme__header">
      <nav class="navbar" role="navigation" aria-label="dropdown navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="https://bulma.io">
            <img src="https://cdnassets.rmcloud.com/frontend/static/assets/images/redman-demo-site-dark.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
          </a>

          <button class="button navbar-burger">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div class="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item has-dropdown is-active">
              <a class="navbar-link">
                Menu
              </a>

              <div class="navbar-dropdown is-right">
                <a class="navbar-item">
                  Menu Item
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div class="strap-theme__strap">
      <div class="strap-theme__strap-inner content">
        <h2 class="title is-4">Strap Title</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget libero non mauris pretium congue sed at nulla. Integer cursus venenatis magna quis ullamcorper.</p>
        <p style="padding-bottom:5px"><a>Consectetur adipiscing.</a></p>
        <p>
          <span class="button is-primary" style="margin-right:7px">Button</span>
          <span class="button is-outline" style="margin-right:7px">Button</span>
          <span class="button is-secondary" style="margin-right:7px">Button</span>
        </p>
      </div>
    </div>
    <div class="strap-theme__footer">
      <div class="level">
        <div class="level-left">
          &copy; Website 2017
        </div>
        <div class="level-right">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StrapTheme',

  props: {
    props: {
      type: Object,
      required: true
    }
  },

  data () {
    return {}
  },

  methods: {}
}
</script>

<style lang="sass" scoped>
.strap-theme
  border: solid 1px red

.strap-theme__header
  border-bottom: solid 1px red

.strap-theme__strap
  border-bottom: solid 1px red

.strap-theme__strap-inner
  padding: 50px 20px

.strap-theme__footer
  padding: 20px
</style>
