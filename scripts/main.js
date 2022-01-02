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

const DisplayController = ((Document, AssetCreator) => {
    // private variables
    const doc = Document;
    const assetCreator = AssetCreator;

    // Public Variables
    const elements = {
        buttonElements: [],
        boardElement: doc.querySelector(".board"),
        playAgainBtn: doc.querySelector(".play-again"),
        body: doc.querySelector("body")
    }

    // Initializer -- immediately invoked
    const init = () => {
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

                elements.buttonElements.push(btn);
                elements.boardElement.appendChild(btn);
            }
        }
    }

    const renderSymbol = (idx, currentPlayer) => {
        let symbol = (currentPlayer == 1) ? assetCreator.createXSymbol() : assetCreator.createOSymbol();
        elements.buttonElements[idx].appendChild(symbol);
    }

    const resetDisplay = () => {
        for (let btn of elements.buttonElements) {
            btn.textContent = "";
            btn.disabled = false;

            // remove animations
            btn.classList.remove("contract");
        }
    }

    const applyAnimations = () => {

    }

    return { init, elements, renderSymbol, resetDisplay, applyAnimations };
})(document, AssetCreator);

const Game = ((ScoreKeeper, DisplayController) => {
    // Private Variables
    const scoreKeeper = ScoreKeeper;
    const displayController = DisplayController;
    let currentPlayer = 1;

    // Initalizer
    const init = () => {
        displayController.init();
        bindUIElements();
    }

    // Private Functions
    const bindUIElements = () => {
        // use event propegation for putting symbols on cells
        displayController.elements.boardElement.addEventListener("click", (e) => { takeTurn(e) })
    }

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
            setupNewGame();
        }

        currentPlayer *= -1;
    }

    const isWinningMove = (row, col) => {
        scoreKeeper.updateBoardScores(row, col, currentPlayer);

        for (let scores of scoreKeeper.getBoardScores()) {
            for (let score of scores) {
                if (Math.abs(score) == 3) return true;
            }
        }
        return false;
    }

    const setupNewGame = () => {
        scoreKeeper.resetBoardScores();
        displayController.resetDisplay();
    }

    return { init };

})(ScoreKeeper, DisplayController);

Game.init();