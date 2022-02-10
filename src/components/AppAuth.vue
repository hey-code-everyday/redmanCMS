<template>
  <section class="app-strap app-auth strap var--app-default">
    <!-- Strap structure -->
    <div class="strap-outer">
      <!-- Strap contents -->
      <div class="strap-inner">

        <div class="strap-auth">
          <div class="strap-container container pad-medium">

            <strap-message-box title="Page Builder Login" icon="icon-hammer-wrench">
              Welcome to the Redman Page Builder!
              <template v-if="!this.$store.getters.authenticated">
                Please log in to make changes to your website.
              </template>
              <template slot="footer">
                <a v-if="this.$store.getters.authenticated" @click="logout">Logout</a>
                <a v-else @click="login">Login</a>
              </template>
            </strap-message-box>

          </div>
        </div>

      </div>
    </div>
    <hr />
  </section>
</template>

<script>
import StrapMessageBox from '@/components/StrapMessageBox'

export default {
  name: 'AppAuth',

  components: {
    StrapMessageBox
  },

  methods: {
    login () {
      this.$store.dispatch('login')
    },

    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style lang="sass" scoped>
.app-auth
  .strap-auth
    background-color: #fafafa
    background-image: url('../assets/images/geometry2.png')
</style>
