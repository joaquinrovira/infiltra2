<template>
  <v-app id="app">
    <v-app-bar app clipped-left>
      <v-icon
        @click.stop="() => {
            if($router.history.current.name === 'room') 
            $store.dispatch('leaveRoom');
            $router.replace('/')
        }"
      >{{(this.$router.history.current.name !== "home") ? 'mdi-arrow-left': 'mdi-home-variant-outline'}}</v-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title>INFILTRADO</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
      <v-overlay opacity="0.9" absolute :value="!connected">
        <div class="text-center">
          Conectando con el servidor
          <br />
          <br />
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
      </v-overlay>
    </v-content>

    <v-footer app>
      <span>
        <a style="color: unset; text-decoration: none;" href="http://github.com/joaquinrovira">xrs</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null
  }),
  created() {
    this.$vuetify.theme.dark = true;
  },
  computed: {
    connected() {
      return this.$store.getters.connected;
    }
  },
  watch: {
    connected: function(v, o) {
      if (!v) {
        this.$store.commit("reset");
        this.$router.replace("/");
      }
    }
  },
  methods: {
    redir() {
      window.open("http://github.com/joaquinrovira", "_blank");
    }
  }
};
</script>

<style lang="scss">
</style>
