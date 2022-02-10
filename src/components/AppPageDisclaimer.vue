<template>
  <!-- Straps -->
  <div class="app-page__straps">

    <app-strap-generic>
      <h1 class="title is-1" slot="header">Intellectual Property Notices</h1>

      <div class="content">
        <h2 class="title is-4"><strong>Redman Technologies Inc. Website</strong></h2>
        <p class="subtitle">
          <small>
            © Copyright 2003 - {{ getCurrentYear }}, Redman Technologies Inc., All Rights Reserved
          </small>
          <br/>
          <small v-show="isEREB">
            © Copyright {{ getCurrentYear }} by the REALTORS® Association of Edmonton. All rights reserved.
          </small>
        </p>

        <p>All materials on this website including databases, source codes, forms, stock default content, templates and engine, but excluding custom design elements and client-inputted content management system text and graphics, belong exclusively to&nbsp;<a href="http://www.redmantech.com/" target="_blank">Redman Technologies Inc.</a>&nbsp;and are protected by international copyright laws and registration in selected countries. All rights reserved.</p>
        <p>REDMAN &amp; Design® is a registered trade-mark of Redman Technologies Inc. REDMAN™ and the REDMAN logo™ are trade-marks of Redman Technologies Inc.</p>
      </div>

      <p slot="footer"><em>Designed and created by&nbsp;</em><a href="http://www.redmantech.com/" target="_blank"><em>Redman Technologies Inc.</em></a></p>
    </app-strap-generic>

  </div>
</template>

<script>
import AppStrapGeneric from '@/components/AppStrapGeneric'

export default {
  name: 'AppPageDisclaimer',

  components: {
    AppStrapGeneric
  },

  computed: {
    isEREB () {
      return this.$store.state.config.sources[0] === 'idx-edm-v5'
    },
    getCurrentYear () {
      return (new Date()).getFullYear()
    }
  },

  metaInfo () {
    return {
      title: 'Disclaimer',
      meta: [
        {
          name: 'description',
          content: 'All materials on this website including databases, source codes, forms, stock default content, templates and engine, but excluding custom design elements and client-inputted content management system text and graphics, belong exclusively to Redman Technologies Inc. and are protected by international copyright laws and registration in selected countries. All rights reserved.'
        }
      ]
    }
  }
}
</script>

<style scoped lang="sass">
.app-page__straps
  position: relative
  z-index: 1
</style>
