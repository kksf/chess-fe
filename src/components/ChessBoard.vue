<template>
  <div class="chess-board" ref="board">
    <div class="fader" v-show="this.gameOver"></div>
    <div v-for="row in 8" :key="row" class="row">
      <div v-for="col in 8" :key="col"
           :class="'square sq-' + this.calcRow(row) + '-' + (col)"
           @click="handleSquareClick(this.calcRow(row), col)">
        <ChessPiece v-if="getPieceAtPosition(null, this.calcRow(row), col)"
                    index="index"
                    :type="getPieceAtPosition(null, this.calcRow(row), col).type"
                    :color="getPieceAtPosition(null, this.calcRow(row), col).color"/>
      </div>
    </div>
  </div>
  <div class="panel">
    <div>
      <a class="colorBtn any" @click="cancelTheGame()" href="#">Cancel this game</a>
    </div>
    <div ref="messages">

    </div>
  </div>
  <audio ref="soundSelectPiece" preload="auto">
    <source src="/sounds/click.mp3" type="audio/mpeg">
  </audio>
  <audio ref="soundWrongMove" preload="auto">
    <source src="/sounds/wrong.mp3" type="audio/mpeg">
  </audio>
  <audio ref="soundOvertake" preload="auto">
    <source src="/sounds/overtake.mp3" type="audio/mpeg">
  </audio>
  <audio ref="soundGameUpdated" preload="auto">
    <source src="/sounds/pop.mp3" type="audio/mpeg">
  </audio>

</template>

<script>
import ChessPiece from './ChessPiece.vue';
import Board from "../Board";

export default {
  name: 'ChessBoard',
  components: {
    ChessPiece,
  },
  data() {
    return {
      underCheck: false,
      underCheckMate: false,
      positions: {},
      selectedSquare: null,
      gameOver: false,
    };
  },
  props: {
    socket: {
      type: Object,
      required: true,
    },
    game: {
      type: Object,
      required: true,
    }
  },
  created() {
    console.log('created', this.game.positions)

    this.game.positions = new Board().create(this.game.positions)

    this.socket.on('game', (data) => {
      console.log('Game Updated', data.positions, this.game.positions)

      this.$refs.soundGameUpdated.play()
      this.reCalculate(data)
    })

    this.socket.on('cancelGame', (game) => {
      this.gameOver = true
      this.clearMessages()
      this.say('problem', '\'The other player has cancel the game or connection is lost')
      delete this.game
      localStorage.clear()
    })

    window.addEventListener('keydown', this.handleKeyPress)
    document.addEventListener('click', this.handleClick)
  },
  destroyed() {
    window.removeEventListener('keydown', this.handleKeyPress)
    document.removeEventListener('click', this.handleClick)
  },
  updated() {
    this.removeClassesFromCells(['check'])
  },
  methods: {
    cancel() {
      delete this.game
      localStorage.clear()
      console.log('reset game')
      window.location.reload()
    },
    cancelTheGame() {
      this.socket.emit('cancelGame', this.game)
      this.cancel()
    },
    calcRow(row) {
      return ((this.game.myColor === 'black') ? row : (8 - row + 1))
    },
    reCalculate(game) {
      const GameBoard = new Board()
      this.game.positions = GameBoard.create(game.positions)
      console.log('reCalculate', this.game.positions)
      this.clearMessages()
      if(GameBoard.isUnderCheck(GameBoard.kingsPositions[this.game.myColor], this.game.positions)) {
        console.log('I am checked')
        this.say('problem', 'We are checked!')
        if(!GameBoard.haveMoves[this.game.myColor]) {
          this.gameOver = true
          this.clearMessages()
          this.say('problem', 'Game over. We are checkmated...')
        }
      }

      if(GameBoard.isUnderCheck(GameBoard.kingsPositions[this.game.enemyColor], this.game.positions)) {
        this.say('info', 'The enemy is under check')
        if(!GameBoard.haveMoves[this.game.enemyColor]) {
          this.gameOver = true
          this.clearMessages()
          this.say('info', 'You won! The enemy is checkmated!')
        }
      }
    },
    handleSquareClick(row, col) {
      if (!this.selectedSquare) {
        // избира
        this.selectPiece(row, col)
      } else {
        // прави ход
        this.movePiece(this.selectedSquare, {row, col})
        this.removeClassesFromCells(['attack', 'move', 'threat'])
      }
    },
    getPieceAtPosition(positions=null, row, col) {
      if (!positions) {
        positions = JSON.parse(JSON.stringify(this.game.positions))
      }
      if (positions[row] === undefined) {
        return null
      }
      return positions[row][col] || null
    },
    selectPiece(row, col) {
      if(!this.game.canMove) {
        return
      }
      const piece = this.getPieceAtPosition(null, row, col)
      if (piece && piece.color === this.game.myColor) {
      // if (piece) {
        this.selectedSquare = {row, col}
        this.addClassToCells([this.selectedSquare], 'selected')
        this.addClassToCells(piece.attacks ?? [], 'attack')
        this.addClassToCells(piece.moves ?? [], 'move')
        this.addClassToCells(piece.threats ?? [], 'threat')
      }
    },
    movePiece(from, to) {
      const piece = this.getPieceAtPosition(null, from.row, from.col)
      const toPiece = this.getPieceAtPosition(null, to.row, to.col)

      // когато мести фигура вурху собствена фигура или на непозволена позиция
      console.log(`Invalid move from ${JSON.stringify(piece)} to ${JSON.stringify(toPiece)}`)
      if (toPiece && toPiece.color === piece.color || !piece.moves.find(item => {return item.row === to.row && item.col === to.col})) {
        this.$refs.soundWrongMove.play()
        this.deselectAll()
        return
      }

      if (toPiece) {
        // The move ends with enemy piece overtake
        this.$refs.soundOvertake.play()
      } else {
        // The move ends on an empty field
        this.$refs.soundSelectPiece.play()
      }

      if (piece) {
        this.game.canMove = false
        // remove the piece from the old square
        delete this.game.positions[from.row][from.col]

        // create the piece in the new square
        this.game.positions[to.row] ??= {}
        this.game.positions[to.row][to.col] = {...piece}

        this.reCalculate(this.game)
        this.socket.emit('updateGame', this.game)
      }

      this.deselectAll()
    },
    deselectAll() {
      this.selectedSquare = null
      this.removeClassesFromCells(['selected', 'validMove'])
    },
    decorateUnderCheck(underCheck=false) {
      if(underCheck) {
        this.addClassToCells([{row: this.myKingPosition.row, col: this.myKingPosition.col}], 'check')
      }
    },
    addClassToCells(arr, cssClass) {
      arr.forEach(element => {
        const cell = document.querySelector(`.sq-${element.row}-${element.col}`)
        if (cell) {
          cell.classList.add(cssClass)
        }
      })
    },
    removeClassesFromCells(cssClasses) {
      const squareElements = document.querySelectorAll('.square')
      squareElements.forEach((squareElement) => {
        cssClasses.forEach(className => {
          squareElement.classList.remove(className)
        })
      })
    },
    handleKeyPress() {
      // Escape
      if (event.keyCode === 27) {
        console.log('Escape key pressed')
        this.deselectAll()
      }
    },
    handleClick(event) {
      let target = event.target
      let clickOutside = true
      while(target) {
        if (target.classList.contains("chess-board")) {
          clickOutside = false
        }
        target = target.parentElement
      }
      if(clickOutside) {
        console.log('Click outside chessboard')
        this.deselectAll()
      }
    },
    clearMessages() {
      this.$refs.messages.innerHTML = ''
    },
    say(type, msg) {
      this.$refs.messages.innerHTML = `<p class="${type}">${msg}</p>`
    }

  },
}
</script>

<style scoped>
.chess-board {
  display: grid;
  border: 1px solid red;
  float: left;
  position: relative;
}
  .fader {
    position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 10000;
    background: rgba(0, 0, 0, 0.8);
  }
.panel {
  border: 1px solid green;
  margin-left: 1em;
  float: left;
}

.row {
  display: flex;
}

.square {
  width: 80px;  height: 80px;
  background-color: #FFFFA0; transition: background-color 0.5s ease;
  border: 2px solid #404040;
  display: flex; justify-content: center; align-items: center; cursor: pointer;

  color: black;
}

p.problem {
  color: red
}
p.info {
  color: blue
}

.row:nth-child(even) .square:nth-child(even),
.row:nth-child(odd) .square:nth-child(odd) {
  background-color: #509050;
}
.square.selected {
  background-color: white !important;
}
.square.validMove,
.square.move {
  background-color: pink !important;
}
.square.check {
  background-color: red !important;
}
.square.attack {
  border-color: red !important;
}
.square.threat {
  border-style: dashed;
}
</style>

