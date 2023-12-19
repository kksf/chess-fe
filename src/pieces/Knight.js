import MoveKnight from "../moves/MoveKnight"

class Knight {
    MoveKnight

    constructor(positions, row, col) {
        this.MoveKnight = new MoveKnight(positions, row, col)
    }

    getMoves() {
        this.MoveKnight.build()

        return {
            moves: this.MoveKnight.moves,
            attacks: this.MoveKnight.attacks
        }
    }
}

export default Knight