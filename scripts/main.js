"use strict";
const PlayerFactory = (name, color, symbol) => { return ({ name, color, symbol }); }

const cells = (() => {
    // Private Variables
    let cells = ["", "", "", "", "", "", "", "", ""];

    // Private Functions
    const updateCell = () => { }

    // Public Functions
    const isWinningMove = () => {
        updateCell();
        for (let i = 0; i < cells.length; i++) {

        }
        return false;
    }

    return { isWinningMove }
})();

const DisplayController = ((doc) => {
    // Private Variables
    let buttonElements = [];

    // Public Variables
    const boardElement = doc.getElementById("board");

    // Initializer
    const init = () => {
        // Render the board to the page
        for (let i = 0; i < 9; i++) {
            let btn = doc.createElement("button");
            btn.style.order = i + 1;
            buttonElements.push(btn);
            boardElement.appendChild(btn);
        }
    }

    // Public Functions
    const placeSymbol = (cell, currentPlayer) => {
        cell.style.color = currentPlayer.color;
        cell.style.mouseEvents = "none";
        cell.style.cursor = "initial";
        cell.disabled = true;
        cell.innerHTML = `<span class="symbol">${currentPlayer.symbol}</span>`;
    }

    return { init, boardElement, placeSymbol }
})(document);

const Game = ((cells, displayController) => {
    const playerOne = PlayerFactory("Player One", "Red", "X");
    const playerTwo = PlayerFactory("Player Two", "Blue", "O");
    let currentPlayer = undefined;

    // Initalizer
    const init = () => {
        currentPlayer = playerOne;
        displayController.init();
        bindUIElements();
    }

    // Private Functions
    const bindUIElements = () => {
        // use event propegation for putting symbols on cells
        displayController.boardElement.addEventListener("click", (e) => { takeTurn(e) })
    }

    const takeTurn = (e) => {
        // do nothing if player clicked the board itself
        if (e.target.id == "board") return;

        // place the symbol, check for victory, and change turns
        displayController.placeSymbol(e.target, currentPlayer);
        if (cells.isWinningMove(e.target.style.order)) {
            console.log("win");
        }
        else currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    }

    return { init };
})(cells, DisplayController);

Game.init();