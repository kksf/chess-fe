import Constant from "../Constant";
import Pawn from "./Pawn";
import Knight from "./Knight";
import Rook from "./Rook";
import King from "./King";
import Bishop from "./Bishop";
import Queen from "./Queen";

class PieceFactory {

    positions
    type
    row
    col

    constructor(positions, row, col) {
        this.positions = positions
        this.row = row
        this.col = col
        this.type = positions[row][col]['type']
    }

    init() {
        switch (this.type) {
            case Constant.TYPE_PAWN:
                return new Pawn(this.positions, this.row, this.col)
            case Constant.TYPE_KING:
                return new King(this.positions, this.row, this.col)
            case Constant.TYPE_BISHOP:
                return new Bishop(this.positions, this.row, this.col)
            case Constant.TYPE_ROOK:
                return new Rook(this.positions, this.row, this.col)
            case Constant.TYPE_KNIGHT:
                return new Knight(this.positions, this.row, this.col)
            case Constant.TYPE_QUEEN:
                return new Queen(this.positions, this.row, this.col)
            default:
                console.error("Invalid piece type", this.type)
        }
    }

}

export default PieceFactory;