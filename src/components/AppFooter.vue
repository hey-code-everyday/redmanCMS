<template>
  <footer :class="`app-footer strap var--app-${footer.config.style.theme}`">
    <!-- Strap structure -->
    <div class="strap-outer">

      <!-- Strap contents -->
      <div class='strap-inner'>
        <transition name="footer-load">

          <component
            :is="footer.name"
            :key="footer.name"
            :footer="footer"
          />

        </transition>
        <div class="rm-disclaimer content container">
          <div class="columns is-mobile">
            <div class=" column is-9-tablet is-8-mobile">
              <p class="rm-disclaimer-links">
                © Copyright {{ getCurrentYear }},
                <a target="_blank" href="//www.redmantech.com/?utm_source=redmanv4&amp;utm_medium=clientsite&amp;utm_term=realestatewebsites&amp;utm_campaign=clientfooter">
                  Real Estate Websites
                </a> by
                <a target="_blank" href="//www.redmantech.com/products?utm_source=redmanv4&amp;utm_medium=clientsite&amp;utm_term=redmantech&amp;utm_campaign=clientfooter">
                  Redman Technologies Inc.
                </a> |
                <a href="/privacy-policy">Privacy Policy</a> |
                <a href="/disclaimer">Disclaimer</a>
                <br/>
                <span v-show="isEREB">
                  © Copyright {{ getCurrentYear }} by the REALTORS® Association of Edmonton. All rights reserved.
                </span>
              </p>
              <div style="display:flex" class="rm-disclaimer-text" v-if="!isSABOUR">
                <div class="rm-disclaimer-text-inner">
                  <p>
                    The trademarks REALTOR®, REALTORS®, and the REALTOR® logo are controlled by The Canadian Real Estate Association (CREA) and identify real estate professionals who are members of CREA. The trademarks MLS®, Multiple Listing Service® and the associated logos are owned by The Canadian Real Estate Association (CREA) and identify the quality of services provided by real estate professionals who are members of CREA.
                  </p>
                  <p>
                    <span v-show="!isEREB"> The data included on this website is deemed to be reliable, but is not guaranteed to be accurate by the Real Estate Board.
                    </span>
                    <span v-show="isEREB">Data is deemed reliable but is not guaranteed accurate by the REALTORS® Association of Edmonton.
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div class="rm-disclaimer-logo column" v-if="!isSABOUR">
              <div class="mls-realtor-logo-container" v-if="!isDarkTheme">
                  <img alt="MLS® Logo in black" class="mls-realtor-logo" style="margin-right: 15px;" src="//cdnassets.rmcloud.com/shared-images/general/MLS_BW.png"/>
                  <div class="is-hidden-desktop is-hidden-tablet" style="height:25px"></div>
                  <img alt="REALTOR® Logo in black" class="mls-realtor-logo" style="margin-left: 10px;" src="//cdnassets.rmcloud.com/shared-images/general/REALTOR_BW.png"/>
              </div>
              <div class="mls-realtor-logo-container" v-if="isDarkTheme">
                  <img alt="MLS® Logo in white" class="mls-realtor-logo" src="//cdnassets.rmcloud.com/shared-images/general/MLS_W.png"/>
                  <div class="is-hidden-desktop is-hidden-tablet" style="height:25px"></div>
                  <img alt="REALTOR® Logo in white" class="mls-realtor-logo" style="margin-left: 10px;" src="//cdnassets.rmcloud.com/shared-images/general/REALTOR_W.png"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import footers from './footers'

export default {
  name: 'AppFooter',

  components: footers,

  props: {
    footer: {
      type: Object,
      required: true
    }
  },

  computed: {
    isDarkTheme () {
      return this.$store.state.website.theme.dark
    },
    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    },
    isSABOUR () {
      return this.$store.state.config.sources[0] === 'idx-sabor-v5'
    },
    getCurrentYear () {
      return (new Date()).getFullYear()
    }
  }
}
</script>

<style scoped lang="sass">
@import '../assets/sass/variables'

.app-footer
  overflow-x: hidden
  max-width: 100vw

.footer-load-enter-active,
.footer-load-leave-active


.footer-load-enter,
.footer-load-leave-to
  opacity: 0

.rm-disclaimer
  font-size: 11px
  padding: 2rem 0
  padding: 0 2.5em 2.5em 2.5em

.rm-disclaimer-logo
  font-size: 11px
  +desktop
    padding: 2rem 0 2rem 2.5rem
    text-align: center
  +tablet
    padding: 2rem 0 2rem 2.5rem
  +mobile
    padding: 2rem 0

.mls-realtor-logo
  width: auto
  height: 50px
  background-size: contain!important
  background-repeat: no-repeat!important

.mls-realtor-logo-container
  +desktop
    padding-top: 1rem
  +mobile
    padding-top: 1.5rem

.rm-disclaimer-text-inner
  flex: 1

</style>
