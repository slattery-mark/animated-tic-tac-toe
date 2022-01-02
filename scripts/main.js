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

    const applyAnimations = () => {

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

        for (let scores of scoreKeeper.getBoardScores()) {
            for (let score of scores) {
                if (Math.abs(score) == 3) return true;
            };
        }

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