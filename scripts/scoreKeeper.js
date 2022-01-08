"use strict";

const ScoreKeeper = (() => {
    // Private Variables
    let rows = [0, 0, 0];
    let cols = [0, 0, 0];
    let diags = [0, 0];
    let playerXScore = 0;
    let playerOScore = 0;

    // Public Functions
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

    const incPlayerScore = (player) => {
        (player == 1) ? playerXScore++ : playerOScore++;
    }

    return { updateBoardScores, resetBoardScores, getBoardScores, incPlayerScore }
})();