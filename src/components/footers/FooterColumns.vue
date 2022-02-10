<template>
  <div class="footer-columns">
    <div class="strap-container container pad-medium">
      <div class="columns">
        <div class="column content">
          <h5 class="title is-5">
            <editable-text @change="$footer_onComponentChange" keyName="col1Title" :value="footer_state.col1Title" />
          </h5>
          <p>
            <editable-image @change="$footer_onComponentChange" keyName="col1Image" :value="footer_state.col1Image" />
          </p>
          <editable-link-list
            tag="p"
            listKey="col1LinkList"
            class="footer-columns__link-list"
            :list="footer_state.col1LinkList"
            :onCreate="$footer_onListCreate"
            :onChange="$footer_onListChange"
            :onDelete="$footer_onListDelete"
          />
          <editable-html @change="$footer_onComponentChange" keyName="col1Html" :value="footer_state.col1Html" />
        </div>
        <div class="column">
          <h5 class="title is-5">
            <editable-text @change="$footer_onComponentChange" keyName="col2Title" :value="footer_state.col2Title" />
          </h5>
          <editable-html @change="$footer_onComponentChange" keyName="col2Html" :value="footer_state.col2Html" />
          <social-icons class="footer-columns__social-icons" />
        </div>
        <div class="column">
          <h5 class="title is-5">
            <editable-text @change="$footer_onComponentChange" keyName="col3Title" :value="footer_state.col3Title" />
          </h5>
          <nav-list :nav="footer_nav" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinFooter from '@/mixins/footer'

import NavList from '@/components/NavList'
import SocialIcons from '@/components/SocialIcons'
import EditableText from '@/components/editable/EditableText'
import EditableHtml from '@/components/editable/EditableHtml'
import EditableImage from '@/components/editable/EditableImage'
import EditableLinkList from '@/components/editable/EditableLinkList'

import defaultText from '@/store/defaults/components/text'
import defaultHtml from '@/store/defaults/components/html'
import defaultLink from '@/store/defaults/components/link'
import defaultImage from '@/store/defaults/components/image'

export default {
  name: 'FooterColumns',

  components: {
    NavList,
    SocialIcons,
    EditableText,
    EditableHtml,
    EditableImage,
    EditableLinkList
  },

  mixins: [mixinFooter],

  initialState (strap, state) {
    return {
      // Column 1
      col1Title: defaultText({ text: '' }),
      col1Image: defaultImage({ imageUrl: '//via.placeholder.com/175x60' }),
      col1LinkList: [
        defaultLink({ icon: 'icon-telephone', text: '{{ filters.phoneNumber(office.phone) }}', href: 'tel:{{ office.phone }}' }),
        defaultLink({ icon: 'icon-envelope-open', text: '{{ office.email }}', href: 'mailto:{{ office.email }}' })
      ],
      col1Html: defaultHtml({
        html: `<div style="position:relative;padding-left:27px">
  <div style="position:absolute;top:3px;left:3px">
    <i class="icon-map-marker"></i>
  </div>
  <div>
    {{ office.address }}<br />
    {{ office.city }}, {{ office.provinceCode }}<br />
    {{ office.postalCode }}
  </div>
</div>`
      }),

      // Column 2
      col2Title: defaultText({ text: 'Social' }),
      col2Html: defaultHtml({ html: 'Get Connected' }),

      // Column 3
      col3Title: defaultText({ text: 'Quick Links' })
    }
  }
}
</script>

<style scoped lang="sass">
.footer-columns

.footer-columns__link-list
  margin-bottom: 0.5rem

.footer-columns__social-icons
  margin-top: 1rem

.title
  &:empty
    display: none
</style>
