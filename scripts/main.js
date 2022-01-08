"use strict";

const DisplayController = ((Document, AssetCreator) => {
    // private variables
    const doc = Document;
    const assetCreator = AssetCreator;
    const elements = {
        boardBtns: [],
        boardElement: doc.querySelector(".board"),
        playAgainBtn: doc.querySelector(".play-again"),
        body: doc.querySelector("body")
    }

    // private functions
    const bindUIElements = (takeTurnFunc) => {
        // use event propegation for putting symbols on cells
        elements.boardElement.addEventListener("click", takeTurnFunc);
    }

    // public functions
    const init = (takeTurnFunc) => {
        // Create the board
        let k = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                let btn = doc.createElement("button");
                btn.classList.add("board__cell")
                btn.dataset.row = i;
                btn.dataset.col = j;
                btn.dataset.idx = k;

                k++;

                elements.boardBtns.push(btn);
                elements.boardElement.appendChild(btn);
            }
        }

        bindUIElements(takeTurnFunc);
    }

    const renderSymbol = (idx, currentPlayer) => {
        elements.boardBtns[idx].disabled = true;
        let symbol = (currentPlayer == 1) ? assetCreator.createXSymbol() : assetCreator.createOSymbol();
        elements.boardBtns[idx].appendChild(symbol);
    }

    const resetDisplay = () => {
        for (let btn of elements.boardBtns) {
            btn.textContent = "";
            btn.disabled = false;

            // remove animations
            btn.classList.remove("contract");
        }
    }

    const applyAnimations = (winningDirection, winner) => {
        // winning direction:
        // rows 1 2 3 = 0 1 2
        // cols 1 2 3 = 3 4 5
        // diags main anti = 6 7

        let skipSymbols = undefined;
        let direction = undefined;
        let position = undefined;
        switch (winningDirection) {
            case 0:
                skipSymbols = [0, 1, 2];
                direction = "row";
                position = 1;
                break;
            case 1:
                skipSymbols = [3, 4, 5];
                direction = "row";
                position = 2;
                break;
            case 2:
                skipSymbols = [6, 7, 8];
                direction = "row";
                position = 3;
                break;
            case 3:
                skipSymbols = [0, 3, 6];
                direction = "col";
                position = 1;
                break;
            case 4:
                skipSymbols = [1, 4, 7];
                direction = "col";
                position = 2;
                break;
            case 5:
                skipSymbols = [2, 5, 8];
                direction = "col";
                position = 3;
                break
            case 6:
                skipSymbols = [0, 4, 8];
                direction = "diag";
                position = 1;
                break
            case 7:
                skipSymbols = [2, 4, 6];
                direction = "diag";
                position = 2;
                break
        }

        // shrink non-victory symbols
        elements.boardBtns.forEach((btn, idx) => {
            if (!skipSymbols.includes(idx)) {
                if (btn.children[0]) btn.children[0].classList.add("retract");
            }
        })

        let line = assetCreator.createLine(winner, direction, position);
        elements.boardElement.appendChild(line);
    }

    return { init, renderSymbol, resetDisplay, applyAnimations };
})(document, AssetCreator);

const Game = ((ScoreKeeper, DisplayController) => {
    // Private Variables
    const scoreKeeper = ScoreKeeper;
    const displayController = DisplayController;
    let currentPlayer = 1;

    // Private Functions
    const takeTurn = (e) => {
        // disable the clicked cell on the board
        if (e.target.tagName != "BUTTON" || e.target.disabled == true) return;

        // place the symbol, check win, change turns
        let row = e.target.dataset.row;
        let col = e.target.dataset.col;
        let idx = e.target.dataset.idx;

        displayController.renderSymbol(idx, currentPlayer);

        if (isWinningMove(row, col)) {
            scoreKeeper.incPlayerScore(currentPlayer);
            // displayController.applyAnimations();
            // setupNewGame();
        }

        // change turns
        currentPlayer *= -1;
    }

    const isWinningMove = (row, col) => {
        scoreKeeper.updateBoardScores(row, col, currentPlayer);

        scoreKeeper.getBoardScores().forEach((scores, i) => {
            scores.forEach((score, j) => {
                let absScore = Math.abs(score);
                if (Math.abs(absScore == 3)) {

                    // should find a way outside this function to apply the animations in a way
                    // that doesn't require re-determining a victory
                    let winningDirection = (i * 3) + j;
                    displayController.applyAnimations(winningDirection, currentPlayer);

                    return true;
                }
            })
        })
        return false;
    }

    const setupNewGame = () => {
        scoreKeeper.resetBoardScores();
        displayController.resetDisplay();
    }

    // public functions
    const init = () => {
        displayController.init(takeTurn);
    }

    return { init };

})(ScoreKeeper, DisplayController);

Game.init();