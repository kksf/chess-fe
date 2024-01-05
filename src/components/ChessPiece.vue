<template>
  <div class="chess-piece" :class="pieceClass"></div>
</template>

<script>
export default {
  name: 'ChessPiece',
  props: {
    type: String, 
    color: String, 
  },
  computed: {
    pieceClass() {
      return `${this.type}-${this.color}`
    },
  },
}
</script>

<style>
.chess-piece {
  width: 60px; height: 60px;
  background: url('/images/ChessPiecesArray.png') -60px 0 no-repeat;
}
	.rook-white {
		background-position: -120px -60px;
	}
	.knight-white {
		background-position: -180px -60px;
	}
	.bishop-white {
		background-position: -240px -60px;
	}
	.queen-white {
		background-position: 0 -60px;
	}
	.king-white {
		background-position: -60px -60px;
	}
	.pawn-white {
		background-position: -300px -60px;
	}

	.rook-black {
		background-position: -120px 0;
	}
	.knight-black {
		background-position: -180px 0;
	}
	.bishop-black {
		background-position: -240px 0;
	}
	.queen-black {
		background-position: 0 0;
	}
	.king-black {
		background-position: -60px 0;
	}
	.pawn-black {
		background-position: -300px 0;
	}

</style>