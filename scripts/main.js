"use strict";
const PlayerFactory = (name, color, symbol) => { return ({ name, color, symbol }); }

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
    const document = Document;

    // Public Variables
    const elements = {
        buttonElements: [],
        boardElement: document.querySelector(".board"),
        playAgainBtn: document.querySelector(".play-again"),
        body: document.querySelector("body")
    }

    // Initializer -- immediately invoked
    const init = () => {
        // Render the board to the page
        for (let i = 0; i < 9; i++) {
            let btn = document.createElement("button");
            btn.classList.add("board__cell")
            btn.style.order = i + 1;
            elements.buttonElements.push(btn);
            elements.boardElement.appendChild(btn);
        }
    }

    const placeSymbol = (cell, currentPlayer) => {
        cell.style.color = currentPlayer.color;
        cell.disabled = true;
        cell.innerHTML = `<span class="board__symbol">${currentPlayer.symbol}</span>`;
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

            if (i == set[0] || i == set[1] || i == set[2]) {
                let wrapper = document.createElement("div");
                cells[i].appendChild(wrapper);
                wrapper.appendChild(symbol);
                wrapper.classList.add("expand");
                symbol.classList.add("waver");
            }
            else if (symbol) symbol.classList.add("retract");
        }
    }

    return (init(), { elements, placeSymbol, resetDisplay, applyAnimations })
})(document);

const Game = (() => {
    // Private Variables
    const cellHandler = CellHandler;
    const displayController = DisplayController;
    const playerOne = PlayerFactory("Player One", "rgb(234, 82, 111)", "X");
    const playerTwo = PlayerFactory("Player Two", "rgb(58, 166, 241)", "O");
    let currentPlayer = undefined;

    // Initalizer
    const init = () => {
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

})();

Game.init();