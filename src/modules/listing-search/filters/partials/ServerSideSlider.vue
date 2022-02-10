<template>
  <div class="gus-range">
    <input type="number" />
    <input type="number" />
  </div>
</template>

<script>

export default {
  name: 'gusServerSlider',

  props: [
    'min',
    'max',
    'value',
    'interval'
  ]
}

</script>
