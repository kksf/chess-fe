import Constant from "../Constant"

class MovePawn {
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
     * New row ++ for white and -- for blacks
     *
     * @param row
     * @param distance
     * @returns {number}
     */
    calcNewRow(row, distance) {
        let newRow = row - distance
        if(this.color === Constant.COLOR_WHITE) {
            newRow = row + distance
        }

        if(newRow < 1 || newRow > 8) {
            // Skip, the move is outside the game board
            return
        }

        return newRow
    }

    /**
     * Try to create move and attack positions
     *
     * @param row
     * @param distance
     */
    go(row, distance) {
        const newRow = this.calcNewRow(row, distance)
        if(!newRow) {
            return
        }

        // attack - only on distance 1, when the Pawn is next to the enemy piece
        if(distance === 1) {
            this.addAttackPositionWhenPossible(newRow, this.col - 1)
            this.addAttackPositionWhenPossible(newRow, this.col + 1)
        }

        // Check this move is not blocked
        if(this.positions[newRow] && this.positions[newRow][this.col]) {
            // Skip, there is another piece at this position
            return
        }

        this.moves.push(Constant.position(newRow, this.col))
    }

    addAttackPositionWhenPossible(row, col) {
        if(col < 1 || col > 8) {
            // Skip, it is outside the game board
            return
        }

        if(
            this.positions[row]
            && this.positions[row][col]
            && this.positions[row][col]['color'] !== this.color
        ) {
            this.attacks.push(Constant.position(row, col))
        }
    }

    /**
     * Main handler
     */
    build() {
        this.go(this.row, 1)
        // On first move can proceed 2 cells
        // It will try second position ONLY if the fist one is not blocked
        if(this.row === Constant.PAWN_INITIAL_ROW[this.color] && this.moves.length > 0) {
            this.go(this.row, 2)
        }
    }
}

export default MovePawn