<template>
  <div v-if="results" class="gus-list">
    <h3 class="gus-list__title var--gus-light-text">{{ title }}</h3>
    <ul class="gus-list__items var--gus-primary">
      <li v-for="(result, key) in results" :key="result.id">
        <a href="#" :data-key="key" @click="onClick" :class="`var--gus-primary${(highlighted === result) ? ' highlighted' : ''}`">
          {{ result.locationTitle }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'sublist',

  props: [
    'results',
    'title',
    'highlighted'
  ],

  methods: {
    onClick: function (e) {
      e.preventDefault()
      const target = this.results[e.target.dataset.key]
      this.$emit('click', target)
    }
  }
}
</script>
