<template>
    <section v-if="!myColor" >
      <h1>Select your color</h1>
      <div class="colorContainer">
        <a class="colorBtn white" @click="selectColor('white')" href="#">Whites</a>
        <a class="colorBtn black" @click="selectColor('black')" href="#">Blacks</a>
        <a class="colorBtn any" @click="selectColor('any')" href="#">Any</a>
      </div>
    </section>

    <section v-if="myColor && !game" >
      <h1>Wait Room</h1>
      <p>Searching for an opponent...</p>
    </section>

    <section v-if="this.game">
      <h1>Game <b>{{ this.game.canMove ? 'Your turn' : 'Waiting other side' }}</b></h1>
      <ChessBoard :socket="socket" :game="this.game" />
    </section>
</template>

<script>
import ChessBoard from './components/ChessBoard.vue'
import generateRandomString from './helpers'
import {io} from "socket.io-client"
import Constant from "./Constant"

export default {
  name: 'App',
  components: {
    ChessBoard,
  },
  data() {
    return {
      myColor: null,
      game: null,
      socket: io(Constant.URL_BE),
    };
  },
  created() {
    this.socket.connect()

    this.socket.on('game', (game) => {
      this.game = game
    })

    this.socket.on('disconnect', () => {
      console.log('disconnected by the server, reconnecting...')
      this.socket.emit('ping', {playerId: this.game.playerId})
    })

  },
  methods: {
    selectColor(color) {
      this.myColor = color
      this.socket.emit('newPlayer', {
        color: color,
      })
    },
  },
}
</script>

<style scoped>
.colorContainer {
  width: 50%;
  /* place-items: center; */
  display: flex;
}
.colorContainer, p {
  margin: 1em 0 0 1em;
}
</style>
