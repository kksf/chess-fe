import MoveInLine from "../moves/MoveInLine"
import MoveInDiagonal from "../moves/MoveInDiagonal"

class Queen {
    MoveInLine
    MoveInDiagonal

    constructor(positions, row, col) {
        this.MoveInLine = new MoveInLine(positions, row, col)
        this.MoveInDiagonal = new MoveInDiagonal(positions, row, col)
    }

    getMoves() {
        this.MoveInLine.build()
        this.MoveInDiagonal.build()

        return {
            moves: this.MoveInLine.moves.concat(this.MoveInDiagonal.moves),
            attacks: this.MoveInLine.attacks.concat(this.MoveInDiagonal.attacks)
        }
    }
}

export default Queen