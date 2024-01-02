class Constant {
    static COLOR_WHITE = 'white'
    static COLOR_BLACK = 'black'

    static TYPE_PAWN = 'pawn'
    static TYPE_ROOK = 'rook'
    static TYPE_KNIGHT = 'knight'
    static TYPE_BISHOP = 'bishop'
    static TYPE_KING = 'king'
    static TYPE_QUEEN = 'queen'

    static PAWN_INITIAL_ROW = {
        [this.COLOR_WHITE]: 2,
        [this.COLOR_BLACK]: 7,
    }

    // static URL_BE = 'http://localhost:3000'
    static URL_BE = 'https://chess-be.adaptable.app'

    static position(row, col) {
        return {row, col}
    }
}

export default Constant