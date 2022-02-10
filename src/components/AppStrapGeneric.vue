<template>
  <section :class="`app-strap app-strap__generic strap var--app-${theme}`">
    <div class="strap-outer">
      <div class="strap-inner">
        <div class="strap-container container pad-medium">

          <header class='strap-header content' v-if="$slots.header">
            <slot name="header" />
          </header>

          <div class='strap-content content'>
            <div class="strap-content__inner">
              <slot />
            </div>
          </div>

          <footer class='strap-footer content' v-if="$slots.footer">
            <slot name="footer" />
          </footer>

        </div>
      </div>
    </div>
    <hr />
  </section>
</template>

<script>
export default {
  name: 'AppStrapGeneric',

  props: {
    theme: { type: String, default: 'default' }
  }
}
</script>

<style lang="sass" scoped>
</style>
