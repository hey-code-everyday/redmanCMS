<template>
<div class="form-modal">

  <div v-if="modal" class="form-modal__overlay var--gus-modal-bg" @click.stop="hideModal"></div>

  <button v-if="modal" class="form-modal__close modal-close is-large" @click.stop="hideModal">
  </button>

  <div class="form-modal__modal modal is-active">
    <div v-if="modal" class="modal-content var--gus-modal columns">
      <!-- Main content -->
      <div class="form-modal__content-main column">
        <div class="form-modal__content-inner">
          <h2 class="title is-4">{{ modal.title }}</h2>
          <!-- <p class="subtitle var--gus-text-soft">{{ modal.description }}</p> -->
          <div class="content">
            <Redform :formID="modal.formID" :spaceID="modal.spaceID" :extraData="modal.extraData" />
          </div>
        </div>
      </div>

      <!-- Side bar -->
      <!-- <aside class="form-modal__content-aside column is-one-third">
        Aside content
      </aside> -->
    </div>
  </div>

</div>
</template>

<script>
import Redform from '@/components/Redform'

export default {
  props: ['modal', 'hideModal'],

  components: {
    Redform
  }
}
</script>

<style lang="sass" scoped>
.form-modal
  pointer-events: none
  position: fixed
  z-index: 510
  top: 0
  left: 0
  width: 100vw
  height: 100vh

.form-modal__close
  position: absolute
  z-index: 2
  top: 1.5rem
  right: 1.5rem

.form-modal__modal,
.form-modal__overlay
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

.form-modal__overlay
  pointer-events: auto
  z-index: 0

.form-modal__modal
  overflow: hidden
  z-index: 1

  .modal-content
    pointer-events: auto

  .subtitle
    font-size: 16px

  hr
    height: 2px
    width: 4rem
    margin: 50px 0

  .title
    margin-bottom: 2rem

.form-modal__content-main
  padding: 50px
  overflow-y: auto
  overflow-x: hidden

.form-modal__content-aside
  display: flex
  justify-content: center
  align-items: center
  padding: 50px
  background-color: rgba(0,0,0,.1)

  .form-modal__content-inner
    text-align: center
</style>
