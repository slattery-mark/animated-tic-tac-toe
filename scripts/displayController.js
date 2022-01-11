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