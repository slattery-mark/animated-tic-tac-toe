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

const Customizer = (() => {
    const changePlayerDisplay = (player, name, color, symbol) => {
        player.style.name = name;
        player.style.color = color;
        player.style.symbol = symbol;
    }

    const changeBackgroundClr = (background, color) => {
        background.style.backgroundColor = color;
    }

    const changeBoardClr = (board, color) => {
        board.style.backgroundColor = color;
    }

    return { changePlayerDisplay, changeBackgroundClr, changeBoardClr };
})();

const DisplayController = ((doc, customize) => {
    // private variables
    const customizer = customize;

    // Public Variables
    const elements = {
        buttonElements: [],
        boardElement: doc.getElementById("board"),
        restartBtn: doc.getElementById("restart"),
        body: doc.querySelector("body")
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

    const customizeGame = (e) => {
        customizer.changePlayerDisplay(playerOne, playerOneName, playerOneClr);
        customizer.changePlayerDisplay(playerTwo, playerTwoName, playerTwoClr);
        customizer.changeBoardClr(elements.board, boardColor);
        customizer.changeBackgroundClr(elements.body, backgroundColor);
    }

    const applyWinAnimation = (set) => {
        for (let idx of set) {
            elements.buttonElements[idx].children[0].classList.add("win");
        }
    }

    return (init(), { customizer, elements, placeSymbol, resetDisplay, applyWinAnimation })
})(document, Customizer);

const Game = (() => {
    // Private Variables
    const cellHandler = CellHandler;
    const displayController = DisplayController;
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
        displayController.elements.restartBtn.addEventListener("click", restartGame);
    }


    const takeTurn = (e) => {
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
                winningSet[1, 4, 7];
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
            displayController.applyWinAnimation(winningSet);
            return true;
            
        }
        return false;
    }

    const restartGame = () => {
        cellHandler.resetCellArray();
        displayController.resetDisplay();
    }

    return { init };

})();

Game.init();