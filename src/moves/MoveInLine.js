import Move from "./Move"

class MoveInLine extends Move {
    row
    col
    color
    limitToSingleStep

    moves = []
    attacks = []

    constructor(positions, row, col, limitToSingleStep=false) {
        super()
        this.positions = positions
        this.row = row
        this.col = col
        this.color = positions[row][col]['color']
        this.limitToSingleStep = limitToSingleStep
    }

    up() {
        for(let i=this.row+1; i<=this.calcMax(this.row); i++) {
            if (!this.processMove(i, this.col)) {
                return
            }
        }
    }

    down() {
        for(let i=this.row-1; i>=this.calcMin(this.row); i--) {
            if (!this.processMove(i, this.col)) {
                return
            }
        }
    }

    right() {
        for(let i=this.col+1; i<=this.calcMax(this.col); i++) {
            if (!this.processMove(this.row, i)) {
                return
            }
        }
    }

    left() {
        for(let i=this.col-1; i>=this.calcMin(this.col); i--) {
            if (!this.processMove(this.row, i)) {
                return
            }
        }
    }

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

    build() {
        this.up()
        this.down()
        this.left()
        this.right()
    }
}

export default MoveInLine