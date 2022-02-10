<template>
  <div>
    <slot v-if="browser" />
  </div>
</template>

<script>
export default {
  name: 'NoSsr',

  computed: {
    browser () {
      return process.browser
    }
  }
}
</script>
