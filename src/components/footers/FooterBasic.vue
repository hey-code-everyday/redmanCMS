<template>
  <div class="footer-basic">
    <div class="strap-container container pad-medium">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <editable-link-list
              tag="div"
              listKey="linkList1"
              :list="footer_state.linkList1"
              :onCreate="$footer_onListCreate"
              :onChange="$footer_onListChange"
              :onDelete="$footer_onListDelete"
            />
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <editable-link-list
              tag="div"
              listKey="linkList2"
              :list="footer_state.linkList2"
              :onCreate="$footer_onListCreate"
              :onChange="$footer_onListChange"
              :onDelete="$footer_onListDelete"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinFooter from '@/mixins/footer'

import EditableLinkList from '@/components/editable/EditableLinkList'
import defaultLink from '@/store/defaults/components/link'

export default {
  name: 'FooterBasic',

  components: {
    EditableLinkList
  },

  mixins: [mixinFooter],

  initialState (strap, state) {
    return {
      linkList1: [],
      linkList2: [
        defaultLink({ icon: 'icon-telephone', text: '{{ filters.phoneNumber(office.phone) }}', href: 'tel:{{ office.phone }}' }),
        defaultLink({ icon: 'icon-envelope-open', text: '{{ office.email }}', href: 'mailto:{{ office.email }}' })
      ]
    }
  }
}
</script>

<style scoped lang="sass">
.footer-basic
</style>
