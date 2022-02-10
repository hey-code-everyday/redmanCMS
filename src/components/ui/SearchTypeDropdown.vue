<template>
  <div class="search-type__container">
    <button
      class="search-type__button"
      @click="showTypePopover = !showTypePopover"
      @mouseover="hoverButton = true"
      @mouseleave="hoverButton = false"
      v-click-outside="onClickOutside"
    >
      {{ currentSearchType | firstLetterUppercase }}
      <svg
        viewBox="0 0 32 32"
        class="button-icon"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          :stroke="hoverButton ? 'white' : 'grey'"
          :fill="hoverButton ? 'white' : 'grey'"
          points="16,25.9 0,9.9 3.7,6.1 16,18.4 28.3,6.1 32,9.9"
        ></polygon>
      </svg>
    </button>
    <ul class="search-type__popup" v-show="showTypePopover">
      <li
        :class="currentSearchType === 'buy' ? 'search-type__list selected' : 'search-type__list'"
        @click="onChangeSearchType('buy')"
      >
        Buy
      </li>
      <li
        :class="currentSearchType === 'sell' ? 'search-type__list selected' : 'search-type__list'"
        @click="onChangeSearchType('sell')"
      >
        Sell
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SearchTypedropDown',
  data: () => ({
    currentSearchType: 'buy',
    hoverButton: false,
    showTypePopover: false
  }),
  methods: {
    onClickOutside() {
      this.showTypePopover = false
    },
    onChangeSearchType(newType) {
      if (!newType) return
      this.currentSearchType = newType
      this.$emit('onSearchTypeChange', newType)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~bulma/sass/utilities/_all'
@import '../../assets/sass/variables'

.search-type__container
  height: 100%
  position: relative
  height: 52px
  +mobile
    margin: 7px 0
  +tablet
    margin: 7px 0
  +desktop
    margin: 0 5px

.search-type__button
  height: 100%
  color: grey
  border-radius: 3px
  font-size: 20px
  background-color: white
  border: none
  outline: none
  cursor: pointer
  transition: .3s
  &:hover
    background-color: #243c57
    color: white
  +mobile
    width: 100%
  +tablet
    width: 100%
  +desktop
    width: 100px

.search-type__popup
  margin: 0
  position: absolute
  left: 0
  list-style: none
  background: white
  color: grey
  border-radius: 2px
  font-size: 17px
  text-align: center
  box-shadow: 0 0 10px 5px #0000003b
  +mobile
    top: 55px
    z-index: 1
    width: 100%
  +tablet
    top: 55px
    z-index: 1
    width: 100%
  +desktop
    top: 70px
    z-index: 1
    width: 120px

.search-type__list
  padding: 7px 30px
  cursor: pointer
  margin: 0
  &:hover
    background-color: #eeeeee
.selected
  background-color: #eeeeee

.button-icon
  width: 13px
  height: 13px
</style>
