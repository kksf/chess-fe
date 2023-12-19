import MovePawn from '../moves/MovePawn'

class Pawn {
    MovePawn

    constructor(positions, row, col) {
        this.MovePawn = new MovePawn(positions, row, col)
    }

    getMoves() {
        this.MovePawn.build()

        return {
            moves: this.MovePawn.moves,
            attacks: this.MovePawn.attacks
        }
    }
}

export default Pawn