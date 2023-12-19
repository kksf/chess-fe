import PieceFactory from "./pieces/PieceFactory";
import Constant from "./Constant";

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

        this.haveMoves[Constant.COLOR_WHITE] = false;
        this.haveMoves[Constant.COLOR_BLACK] = false;

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

        return positions;
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
            const row = positions[rowKey];
            for (const colKey in row) {
                const piece = row[colKey];
                if (piece.type === type && piece.color === color) {
                    return { row: +rowKey, col: +colKey };
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
            const row = positions[rowKey];
            for (const colKey in row) {
                const piece = row[colKey];
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