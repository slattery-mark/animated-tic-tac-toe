"use strict";
const PlayerFactory = (name, color, symbol) => { return ({ name, color, symbol }); }

const CellHandler = (() => {
    // Private Variables
    let cellArray = ["", "", "", "", "", "", "", "", ""];

    // Public Functions
    const updateCell = (index, symbol) => { 
        cellArray[index] = symbol;
    }

    const winningCells = (index, symbol) => {
        updateCell(index, symbol);

        // check columns 1, 2, 3
        if (index == 0 || index == 3 || index == 6) {
            if (cellArray[0] == symbol && cellArray[3] == symbol && cellArray[6] == symbol) return [0, 3, 6];
        }
        else if (index == 1 || index == 4 || index == 7) {
            if (cellArray[1] == symbol && cellArray[4] == symbol && cellArray[7] == symbol) return [1, 4, 7];
        }
        else if (index == 2 || index == 5 || index == 8) {
            if (cellArray[2] == symbol && cellArray[5] == symbol && cellArray[8] == symbol) return [2, 5, 8];
        }

        // check rows 1, 2, 3
        if (index == 0 || index == 1 || index == 2) {
            if (cellArray[0] == symbol && cellArray[1] == symbol && cellArray[2] == symbol) return [0, 1, 2];
        }
        else if (index == 3 || index == 4 || index == 5) {
            if (cellArray[3] == symbol && cellArray[4] == symbol && cellArray[5] == symbol) return [3, 4, 5];
        }
        else if (index == 6 || index == 7 || index == 8) {
            if (cellArray[6] == symbol && cellArray[7] == symbol && cellArray[8] == symbol) return [6, 7, 8];
        }

        // check diags L-to-R, R-to-L
        if (index == 0 || index == 4 || index == 8) {
            if (cellArray[0] == symbol && cellArray[4] == symbol && cellArray[8] == symbol) return [0, 4, 8];
        }
        else if (index == 2 || index == 4 || index == 6) {
            if (cellArray[2] == symbol && cellArray[4] == symbol && cellArray[6] == symbol) return [2, 4, 6];
        }

        return [-1, -1, -1];
    }

    const resetCellArray = () => {
        for (let i = 0; i < cellArray.length; i++) {
            cellArray[i] = "";
        }
    }

    return { winningCells, resetCellArray }
})();

const DisplayController = ((doc) => {
    // Public Variables
    const elements = {
        buttonElements: [],
        boardElement: doc.getElementById("board"),
        resetBtn: doc.getElementById("reset")
    }


    // Initializer -- immediately invoked
    const init = () => {
        // Render the board to the page
        for (let i = 0; i < 9; i++) {
            let btn = doc.createElement("button");
            btn.style.order = i + 1;
            elements.buttonElements.push(btn);
            elements.boardElement.appendChild(btn);
        }
    }

    // Public Functions
    const placeSymbol = (cell, currentPlayer) => {
        cell.style.color = currentPlayer.color;
        cell.disabled = true;
        cell.innerHTML = `<span class="symbol">${currentPlayer.symbol}</span>`;
    }

    const resetDisplay = () => {
        for (let btn of elements.buttonElements) {
            btn.textContent = "";
            btn.disabled = false;
            btn.style.color = null;
            btn.style.cursor = null;
        }
    }

    const applyWinAnimation = (set) => {
        for (let idx of set) {
            console.log(elements.buttonElements[idx].children)
            elements.buttonElements[idx].children[0].classList.add("win");
        }
    }

    return (init(), { elements, placeSymbol, resetDisplay, applyWinAnimation })
})(document);

const Game = ((displayController, cellHandler) => {
    // Private Variables
    const playerOne = PlayerFactory("Player One", "Red", "X");
    const playerTwo = PlayerFactory("Player Two", "Blue", "O");
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
        displayController.elements.resetBtn.addEventListener("click", resetGame);
    }

    const takeTurn = (e) => {
        if (e.target.tagName != "BUTTON" || e.target.disabled == true) return;

        // place the symbol, check for victory, and change turns
        displayController.placeSymbol(e.target, currentPlayer);
        if (isWinningMove(e.target)) {

        }
        else currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    }

    const isWinningMove = (cell) => {
        let winningSet = cellHandler.winningCells(cell.style.order - 1, cell.textContent);
        if (winningSet[0] != -1) {
            displayController.applyWinAnimation(winningSet);
            return true;
        }
        return false;
    }

    const resetGame = () => {
        cellHandler.resetCellArray();
        displayController.resetDisplay();
    }

    return { init };
})(DisplayController, CellHandler);

Game.init();