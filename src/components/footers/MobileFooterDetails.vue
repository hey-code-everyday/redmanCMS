<template>
  <div class="mobile-header mobile-footer-details">
    <div class="mobile-header__field">
      <a class="mobile-header__icon icon" @click="shareListing">
        <i class="icon-share2"></i>
      </a>
      <a class="mobile-header__item button is-outlined" @click="moreInfo">
        Contact Agent
      </a>
      <a class="mobile-header__item button is-primary" @click="requestShowing">
        Schedule Tour
      </a>
    </div>
  </div>
</template>

<script>
import CustomModalRedform from '@/components/ui/modals/custom/CustomModalRedform'
import CustomModalRedformSelect from '@/components/ui/modals/custom/CustomModalRedformSelect'
import CustomModalShareListing from '@/components/ui/modals/custom/CustomModalShareListing'

export default {
  name: 'MobileFooterDetails',

  computed: {
    color () {
      const { brandBgColor } = this.$store.getters.palette('header')
      return brandBgColor
    }
  },

  methods: {
    shareListing () {
      const { listing } = this.$store.state.footerMeta

      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          listing
        },
        component: CustomModalShareListing,
        settings: {
          width: '600px',
          height: 'auto',
          padded: true,
          palette: 'default'
        }
      })
    },

    showForm (formID) {
      const { listing } = this.$store.state.footerMeta

      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          formID,
          extraData: {
            listingID: listing.publicId || listing.id
          }
        },
        component: CustomModalRedform,
        settings: {
          width: '600px',
          height: 'auto',
          padded: true,
          palette: 'default'
        }
      })
    },
    showFormSelect (formID) {
      const { listing } = this.$store.state.footerMeta

      this.$store.commit('SHOW_CUSTOM_MODAL', {
        state: {
          formID,
          extraData: {
            listingID: listing.publicId || listing.id
          }
        },
        component: CustomModalRedformSelect,
        settings: {
          width: '600px',
          height: 'auto',
          padded: true,
          palette: 'default'
        }
      })
    },

    moreInfo () {
      const { formMoreInfo } = this.$store.state.footerMeta.state
      this.showForm(formMoreInfo.formID)
    },

    requestShowing () {
      const { formRequestShowing } = this.$store.state.footerMeta.state
      this.showFormSelect(formRequestShowing.formID)
    }
  }
}
</script>

<style lang="sass" scoped>
.mobile-footer-details
.mobile-header__icon.icon
  margin: auto 0
</style>
