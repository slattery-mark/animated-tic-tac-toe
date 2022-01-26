"use strict";

const ScoreKeeper = (() => {
    /* -------------------- */
    /*   PRIVATE VARIABLES  */
    /* -------------------- */

    let rows = [0, 0, 0];
    let cols = [0, 0, 0];
    let diags = [0, 0];
    let playerXScore = 0;
    let playerOScore = 0;

    /* -------------------- */
    /*   PUBLIC FUNCTIONS   */
    /* -------------------- */
    //#region 

    /**
     * Updates the board score based on the clicked cell
     * @param {Number} row - the row of the clicked cell
     * @param {Number} col - the column of the clicked cell
     * @param {Number} currentPlayer - X = 1, O = -1
     */
    const updateBoardScores = (row, col, currentPlayer) => {
        row = parseInt(row);
        col = parseInt(col);
        rows[row] += currentPlayer;
        cols[col] += currentPlayer;
        if (row === col) diags[0] += currentPlayer;
        if (row + col == 2) diags[1] += currentPlayer;
    }

    const resetBoardScores = () => {
        rows = [0, 0, 0];
        cols = [0, 0, 0];
        diags = [0, 0];
    }

    const getBoardScores = () => {
        return [rows, cols, diags];
    }

    const getMatchScores = () => {
        return [playerXScore, playerOScore];
    }

    const incScore = (result) => {
        if (result === 1) playerXScore++;
        else playerOScore++;
    }

    //#endregion
    return { updateBoardScores, resetBoardScores, getBoardScores, getMatchScores, incScore }
})();