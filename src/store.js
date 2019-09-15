import Vue from "vue";
import Vuex from "vuex";
import io from "socket.io-client";

Vue.use(Vuex);
//const socket = io("http://localhost:8007");
// const socket = io("http://192.168.0.155:8007");
const socket = io("https://blooming-headland-96211.herokuapp.com/");
const store = new Vuex.Store({
  state: {
    socket: socket,
    id: null,
    room: {},
    waiting_for_room: false,
    word: null
  },
  getters: {
    connected: state => state.socket.connected
  },
  mutations: {
    reset(state) {
      state.room = {};
      state.waiting_for_room = false;
      state.word = null;
    },
    setId(state, id) {
      state.id = id;
    },
    setRoom(state, room) {
      state.room = room;
    },
    setWord(state, word) {
      state.word = word;

      // GAME LOGIC, SET ALL READY VALUES TO FALSE
      for (let id of Object.keys(state.room)) {
        state.room[id].ready = false;
      }
    },
    resetWord(state) {
      state.word = null;
    },
    toggleReady(state) {
      let id = state.id;
      let room = state.room;

      if (!(id && room[id])) return;
      room[id].ready = !room[id].ready;
    },
    userJoins(state, { id, data }) {
      Vue.set(state.room, id, data);
    },
    userLeaves(state, { id }) {
      Vue.delete(state.room, id);
    },
    userReady(state, { id }) {
      state.room[id].ready = true;
    },
    userUnready(state, { id }) {
      state.room[id].ready = false;
    }
  },
  actions: {
    joinRoom({ state }, args) {
      state.waiting_for_room = true;
      state.socket.emit("join-room", args);
    },
    leaveRoom({ state, commit }) {
      state.socket.emit("leave-room");
      commit("setRoom", {});
    },
    toggleReady({ state, commit }) {
      let id = state.id;
      let room = state.room;

      if (!(id && room[id])) return;

      if (room[id].ready) state.socket.emit("unready");
      else state.socket.emit("ready");

      commit("toggleReady");
    }
  }
});

// socket.on("time", data => console.log(data));

export default store;

// My socket id
socket.on("id", id => store.commit("setId", id));

// Room data
socket.on("room", room => {
  store.commit("setRoom", room);
});
socket.on("join-room", user => store.commit("userJoins", user));
socket.on("leave-room", user => store.commit("userLeaves", user));

// User reasy state
socket.on("ready", user => store.commit("userReady", user));
socket.on("unready", user => store.commit("userUnready", user));

// Game start
socket.on("word", word => store.commit("setWord", word));
