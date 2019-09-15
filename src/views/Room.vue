<template>
  <!-- <v-container fluid fill-height>
    <v-row align-content-center justify-center>
      <v-column>
        {{navigator.platform}}
        <v-text-field name="name" label="label"></v-text-field>
      </v-column>
    </v-row>
  </v-container>-->

  <!-- <v-container fluid grid-list-sm>
      <v-layout wrap>
        <v-flex v-for="i in 6" :key="i" xs4>
          <img
            :src="`https://randomuser.me/api/portraits/men/${i}.jpg`"
            class="image"
            alt="lorem"
            width="100%"
            height="100%"
          />
        </v-flex>
      </v-layout>
  </v-container>-->
  <v-container fluid fill-height pa-2 align-baseline>
    <div
      class="d-flex flex-column"
      style="width: 100%; height: 100%; justify-content: space-between;"
    >
      <div class="d-flex flex-column" style="width: 100%;">
        <v-btn
          height="4em"
          tabindex="-1"
          :color="(id && room[id]) && room[id].ready ? 'red' : 'success'"
          @click="toggleReady"
        >{{(id && room[id]) && room[id].ready ? 'No listo' : 'Listo'}}</v-btn>
        <v-expansion-panels v-model="panel">
          <v-expansion-panel>
            <v-expansion-panel-header>Usuarios</v-expansion-panel-header>
            <v-divider v-show="typeof panel !== 'undefined'"></v-divider>
            <v-expansion-panel-content>
              <v-container fluid grid-list-sm>
                <v-layout wrap>
                  <v-flex v-for="i in Object.keys(room)" :key="i" xs12 md3>
                    <v-card outlined :raised="i === id">
                      <v-list-item three-line>
                        <v-list-item-content>
                          <div class="overline mb-0">{{room[i].ready ? '✅ Listo' : '❌ No listo'}}</div>
                          <v-list-item-title
                            class="headline mb-1"
                          >{{room[i].nick || (i + '').substring(0,4)}}</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-avatar>
                          <v-img :src="`https://api.adorable.io/avatars/128/${i}.png`" />
                        </v-list-item-avatar>
                      </v-list-item>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-container align-baseline v-show="html">
        <v-card style="width: inherit;" min-height="150">
          <v-card-text>
            <p class="display-1 text--primary" v-html="title"></p>
            <div class="text--primary" v-html="html"></div>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="link_id" text @click="route">Ver en la RAE</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </div>
    <v-overlay opacity="0.9" absolute :value="countdown">
      <div class="text-center display-4">{{countdown}}</div>
    </v-overlay>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "home",
  data: function() {
    return {
      random: Math.random() * 1000,
      panel: 0,
      countdown: 0
    };
  },
  created() {
    if (!this.$store.state.waiting_for_room) this.$router.replace("/");
    this.socket.on("countdown", n => {
      this.countdown = n;
      if (n) this.$store.commit("resetWord");
    });
  },
  computed: {
    socket() {
      return this.$store.state.socket;
    },
    room() {
      return this.$store.state.room;
    },
    id() {
      return this.$store.state.id;
    },
    html() {
      return this.$store.state.word ? this.$store.state.word.html : null;
    },
    link_id() {
      return this.$store.state.word ? this.$store.state.word.id : null;
    },
    title() {
      return this.$store.state.word ? this.$store.state.word.title : null;
    }
  },
  methods: {
    ...mapActions(["toggleReady", "leaveRoom"]),
    route() {
      window.open("https://dle.rae.es/?id=" + this.link_id, "_blank");
    }
  },
  destroyed() {
    this.leaveRoom();
  }
};
</script>

<style>
mark {
  background-color: unset;
  color: unset;
}
</style>