import PieceFactory from "./pieces/PieceFactory"
import Constant from "./Constant"

class Board {
    kingsPositions = {}
    haveMoves = {}

    /**
     * Create game
     *
     * @param oldPositions
     */
    create(oldPositions) {
        let positions = JSON.parse(JSON.stringify(oldPositions))
        positions = this.updateMoves(positions)

        this.kingsPositions[Constant.COLOR_WHITE] = this.findPiece(Constant.TYPE_KING, Constant.COLOR_WHITE, positions)
        this.kingsPositions[Constant.COLOR_BLACK] = this.findPiece(Constant.TYPE_KING, Constant.COLOR_BLACK, positions)

        this.haveMoves[Constant.COLOR_WHITE] = false
        this.haveMoves[Constant.COLOR_BLACK] = false

        for (let rowKey in positions) {
            const row = positions[rowKey];
            for (let colKey in row) {
                rowKey = +rowKey
                colKey = +colKey
                for(const move of positions[rowKey][colKey]['moves']) {
                    // clone position from the original, create virtual board
                    let tmpPositions = JSON.parse(JSON.stringify(oldPositions))
                    // do move
                    tmpPositions[move.row] ??= {}
                    tmpPositions[move.row][move.col] = {...positions[rowKey][colKey]}
                    // remove element
                    delete tmpPositions[rowKey][colKey]
                    // calculate moves and attacks
                    tmpPositions = this.updateMoves(tmpPositions)
                    // Load king position
                    let myKingPosition = this.kingsPositions[tmpPositions[move.row][move.col]['color']]
                    // when king is moved - recalculate king position
                    if(tmpPositions[move.row][move.col]['type'] === Constant.TYPE_KING) {
                        myKingPosition = this.findPiece(
                            Constant.TYPE_KING, tmpPositions[move.row][move.col]['color'],
                            tmpPositions
                        )
                    }
                    // if my king is under check after current move - skip this move
                    if(this.isUnderCheck(myKingPosition, tmpPositions)) {
                        positions[rowKey][colKey]['moves'] = positions[rowKey][colKey]['moves'].filter(
                            item => !(item.row === move.row && item.col === move.col)
                        );
                        positions[rowKey][colKey]['attacks'] = positions[rowKey][colKey]['attacks'].filter(
                            item => !(item.row === move.row && item.col === move.col)
                        );
                    }
                }

                if(positions[rowKey][colKey]['moves'].length > 0) {
                    this.haveMoves[positions[rowKey][colKey]['color']] = true
                }
            }
        }
        positions = this.updateThreats(positions)
        positions = this.updateCastings(positions)

        return positions;
    }

    updateCastings(positions) {
        [1, 8].forEach((row) => {
            // king and rooks must not be moved
            const king = positions[row][5] ?? null;
            console.log('king', king)
            if(king === null || king?.moved === true) {
                return
            }
            const rookL = positions[row][1] ?? null;
            const rookR = positions[row][8] ?? null;

            if(rookL) {
                positions[row][1]['castings'] = []
            }
            if(rookR) {
                positions[row][8]['castings'] = []
            }
            // king
            positions[row][5]['castings'] = []

            // check that there are no pieces between king and rook
            console.log('positions 2 3 4', positions[row][2]?.type, positions[row][3]?.type, positions[row][4]?.type)
            if(rookL
                && rookL.moved === false
                && (positions[row][2]?.type ?? null) === null
                && (positions[row][3]?.type ?? null) === null
                && (positions[row][4]?.type ?? null) === null) {
                const longCastingMoves = [
                    {from: {row: row, col: 1}, to: {row: row, col: 4}},
                    {from: {row: row, col: 5}, to: {row: row, col: 3}},
                ]
                positions[row][1]['castings'] = [{
                    clickable: {row: row, col: 5},
                    moves: longCastingMoves
                }]
                positions[row][5]['castings'].push({
                    clickable: {row: row, col: 1},
                    moves: longCastingMoves
                })
            }

            if(rookR
                && rookR?.moved === false
                && (positions[row][6]?.type ?? null) === null
                && (positions[row][7]?.type ?? null) === null) {
                const shortCastingMoves = [
                    {from: {row: row, col: 8}, to: {row: row, col: 6}},
                    {from: {row: row, col: 5}, to: {row: row, col: 7}},
                ]
                positions[row][8]['castings'] = [{
                    clickable: {row: row, col: 5},
                    moves: shortCastingMoves
                }]
                positions[row][5]['castings'].push({
                    clickable: {row: row, col: 8},
                    moves: shortCastingMoves
                })
            }
        })

        return positions
    }

    /**
     * Calculate normal moves and attacks
     * @param positions
     * @returns {*}
     */
    updateMoves(positions) {
        for (const rowKey in positions) {
            const row = positions[rowKey];
            for (const colKey in row) {
                const PieceMoves = new PieceFactory(positions, +rowKey, +colKey).init().getMoves()
                positions[rowKey][colKey]['moves'] = PieceMoves.moves
                positions[rowKey][colKey]['attacks'] = PieceMoves.attacks
            }
        }

        return positions
    }

    /**
     * My threads contain my attackers positions
     * @param positions
     * @returns {*}
     */
    updateThreats(positions) {
        for (let rowKey in positions) {
            const row = positions[rowKey];
            for (let colKey in row) {
                rowKey = +rowKey
                colKey = +colKey
                for(const attack of positions[rowKey][colKey]['attacks']) {
                    positions[+attack.row][+attack.col]['threads'] ??= []
                    positions[+attack.row][+attack.col]['threads'].push(Constant.position(rowKey, colKey))
                }
            }
        }

        return positions
    }

    /**
     * Find first occurrence of piece by type and color in positions
     *
     * @param type
     * @param color
     * @param positions
     * @returns {null|{col: number, row: number}}
     */
    findPiece(type, color, positions) {
        for (const rowKey in positions) {
            const row = positions[rowKey]
            for (const colKey in row) {
                const piece = row[colKey]
                if (piece.type === type && piece.color === color) {
                    return { row: +rowKey, col: +colKey }
                }
            }
        }
        return null;
    }

    /**
     * True, when kingPosition contains in someone`s attacks array
     *
     * @param kingPosition
     * @param positions
     * @returns {boolean}
     */
    isUnderCheck(kingPosition, positions) {
        for (const rowKey in positions) {
            const row = positions[rowKey]
            for (const colKey in row) {
                const piece = row[colKey]
                for(const attackRow in piece.attacks) {
                    if(
                        piece.attacks[attackRow]['row'] === kingPosition['row']
                        && piece.attacks[attackRow]['col'] === kingPosition['col']
                    ) {
                        return true
                    }
                }
            }
        }

        return false
    }

}

export default Board