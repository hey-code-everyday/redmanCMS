<template>
<div class="gus-range">
  <Slider
    ref="slider"
    :min="min"
    :max="max"
    :value="value"
    :tooltip="false"
    :interval="interval"
    :bg-style="{background: styles.lightTextColor}"
    :process-style="{background: styles.primaryColor}"
    class="gus-range__input"
    @callback="onChange"
    @drag-start="dragStart"
    @drag-end="dragEnd" />

  <p class="gus-range__labels var--gus-light-text">
    <span class="gus-range__label-min">{{minLabel}}</span>
    <span class="gus-range__label-max">{{maxLabel}}</span>
  </p>
</div>
</template>

<script>
const Slider = (process.browser) ? require('vue-slider-component') : require('./ServerSideSlider')

export default {
  name: 'gusRange',

  props: [
    'min',
    'max',
    'value',
    'interval',
    'minLabel',
    'maxLabel'
  ],

  data: function () {
    return {
      dragging: false,
      storedValue: this.value
    }
  },

  components: {
    Slider
  },

  computed: {
    styles: function () {
      return this.$store.state.gus.config.styles
    }
  },

  mounted () {
    setTimeout(() => {
      this.$refs.slider.refresh()
    }, 1000)
  },

  methods: {
    onChange: function (newValue) {
      this.$emit('drag', newValue)
      this.storedValue = newValue
      if (!this.dragging) {
        this.$emit('change', this.storedValue)
      }
    },

    dragStart: function () {
      this.dragging = true
    },

    dragEnd: function () {
      this.dragging = false
      this.$emit('change', this.storedValue)
    }
  }
}

</script>
