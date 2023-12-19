import Constant from "../Constant";

class MoveKnight {
    row
    col
    color

    moves = []
    attacks = []

    constructor(positions, row, col) {
        this.positions = positions
        this.row = row
        this.col = col
        this.color = positions[row][col]['color']
    }

    /**
     * Main handler
     */
    build() {
        [
            {newRow: this.row+2, newCol: this.col+1},
            {newRow: this.row+2, newCol: this.col-1},
            {newRow: this.row-2, newCol: this.col+1},
            {newRow: this.row-2, newCol: this.col-1},
            {newRow: this.row+1, newCol: this.col+2},
            {newRow: this.row+1, newCol: this.col-2},
            {newRow: this.row-1, newCol: this.col+2},
            {newRow: this.row-1, newCol: this.col-2},
        ].forEach(move => {
            // Check move is inside the game board
            if(move.newRow > 8 || move.newRow < 1 || move.newCol > 8 || move.newCol < 1) {
                // Outside the game board, skip this move
                return; //continue
            }

            // Check there is another piece at the new position
            if(
                this.positions[move.newRow]
                && this.positions[move.newRow][move.newCol]
                && this.positions[move.newRow][move.newCol]['color']
            ) {
                // Same color as mine piece, skip
                if(this.positions[move.newRow][move.newCol]['color'] === this.color) {
                    return; // continue
                } else {
                    // enemy
                    this.attacks.push(Constant.position(move.newRow, move.newCol))
                }
            }

            this.moves.push(Constant.position(move.newRow, move.newCol))
        })
    }
}

export default MoveKnight