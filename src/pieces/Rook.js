import MoveInLine from "../moves/MoveInLine";

class Rook {
    MoveInLine

    constructor(positions, row, col) {
        this.MoveInLine = new MoveInLine(positions, row, col)
    }

    getMoves() {
        this.MoveInLine.build()

        return {
            moves: this.MoveInLine.moves,
            attacks: this.MoveInLine.attacks
        }
    }
}

export default Rook;