import MoveInLine from "../moves/MoveInLine";
import MoveInDiagonal from "../moves/MoveInDiagonal";

class King {
    MoveInLine
    MoveInDiagonal

    constructor(positions, row, col) {
        this.MoveInLine = new MoveInLine(positions, row, col, true)
        this.MoveInDiagonal = new MoveInDiagonal(positions, row, col, true)
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

export default King;