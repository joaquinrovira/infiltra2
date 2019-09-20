<template>
  <v-container class="fill-height pa-12" fluid>
    <v-row
      class="fill-height"
      style="flex-direction: column;"
      no-gutters
      align="center"
      justify="center"
    >
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-row style="min-width: 100%" align="center" justify="center">
        <v-text-field v-model="nick" label="Tu nombre"></v-text-field>
      </v-row>
      <v-row style="min-width: 100%" align="center" justify="center">
        <v-layout row ma-0>
          <v-flex xs8>
            <v-text-field v-model="sala" label="Sala"></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs3 style="display: flex;flex-direction: column;justify-content: center;">
            <v-btn width="100%" @click="joinRoom({'room': sala, 'nick': nick})">
              <v-icon>mdi-arrow-right-bold</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-row>
      <!-- <v-row style="min-width: 100%" align="center" justify="center">
        <v-btn block>A</v-btn>
      </v-row>-->
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "home",
  data: function() {
    return {
      sala: "",
      nick: localStorage.nick || ""
    };
  },
  watch: {
    nick(v) {
      localStorage.nick = v;
    }
  },
  created() {
    this.socket.on("room", () => {
      this.$router.push("room");
      this.$nextTick(() => {
        this.$store.state.waiting_for_room = false;
      });
    });
  },
  computed: {
    socket() {
      return this.$store.state.socket;
    }
  },
  methods: {
    ...mapActions(["joinRoom"])
  }
};
</script>

<style scoped lang="scss">
</style>