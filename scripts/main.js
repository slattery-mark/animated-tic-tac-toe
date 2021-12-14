"use strict";
const PlayerFactory = (name, color, symbol) => {
    const placeSymbol = (cell) => {
        cell.style.color = color;
        cell.style.mouseEvents = "none";
        cell.style.cursor = "initial";
        cell.disabled = true;
        cell.textContent = symbol;
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

    return { getCells, updateCells, boardElement }
})(document);

const DisplayController = ((doc, gameBoard) => {
    var gameBoard = gameBoard;
    var playerOne = PlayerFactory("Player One", "Red", "X");
    var playerTwo = PlayerFactory("Player Two", "Blue", "O");
    var currentTurn = playerOne;

    // Render the board to the page
    const initialize = () => {
        gameBoard.getCells().forEach(() => {
            let btn = doc.createElement("button");
            gameBoard.boardElement.appendChild(btn);
        })

        // use event propegation for putting symbols on cells
        gameBoard.boardElement.addEventListener("click", (e) => { takeTurn(e) })
    }

    const takeTurn = (e) => {
        // do nothing if player clicked the board itself
        if (e.target.id == "board") return;

        // place the symbol and change turns
        currentTurn.placeSymbol(e.target);
        gameBoard.updateCells();
        console.log(gameBoard.getCells());

        currentTurn = (currentTurn === playerOne) ? playerTwo : playerOne;
    }

    return { initialize };
})(document, GameBoard);

DisplayController.initialize();