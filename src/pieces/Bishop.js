import MoveInDiagonal from "../moves/MoveInDiagonal";

class Bishop {
    MoveInDiagonal

    constructor(positions, row, col) {
        this.MoveInDiagonal = new MoveInDiagonal(positions, row, col)
    }

    getMoves() {
        this.MoveInDiagonal.build()

        return {
            moves: this.MoveInDiagonal.moves,
            attacks: this.MoveInDiagonal.attacks
        }
    }
}

export default Bishop;