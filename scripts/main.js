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
    const animationDuration = parseInt(getComputedStyle(doc.documentElement).getPropertyValue('--total-anim-duration')) * 3 * 1000;

    // private functions
    const bindUIElements = (takeTurnFunc) => {
        // use event propegation for putting symbols on cells
        elements.boardElement.addEventListener("click", takeTurnFunc);
    }

    // public functions
    const init = (takeTurnFunc) => {
        // Generate the board/Cells
        let k = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                let btn = doc.createElement("button");
                btn.classList.add("board__cell");
                btn.classList.add("l-flex-center");
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

    const disableBtns = () => {
        for (let btn of elements.boardBtns) btn.disabled = true;
    }

    const resetDisplay = () => {
        for (let btn of elements.boardBtns) {
            btn.textContent = "";
            btn.disabled = false;

            // remove animations
            btn.classList.remove("contract");
            btn.classList.remove("fade-out");
        }

        doc.querySelector(".board__line").remove();
    }

    const applyAnimations = (winningMove, winner) => {

        // shrink non-victory symbols
        elements.boardBtns.forEach((btn, i) => {
            if (btn.children[0]) {
                let symbol = btn.children[0];
                if (!winningMove.set.includes(i)) symbol.classList.add("retract");
                symbol.classList.add("fade-out");
            }
        })

        let line = assetCreator.createLine(winner, winningMove.direction, winningMove.position);
        line.classList.add("fade-out");
        elements.boardElement.appendChild(line);
    }

    return { init, renderSymbol, resetDisplay, applyAnimations, animationDuration, disableBtns };
})(document, AssetCreator);

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

        turnCounter++;

        // place the symbol, check win, change turns
        let row = e.target.dataset.row;
        let col = e.target.dataset.col;
        let idx = e.target.dataset.idx;

        displayController.renderSymbol(idx, currentPlayer);

        if (isWinningMove(row, col)) {
            scoreKeeper.incScore(currentPlayer);

            // disable the board until animations complete
            new Promise((resolve, reject) => {
                displayController.disableBtns();
                displayController.applyAnimations(winningMove, currentPlayer);
                setTimeout(resolve, (displayController.animationDuration));
            }).then(setupNewGame);
        }

        else if (turnCounter == 9) {
            scoreKeeper.incScore(0);
            setupNewGame();
            // tie game
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

            if (Math.abs(cols[i]) == 3) {
                winningMove.set = [i, i + 3, i + 6];
                winningMove.direction = "col";
                winningMove.position = i + 1;
                return true;
            }


            if (i < 2 && Math.abs(diags[i]) == 3) {
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
        displayController.resetDisplay();
    }

    // public functions
    const init = () => {
        displayController.init(takeTurn);
    }

    return { init };

})(ScoreKeeper, DisplayController);

// "main"
Game.init();