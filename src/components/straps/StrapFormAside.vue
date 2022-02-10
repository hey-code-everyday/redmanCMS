<template>
  <div class="strap-form-aside">
    <div class="strap-container container pad-medium">
      <div class="columns">
        <div class="column is-4 is-description">
          <header class='strap-header content'>
            <editable-title @change="$strap_onComponentChange" keyName="title" :value="strap_state.title" />
          </header>
          <div class='strap-content content is-hidden-mobile'>
            <editable-image @change="$strap_onComponentChange" keyName="image" :value="strap_state.image" />
            <br />
            <br />
            <editable-quill @change="$strap_onComponentChange" keyName="text" :value="strap_state.text" />
            <br />
            <editable-link-list
              tag="div"
              listKey="linkList"
              :small="true"
              :list="strap_state.linkList"
              :onCreate="$strap_onListCreate"
              :onChange="$strap_onListChange"
              :onDelete="$strap_onListDelete"
            />
          </div>
        </div>
        <div class="column is-8 is-form is-aligned-left">
          <div class="pad-medium trim-tb trim-right trim-left">
            <editable-redform @change="$strap_onComponentChange" keyName="redform" :value="strap_state.redform" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'

import EditableLinkList from '@/components/editable/EditableLinkList'

import EditableTitle from '@/components/editable/EditableTitle'
import EditableQuill from '@/components/editable/EditableQuill'
import EditableRedform from '@/components/editable/EditableRedform'
import EditableImage from '@/components/editable/EditableImage'

import defaultTitle from '@/store/defaults/components/title'
import defaultQuill from '@/store/defaults/components/quill'
import defaultLink from '@/store/defaults/components/link'
import defaultRedform from '@/store/defaults/components/redform'
import defaultImage from '@/store/defaults/components/image'

export default {
  name: 'StrapFormAside',

  components: {
    EditableLinkList,

    EditableImage,
    EditableTitle,
    EditableQuill,
    EditableRedform
  },

  mixins: [mixinStrap],

  initialState (strap, state) {
    return {
      title: defaultTitle({ html: 'Contact Me', size: 2 }),
      text: defaultQuill({ html: 'Questions? Comments? Get in touch with {{ agent.displayName }}.' }),
      image: defaultImage(),
      linkList: [
        defaultLink({
          icon: 'icon-envelope-open',
          text: '{{ office.email }}'
        }),
        defaultLink({
          icon: 'icon-telephone',
          text: '{{ filters.phoneNumber(office.phone) }}'
        })
      ],
      redform: defaultRedform({ formID: 'stock/contact-agent' })
    }
  },

  migrations (strap, state) {
    return [
      { image: defaultImage() } // Issue #47
    ]
  }
}
</script>

<style scoped lang="sass">
.strap-form-aside
</style>
