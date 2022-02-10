<template>
  <div class="footer-columns">
    <div class="strap-container container">

      <div class="columns is-multiline is-mobile footer-columns-boxes">
        <div class="column tile-1 is-half-mobile is-parent">
          <div class="box tile is-child">
            <span class="icon box-icon">
              <editable-icon @change="$footer_onComponentChange" keyName="icon1" :value="footer_state.icon1" />
            </span>

            <span class="tile-title is-block">
              <editable-quill @change="$footer_onComponentChange" keyName="tile1Title" :value="footer_state.tile1Title" />
            </span>

            <span class="tile-desc">
              <editable-quill @change="$footer_onComponentChange" keyName="tile1Desc" :value="footer_state.tile1Desc" />
            </span>

          </div>
        </div>

        <div class="column tile-2 is-half-mobile is-parent">
          <div class="box tile is-child">
            <span class="icon box-icon">
              <editable-icon @change="$footer_onComponentChange" keyName="icon2" :value="footer_state.icon2" />
            </span>

            <span class="tile-title is-block">
              <editable-quill @change="$footer_onComponentChange" keyName="tile2Title" :value="footer_state.tile2Title" />
            </span>

            <span class="tile-desc">
              <editable-quill @change="$footer_onComponentChange" keyName="tile2Desc" :value="footer_state.tile2Desc" />
            </span>

          </div>
        </div>

        <div class="column tile-3 is-half-mobile is-parent">
          <div class="box tile is-child">
            <span class="icon box-icon">
              <editable-icon @change="$footer_onComponentChange" keyName="icon3" :value="footer_state.icon3" />
            </span>

            <span class="tile-title is-block">
              <editable-quill @change="$footer_onComponentChange" keyName="tile3Title" :value="footer_state.tile3Title" />
            </span>

            <span class="tile-desc">
              <editable-quill @change="$footer_onComponentChange" keyName="tile3Desc" :value="footer_state.tile3Desc" />
            </span>

          </div>
        </div>

        <div class="column tile-4 is-half-mobile is-parent">
          <div class="box tile is-child">
            <span class="icon box-icon">
              <editable-icon @change="$footer_onComponentChange" keyName="icon4" :value="footer_state.icon4" />
            </span>

            <span class="tile-title is-block">
              <editable-quill @change="$footer_onComponentChange" keyName="tile4Title" :value="footer_state.tile4Title" />
            </span>

            <span class="tile-desc">
              <editable-quill @change="$footer_onComponentChange" keyName="tile4Desc" :value="footer_state.tile4Desc" />
            </span>

          </div>
        </div>
      </div>
    </div>
    <div class="strap-container container pad-medium footer-columns-columns">
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
import EditableQuill from '@/components/editable/EditableQuill'
import EditableHtml from '@/components/editable/EditableHtml'
import EditableImage from '@/components/editable/EditableImage'
import EditableLinkList from '@/components/editable/EditableLinkList'
import EditableIcon from '@/components/editable/EditableIcon'

import defaultText from '@/store/defaults/components/text'
import defaultQuill from '@/store/defaults/components/quill'
import defaultHtml from '@/store/defaults/components/html'
import defaultLink from '@/store/defaults/components/link'
import defaultImage from '@/store/defaults/components/image'
import defaultIcon from '@/store/defaults/components/icon'


export default {
  name: 'FooterColumnsWithBoxes',

  components: {
    NavList,
    SocialIcons,
    EditableText,
    EditableQuill,
    EditableHtml,
    EditableImage,
    EditableLinkList,
    EditableIcon
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
      col3Title: defaultText({ text: 'Quick Links' }),
      icon1: defaultIcon({ name: 'icon-envelope-open', style: 'none', fontSize: 28 }),
      icon2: defaultIcon({ name: 'icon-telephone2', style: 'none', fontSize: 28 }),
      icon3: defaultIcon({ name: 'icon-location', style: 'none', fontSize: 28 }),
      icon4: defaultIcon({ name: 'icon-apartment', style: 'none', fontSize: 28 }),
      tile1Title: defaultQuill({ html: '<strong>Get In Touch</strong>' }),
      tile2Title: defaultQuill({ html: '<strong>Call Us</strong>' }),
      tile3Title: defaultQuill({ html: '<strong>Address</strong>' }),
      tile4Title: defaultQuill({ html: '<strong>Office Hours</strong>' }),
      tile1Desc: defaultQuill({ html: '<a href="mailto:{{ office.email }}" target="_blank">Send An Email</a>' }),
      tile2Desc: defaultQuill({ html: '<a href="tel:{{ office.phone }} target="_blank">{{ filters.phoneNumber(office.phone) }}</a>' }),
      tile3Desc: defaultQuill({ html: '{{ office.address }}' }),
      tile4Desc: defaultQuill({ html: 'MON to FRI: 9am-5pm' })
    }
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/sass/variables'

.footer-columns
  +desktop
    margin-top: 3rem

  .footer-columns-boxes
    +desktop
      margin-top: 2.5em
    +tablet
      margin-top: 25px
    +mobile
      margin-top: 25px

.footer-columns__link-list
  margin-bottom: 0.5rem

.footer-columns__social-icons
  margin-top: 1rem

.box-icon
  margin: 1em

.is-child
  height: 100%
  text-align: center

.title
  &:empty
    display: none
</style>
