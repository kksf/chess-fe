import Move from "./Move";

class MoveInDiagonal extends Move {
    row
    col
    color
    limitToSingleStep
    maxRow
    minRow
    maxCol
    minCol

    moves = []
    attacks = []

    constructor(positions, row, col, limitToSingleStep=false) {
        super();
        this.positions = positions
        this.row = row
        this.col = col

        this.color = positions[row][col]['color']
        this.limitToSingleStep = limitToSingleStep

        this.maxRow = this.calcMax(this.row)
        this.maxCol = this.calcMax(this.col)
        this.minRow = this.calcMin(this.row)
        this.minCol = this.calcMin(this.col)
    }

    upRight() {
        let row = this.row
        let col = this.col

        while(true) {
            row++
            col++

            if(row > this.maxRow || col > this.maxCol) {
                break
            }

            if (!this.processMove(row, col)) {
                return;
            }
        }
    }

    upLeft() {
        let row = this.row
        let col = this.col

        while(true) {
            row++
            col--

            if(row > this.maxRow || col < this.minCol) {
                break
            }

            if (!this.processMove(row, col)) {
                return;
            }
        }
    }

    downRight() {
        let row = this.row
        let col = this.col

        while(true) {
            row--
            col++

            if(row < this.minRow || col > this.maxCol) {
                break
            }

            if (!this.processMove(row, col)) {
                return
            }
        }
    }

    downLeft() {
        let row = this.row
        let col = this.col

        while(true) {
            row--
            col--

            if(row < this.minRow || col < this.minCol) {
                break
            }

            if (!this.processMove(row, col)) {
                return
            }
        }
    }

    build() {
        this.upRight()
        this.upLeft()
        this.downRight()
        this.downLeft()
    }
}

export default MoveInDiagonal