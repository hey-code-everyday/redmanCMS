<template>
  <div class="strap-columned-tiles">
    <div class="strap-container container pad-medium">
      <header class='strap-header content'>
        <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
      </header>

      <div class="columns is-multiline">
        <div class="tile-column1 column">
          <div class="tile-image img-col-1">
            <editable-image @change="$strap_onComponentChange" keyName="image1" :value="strap_state.image1" />
          </div>
          <div class="text-col-1">
            <editable-quill @change="$strap_onComponentChange" keyName="textCol1" :value="strap_state.textCol1" />
          </div>
          <footer class='strap-footer content'>
            <editable-button-list
              tag="div"
              listKey="buttonListCol1"
              :list="strap_state.buttonListCol1"
              :onCreate="$strap_onListCreate"
              :onChange="$strap_onListChange"
              :onDelete="$strap_onListDelete"
            />
          </footer>
        </div>
        <div class="tile-column2 column">
          <div class="tile-image img-col-2">
            <editable-image @change="$strap_onComponentChange" keyName="image2" :value="strap_state.image2" />
          </div>
          <div class="text-col-3">
            <editable-quill @change="$strap_onComponentChange" keyName="textCol2" :value="strap_state.textCol2" />
          </div>
          <footer class='strap-footer content'>
            <editable-button-list
              tag="div"
              listKey="buttonListCol2"
              :list="strap_state.buttonListCol2"
              :onCreate="$strap_onListCreate"
              :onChange="$strap_onListChange"
              :onDelete="$strap_onListDelete"
            />
          </footer>
        </div>
        <div class="tile-column3 column">
          <div class="tile-image img-col-2">
            <editable-image @change="$strap_onComponentChange" keyName="image3" :value="strap_state.image3" />
          </div>
          <div class="text-col-3">
            <editable-quill @change="$strap_onComponentChange" keyName="textCol3" :value="strap_state.textCol3" />
          </div>
          <footer class='strap-footer content'>
            <editable-button-list
              tag="div"
              listKey="buttonListCol3"
              :list="strap_state.buttonListCol3"
              :onCreate="$strap_onListCreate"
              :onChange="$strap_onListChange"
              :onDelete="$strap_onListDelete"
            />
          </footer>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableButtonList from '@/components/editable/EditableButtonList'

import EditableImage from '@/components/editable/EditableImage'
import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'

import defaultImage from '@/store/defaults/components/image'
import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultButton from '@/store/defaults/components/button'

export default {
  name: 'StrapColumnedTiles',

  components: {
    EditableButtonList,
    EditableImage,
    EditableTitle,
    EditableQuill
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Image Columned' }),
      textCol1: defaultQuill(),
      textCol2: defaultQuill(),
      textCol3: defaultQuill(),
      image1: defaultImage({ imageUrl: '//via.placeholder.com/300x200' }),
      image2: defaultImage({ imageUrl: '//via.placeholder.com/300x200' }),
      image3: defaultImage({ imageUrl: '//via.placeholder.com/300x200' }),
      buttonListCol1: [defaultButton()],
      buttonListCol2: [defaultButton()],
      buttonListCol3: [defaultButton()]
    }
  }
}
</script>

<style scoped lang="sass">
.strap-columned-tiles
  .tile-image
    margin: 10px

</style>
