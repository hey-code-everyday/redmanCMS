<template>
  <!-- Straps -->
  <div class="app-page__straps">

    <app-strap-generic>
      <h1 class="title is-1" slot="header">Privacy Policy</h1>

      <div class="content">
        <p>Protecting your privacy is not only important to you, but also to <em>{{ siteName }}</em>. Information collected via this website is intended strictly for internal use and will not be sold, rented, or released in any manner to any individual, group, corporation or agency. The data I gather is used solely to help us provide you with the information you need.</p>
        <p><strong>Information Automatically Collected</strong></p>
        <p>Like many other websites, this one automatically gathers general information such as the visitor's IP (Internet Protocol) address, the date and the time this site is accessed, the sections visited, and the content downloaded. This non-identifiable information is collected specifically for website and system administration purposes only. This site may use cookies in the use of making your site more operational and to properly link to the information you are requesting.</p>
        <p><strong>Visitor Information Reports</strong></p>
        <p>Website Visitor Information Reports are generated to help us better understand user demographics and traffic patterns. Personal information regarding Real Estate transactions is provided privately to us, <em>{{ siteName }}</em>, as a normal course of conducting business.</p>
        <p><strong>Your Personal Information</strong></p>
        <p>Membership requires the voluntary provision of general contact information including your email address and chosen password. Should you choose to use this site for Virtual Office Website access we will require your name, phone number, email address and chosen password that only you, the user and the operators of this website will have access to for the purpose of contact and using this website only.</p>
        <p>Should you choose to hire us as your Real Estate Professionals under a buyers agency agreement I will also be required to sign and agree to the terms of a buyer agency agreement.</p>
        <p><strong>Use Of Personal Information</strong></p>
        <p><em>{{ siteName }}</em> may use personal information collected via this website to contact and correspond with the providers of that information regarding various inquiries or issues related to their Real Estate experience.</p>
        <p><strong>Disclosure In Business Transfers</strong></p>
        <p>In the event, whether of illness, absence or any other reason deemed necessary, an additional Licensed Real Estate Professional is required to assist <em>{{ siteName }} </em>regarding client related communications or transactions, this Licensed Real Estate Professional is understood to be as one and the same with <em>{{ siteName }}</em> for all purposes pursuant to the protection of privacy relative to both the client's personal information and his or her agreement with us.</p>
      </div>
    </app-strap-generic>

  </div>
</template>

<script>
import AppStrapGeneric from '@/components/AppStrapGeneric'

export default {
  name: 'AppPagePrivacy',

  components: {
    AppStrapGeneric
  },

  metaInfo () {
    return {
      title: 'Privacy Policy',
      meta: [
        {
          name: 'description',
          content: `Protecting your privacy is not only important to you, but also to ${this.siteName}. Information collected via this website is intended strictly for internal use and will not be sold, rented, or released in any manner to any individual, group, corporation or agency. The data I gather is used solely to help me provide you with the information you need.`
        }
      ]
    }
  },

  computed: {
    siteName () {
      return this.$store.state.website.config.display.siteName
    }
  }
}
</script>

<style scoped lang="sass">
.app-page__straps
  position: relative
  z-index: 1
</style>
