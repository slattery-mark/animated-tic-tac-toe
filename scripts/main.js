"use strict";

const Game = ((ScoreKeeper, DisplayController) => {
    // Private Variables
    const scoreKeeper = ScoreKeeper;
    const displayController = DisplayController;
    let currentPlayer = 1;
    let turnCounter = 0;
    let winningMove = {
        set: [-1, -1, -1],
        direction: undefined,
        position: undefined
    };

    // Private Functions
    const takeTurn = (e) => {
        // disable the clicked cell on the board
        if (e.target.tagName != "BUTTON" || e.target.disabled == true) return;

        let row = e.target.dataset.row;
        let col = e.target.dataset.col;
        let idx = e.target.dataset.idx;
        turnCounter++;

        displayController.renderSymbol(idx, currentPlayer);
        displayController.switchAssets(idx, currentPlayer);

        // check for victory or tie game
        if (isWinningMove(row, col)) {
            scoreKeeper.incScore(currentPlayer);
            displayController.updateMatchScores(scoreKeeper.getMatchScores());

            // disable the board until animations complete
            new Promise(resolve => {
                displayController.disableBtns();
                displayController.applyAnimations(winningMove, currentPlayer);
                setTimeout(resolve, (displayController.animationDuration * 3));
            }).then(setupNewGame);
        }
        else if (turnCounter == 9) {
            scoreKeeper.incScore(0);
            setupNewGame();
        }

        // change turns
        currentPlayer *= -1;
    }

    const isWinningMove = (row, col) => {
        scoreKeeper.updateBoardScores(row, col, currentPlayer);

        const boardScores = scoreKeeper.getBoardScores();
        const rows = boardScores[0];
        const cols = boardScores[1];
        const diags = boardScores[2];

        for (let i = 0; i < rows.length; i++) {
            if (Math.abs(rows[i]) == 3) {
                winningMove.set = [i * 3, i * 3 + 1, i * 3 + 2];
                winningMove.direction = "row";
                winningMove.position = i + 1;
                return true;
            }
            else if (Math.abs(cols[i]) == 3) {
                winningMove.set = [i, i + 3, i + 6];
                winningMove.direction = "col";
                winningMove.position = i + 1;
                return true;
            }
            else if (i < 2 && Math.abs(diags[i]) == 3) {
                winningMove.set = (i == 0) ? [0, 4, 8] : [2, 4, 6];
                winningMove.direction = "diag";
                winningMove.position = i + 1;
                return true;
            }
        }

        return false;
    }

    const setupNewGame = () => {
        turnCounter = 0;
        scoreKeeper.resetBoardScores();
        displayController.resetBoard();
    }

    // public functions
    const init = () => {
        displayController.init(takeTurn);
    }

    return { init };

})(ScoreKeeper, DisplayController);

// "main"
Game.init();