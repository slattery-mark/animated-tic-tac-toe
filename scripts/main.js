"use strict";
const PlayerFactory = (name, color, symbol) => {
    const placeSymbol = (cell) => {
        cell.style.color = color;
        cell.style.mouseEvents = "none";
        cell.style.cursor = "initial";
        cell.disabled = true;
        cell.innerHTML = `<span class="symbol">${symbol}</span>`;
    }
    return { name, color, placeSymbol };
};

const GameBoard = ((doc) => {
    const boardElement = doc.getElementById("board");
    let cells = ["", "", "", "", "", "", "", "", ""];

    const getCells = () => { return cells };

    const updateCells = () => {
        for (let i = 0; i < boardElement.children.length; i++) {
            cells[i] = boardElement.children[i].textContent;
        }
    }

    const isWinningMove = () => {
        updateCells();
        for (let i = 0; i < cells.length; i++) {
            if (cells[i] != "" || undefined) {
                let symbol = cells[i];
                for (let j = -4; j <= 4; j++) {
                    if (j != 0 && cells[i + j] == symbol && cells[i + 2 * j] == symbol) return true;
                }
            }
        }
        return false;
    }


    return { getCells, isWinningMove, boardElement }
})(document);

const DisplayController = ((doc, gameBoard) => {
    var gameBoard = gameBoard;
    var playerOne = PlayerFactory("Player One", "Red", "X");
    var playerTwo = PlayerFactory("Player Two", "Blue", "O");
    var currentTurn = playerOne;

    const initialize = () => {

        // Render the board to the page
        for (let i = 0; i < gameBoard.getCells().length; i++) {
            let btn = doc.createElement("button");
            gameBoard.boardElement.appendChild(btn);
        }

        // use event propegation for putting symbols on cells
        gameBoard.boardElement.addEventListener("click", (e) => { takeTurn(e) })
    }

    const takeTurn = (e) => {
        // do nothing if player clicked the board itself
        if (e.target.id == "board") return;

        // place the symbol and change turns
        currentTurn.placeSymbol(e.target);
        if (gameBoard.isWinningMove(currentTurn.symbol)) {
            console.log("win");
        }
        else currentTurn = (currentTurn === playerOne) ? playerTwo : playerOne;
    }

    return { initialize };
})(document, GameBoard);

DisplayController.initialize();