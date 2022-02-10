<template>
<div class="app-control control">
  <div class="app-grad-field field has-addons">
    <div class="app-control control">
      <NumberInput
      :field="numberField"
      :value="value.angle"
      @change="angleChanged" />
    </div>
    <div class="app-control control">
      <div
        class="app-grad-control"
        ref="gradOuter"
        @click.stop="insertStop"
      >
        <canvas ref="canvas"></canvas>
        <div class="app-grad-inner" ref="gradInner">
          <i
            v-for="(stop, i) in value.colors"
            :key="stop.pos"
            :class="stopClasses(i)"
            :style="stopStyles(stop)"
            @click.stop="selectStop(i)"
            @mousedown.stop="startDragging($event, i)"
          ></i>
        </div>
      </div>
    </div>
  </div>
  <div class="app-edit-field field is-grouped" v-if="selectedStop !== false">
    <div class="app-control control">
      <ColorInput
      :blur="false"
      :field="colorField"
      :value="currentStop.color"
      @change="colorChanged" />
    </div>
    <div class="control" v-if="canDeleteStop">
      <span class="icon" @click="deleteStop">
        <i class="icon-cross"></i>
      </span>
    </div>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import Color from 'color'

import ColorInput from './ColorInput'
import NumberInput from './NumberInput'
import mixinField from '@/mixins/field'

function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default {
  mixins: [mixinField],

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  components: {
    ColorInput,
    NumberInput
  },

  data () {
    return {
      selectedStop: false,
      dragging: false,
      dragMousemove: null,
      dragMouseup: null
    }
  },

  mounted () {
    this.resizeCanvas()
    this.drawGradient()
  },

  updated () {
    this.resizeCanvas()
    this.drawGradient()
  },

  methods: {
    resizeCanvas () {
      const { canvas, gradOuter } = this.$refs
      const { width, height } = gradOuter.getBoundingClientRect()

      canvas.width = width
      canvas.height = height
    },

    drawGradient () {
      const { colors } = this.$props.value
      const { canvas } = this.$refs
      const context = canvas.getContext('2d')

      const grad = context.createLinearGradient(0, 0, canvas.width, 0)
      try {
        colors.forEach(stop => grad.addColorStop(stop.pos, stop.color))
      } catch (e) {
        console.warn('Unable to add color stop:', e)
      }

      context.fillStyle = grad
      context.fillRect(0, 0, canvas.width, canvas.height)
    },

    angleChanged (newAngle) {
      const value = clone(this.$props.value)

      value.angle = newAngle
      this.change(value)
    },

    colorChanged (newColor) {
      const { selectedStop } = this.$data
      const value = clone(this.$props.value)

      value.colors[selectedStop].color = newColor
      this.change(value)
    },

    insertStop (e) {
      const { dragging } = this.$data
      if (dragging !== false) return

      let { offsetX } = e
      const { gradInner } = this.$refs

      const bRect = gradInner.getBoundingClientRect()
      const width = bRect.width

      if (offsetX > width) offsetX = width
      if (offsetX < 0) offsetX = 0
      const pos = offsetX / width

      const { canvas } = this.$refs
      const context = canvas.getContext('2d')
      const pixel = context.getImageData(offsetX, 1, 1, 1).data
      const color = Color(pixel).hex()

      const value = clone(this.$props.value)
      value.colors.push({ color, pos })
      this.change(value)

      Vue.nextTick(() => {
        this.selectedStop = value.colors.length - 1
      })
    },

    deleteStop () {
      const { selectedStop } = this.$data
      const value = clone(this.$props.value)

      this.$data.selectedStop = false

      Vue.nextTick(() => {
        value.colors.splice(selectedStop, 1)
        this.change(value)
      })
    },

    startDragging (e, i) {
      const { dragMove, dragEnd } = this

      const mousemove = dragMove.bind(this)
      const mouseup = dragEnd.bind(this)

      this.dragMousemove = mousemove
      this.dragMouseup = mouseup
      this.dragging = true
      this.selectedStop = i

      if (process.browser) {
        const body = document.body
        body.addEventListener('mousemove', mousemove)
        body.addEventListener('mouseup', mouseup)
      }
    },

    dragMove (e) {
      let { offsetX } = e
      const { gradInner } = this.$refs
      const { width } = gradInner.getBoundingClientRect()

      if (e.target !== gradInner) return

      if (offsetX < 0) offsetX = 0
      if (offsetX > width) offsetX = width

      const pct = offsetX / width

      const { selectedStop } = this.$data
      const value = this.$props.value

      value.colors[selectedStop].pos = pct
    },

    dragEnd () {
      if (process.browser) {
        const body = document.body
        body.removeEventListener('mousemove', this.dragMousemove)
        body.removeEventListener('mouseup', this.dragMouseup)
      }

      const value = clone(this.$props.value)
      this.change(value)

      setTimeout(() => { this.dragging = false }, 100)
    },

    stopStyles (stop) {
      const pct = stop.pos * 100
      const events = this.$data.dragging ? 'none' : 'auto'

      return {
        left: `${pct}%`,
        backgroundColor: stop.color,
        pointerEvents: events
      }
    },

    stopClasses (i) {
      if (this.selectedStop !== false && this.selectedStop === i) {
        return 'is-active'
      } else {
        return false
      }
    },

    selectStop (i) {
      this.selectedStop = i
    }
  },

  computed: {
    numberField () {
      return {
        placeholder: '',
        minValue: -360,
        maxValue: 360,
        step: 1
      }
    },

    colorField () {
      return {
        placeholder: '#000000'
      }
    },

    gradStyle () {
      const { angle, colors } = this.$props.value

      let stops = []
      colors.forEach(stop => {
        const pct = stop.pos * 100
        stops.push(`${stop.color} ${pct}%`)
      })
      stops = stops.join(',')

      return {
        backgroundImage: `linear-gradient(${angle}deg, ${stops})`
      }
    },

    currentStop () {
      const { selectedStop } = this.$data
      const { value } = this.$props

      return value.colors[selectedStop]
    },

    canDeleteStop () {
      const { value } = this.$props
      return value.colors.length > 2
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../assets/sass/variables'

.app-grad-field,
.app-edit-field
  user-select: none

.app-grad-field
  width: 100%
  margin-bottom: .375rem

  .input
    border-radius: 0 !important

  .control
    &:first-child
      min-width: 72px

    &:last-child
      width: auto
      flex: 1

.app-grad-control
  position: relative
  width: 100%
  height: 36px
  padding: 0 18px
  border: solid 1px $wsBorder
  margin-left: 1px
  background-color: rgba($wsTextLight, 0.1)
  cursor: pointer

  canvas
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

  &:hover
    border: solid 1px rgba($wsTextLight, 0.6)

  i
    position: absolute
    cursor: pointer
    top: 50%
    width: 22px
    height: 22px
    border-radius: 50%
    border: solid 3px rgba(#fff, 0.6)
    box-shadow: 0 0 1px 1px rgba($wsGrey, 0.4)
    transform: translate(-50%, -50%)

    &:hover
      border-color: rgba(#fff, 0.8)

    &.is-active
      border-color: rgba(#fff, 1)
      box-shadow: 0 0 2px 1px rgba($wsGrey, 0.6)

.app-grad-inner
  position: relative
  width: 100%
  height: 100%

.app-edit-field
  .control
    &:first-child
      width: auto
      flex: 1

    &:last-child:not(:only-child)
      min-width: 24px
      max-width: 24px
      line-height: 36px
      font-size: 24px
      text-align: center

      .icon
        color: $wsIcon
        cursor: pointer
        transform: translateY(2px)

        &:hover
          color: $wsTextLight

</style>
