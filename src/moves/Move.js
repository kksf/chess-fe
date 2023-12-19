import Constant from "../Constant"

class Move {
    positions

    calcMin(val) {
        if(this.limitToSingleStep && val - 1 > 0) {
            return val - 1
        }

        return 1
    }

    calcMax(val) {
        if(this.limitToSingleStep && val + 1 < 8) {
            return val + 1
        }

        return 8
    }

    processMove(row, col) {
        // Check there is another piece at the new position
        if(this.positions[row] && this.positions[row][col] && this.positions[row][col]['color']) {
            if(this.positions[row][col]['color'] !== this.color) {
                this.moves.push(Constant.position(row, col))
                this.attacks.push(Constant.position(row, col))
            }

            return false
        }
        this.moves.push(Constant.position(row, col))

        return true
    }
}

export default Move