"use strict";

const PlayerFactory = (name, symbol) => { return ({ name, symbol }); }

const CellHandler = (() => {
    // public Variables
    let cellArray = ["", "", "", "", "", "", "", "", ""];

    // Public Functions
    const updateCell = (index, symbol) => {
        cellArray[index] = symbol;
    }

    const resetCellArray = () => {
        for (let i = 0; i < cellArray.length; i++) {
            cellArray[i] = "";
        }
    }

    return { cellArray, updateCell, resetCellArray }
})();

const DisplayController = ((Document) => {
    // private variables
    const doc = Document;

    // Public Variables
    const elements = {
        buttonElements: [],
        boardElement: doc.querySelector(".board"),
        playAgainBtn: doc.querySelector(".play-again"),
        body: doc.querySelector("body")
    }

    // Initializer -- immediately invoked
    const init = () => {
        // Render the board to the page
        for (let i = 0; i < 9; i++) {
            let btn = doc.createElement("button");
            btn.classList.add("board__cell")
            btn.style.order = i + 1;
            elements.buttonElements.push(btn);
            elements.boardElement.appendChild(btn);
        }
    }

    const placeSymbol = (cell, currentPlayer) => {
        let symbol = currentPlayer.symbol();
        cell.appendChild(symbol);
    }

    const resetDisplay = () => {
        for (let btn of elements.buttonElements) {
            btn.textContent = "";
            btn.disabled = false;
            btn.style.color = null;
            btn.style.cursor = null;
        }
    }

    const applyAnimations = (set) => {
        let cells = elements.buttonElements;

        for (let i = 0; i < cells.length; i++) {
            let symbol = cells[i].firstChild;

            if (i == set[0] || i == set[1] || i == set[2]) symbol.classList.add("expand");
            else if (symbol) symbol.classList.add("retract");
        }
    }

    return { init, elements, placeSymbol, resetDisplay, applyAnimations };
})(document);

const Game = ((CellHandler, DisplayController, AssetCreator) => {
    // Private Variables
    const cellHandler = CellHandler;
    const displayController = DisplayController;
    const assetCreator = AssetCreator;
    let playerOne = null;
    let playerTwo = null;
    let currentPlayer = undefined;

    // Initalizer
    const init = () => {
        displayController.init();

        playerOne = PlayerFactory("Player One", assetCreator.createXSymbol);
        playerTwo = PlayerFactory("Player Two", assetCreator.createOSymbol);
        currentPlayer = playerOne;
        
        bindUIElements();
    }

    // Private Functions
    const bindUIElements = () => {
        // use event propegation for putting symbols on cells
        displayController.elements.boardElement.addEventListener("click", (e) => { takeTurn(e) })
        displayController.elements.playAgainBtn.addEventListener("click", setupNewGame);
    }

    const takeTurn = (e) => {
        // disable the clicked cell on the board
        if (e.target.tagName != "BUTTON" || e.target.disabled == true) return;

        // place the symbol and change turns
        displayController.placeSymbol(e.target, currentPlayer);

        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;

        if (isWinningMove(e.target.style.order - 1, currentPlayer.symbol)) {
            // do something..
        }
    }

    const isWinningMove = (index, symbol) => {
        cellHandler.updateCell(index, symbol);

        let winningSet = undefined;
        const cells = cellHandler.cellArray;

        // check columns 1, 2, 3
        if (index == 0 || index == 3 || index == 6) {
            if (cells[0] == symbol && cells[3] == symbol && cells[6] == symbol) {
                winningSet = [0, 3, 6];
            }
        }
        else if (index == 1 || index == 4 || index == 7) {
            if (cells[1] == symbol && cells[4] == symbol && cells[7] == symbol) {
                winningSet = [1, 4, 7];
            }
        }
        else if (index == 2 || index == 5 || index == 8) {
            if (cells[2] == symbol && cells[5] == symbol && cells[8] == symbol) {
                winningSet = [2, 5, 8];
            }
        }

        // check rows 1, 2, 3
        if (index == 0 || index == 1 || index == 2) {
            if (cells[0] == symbol && cells[1] == symbol && cells[2] == symbol) {
                winningSet = [0, 1, 2];
            }
        }
        else if (index == 3 || index == 4 || index == 5) {
            if (cells[3] == symbol && cells[4] == symbol && cells[5] == symbol) {
                winningSet = [3, 4, 5];
            }
        }
        else if (index == 6 || index == 7 || index == 8) {
            if (cells[6] == symbol && cells[7] == symbol && cells[8] == symbol) {
                winningSet = [6, 7, 8];
            }
        }

        // check diags L-to-R, R-to-L
        if (index == 0 || index == 4 || index == 8) {
            if (cells[0] == symbol && cells[4] == symbol && cells[8] == symbol) {
                winningSet = [0, 4, 8];
            }
        }

        else if (index == 2 || index == 4 || index == 6) {
            if (cells[2] == symbol && cells[4] == symbol && cells[6] == symbol) {
                winningSet = [2, 4, 6];
            }
        }

        if (winningSet) {
            displayController.applyAnimations(winningSet);
            return true;
        }
        return false;
    }

    const setupNewGame = () => {
        cellHandler.resetCellArray();
        displayController.resetDisplay();
    }

    return { init };

})(CellHandler, DisplayController, AssetCreator);

Game.init();