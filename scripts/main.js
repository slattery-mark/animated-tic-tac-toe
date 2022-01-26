"use strict";

/**
 * Controls the flow of the game, initiates the functions of all other objects
 */
const Game = ((ScoreKeeper, DisplayController) => {
    /* -------------------- */
    /*   PRIVATE VARIABLES  */
    /* -------------------- */

    const scoreKeeper = ScoreKeeper;
    const displayController = DisplayController;
    let currentPlayer = 1;
    let turnCounter = 0;
    let finalMove = {
        set: [-1, -1, -1],
        direction: undefined,
        position: undefined
    };

    /* -------------------- */
    /*   PRIVATE FUNCTIONS  */
    /* -------------------- */
    //#region 

    /**
     * Initiates drawing of svg on clicked cell, checks for victory, then changes turns
     * @param {Object} e - contains information about the cell that was clicked
     * @returns - instantly returns if a cell was not clicked (e.g., the border of the board)
     */
    const takeTurn = (e) => {
        if (e.target.tagName != "BUTTON" || e.target.disabled == true) return;

        let row = e.target.dataset.row;
        let col = e.target.dataset.col;
        let idx = e.target.dataset.idx;
        turnCounter++;

        displayController.disableBtn(idx);
        displayController.renderSymbol(idx, currentPlayer);
        displayController.switchAssets(idx, currentPlayer);

        // check for victory or tie game
        if (isWinningMove(row, col)) {
            scoreKeeper.incScore(currentPlayer);
            displayController.updateMatchScores(scoreKeeper.getMatchScores());

            // disable the board until animations complete
            new Promise(resolve => {
                displayController.disableBtns();
                displayController.applyLineAnimation(finalMove, currentPlayer);
                displayController.applyShrinkAnimation(finalMove);
                setTimeout(resolve, displayController.animationDuration * 3);
            }).then(setupNewGame);
        }
        // handle a tie game
        else if (turnCounter == 9) {
            finalMove.set = [-1, -1, -1];
            new Promise(resolve => {
                setTimeout(() => {
                    displayController.applyShrinkAnimation(finalMove);
                    setTimeout(resolve, displayController.animationDuration * 3);
                }, displayController.animationDuration);
            }).then(setupNewGame);
        }

        // change turns
        currentPlayer *= -1;
    }

    /**
     * Checks for a victory along each row, column, and diagonal
     * @param {Number} row - the row of the cell that was clicked
     * @param {Number} col - the column of the cell that was clicked
     * @returns true if winning move, false if not
     */
    const isWinningMove = (row, col) => {
        scoreKeeper.updateBoardScores(row, col, currentPlayer);

        const boardScores = scoreKeeper.getBoardScores();
        const rows = boardScores[0];
        const cols = boardScores[1];
        const diags = boardScores[2];

        for (let i = 0; i < rows.length; i++) {
            if (Math.abs(rows[i]) == 3) {
                finalMove.set = [i * 3, i * 3 + 1, i * 3 + 2];
                finalMove.direction = "row";
                finalMove.position = i + 1;
                return true;
            }
            else if (Math.abs(cols[i]) == 3) {
                finalMove.set = [i, i + 3, i + 6];
                finalMove.direction = "col";
                finalMove.position = i + 1;
                return true;
            }
            else if (i < 2 && Math.abs(diags[i]) == 3) {
                finalMove.set = (i == 0) ? [0, 4, 8] : [2, 4, 6];
                finalMove.direction = "diag";
                finalMove.position = i + 1;
                return true;
            }
        }

        return false;
    }

    /**
     * Initiates reset of board scores and wipes svgs off the board
     */
    const setupNewGame = () => {
        turnCounter = 0;
        scoreKeeper.resetBoardScores();
        displayController.resetBoard();
    }
    
    //#endregion
    /* -------------------- */
    /*   PUBLIC FUNCTIONS   */
    /* -------------------- */

    const init = () => displayController.init(takeTurn);

    return { init };

})(ScoreKeeper, DisplayController);

/* ------ */
/* "MAIN" */
/* ------ */
Game.init();