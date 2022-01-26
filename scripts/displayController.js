"use strict";

const DisplayController = ((Document, AssetCreator) => {
    /* -------------------- */
    /*   PRIVATE VARIABLES  */
    /* -------------------- */

    const doc = Document;
    const assetCreator = AssetCreator;
    const elements = {
        boardBtns: [],
        boardElement: doc.querySelector(".board"),
        playAgainBtn: doc.querySelector(".play-again"),
        body: doc.querySelector("body"),
        scores: {
            xScore: doc.getElementById("x-score"),
            oScore: doc.getElementById("o-score"),
        }
    }

    /* -------------------- */
    /*   PUBLIC VARIABLES   */
    /* -------------------- */
    
    const animationDuration = parseInt(getComputedStyle(doc.documentElement).getPropertyValue('--total-anim-duration')) * 1000;

    /* -------------------- */
    /*   PRIVATE FUNCTIONS  */
    /* -------------------- */
    
    const bindUIElements = (takeTurnFunc) => {
        // use event propegation for putting symbols on cells
        elements.boardElement.addEventListener("click", takeTurnFunc);
    }

    /* -------------------- */
    /*   PUBLIC FUNCTIONS   */
    /* -------------------- */
    //#region 

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

        elements.scores.xScore.textContent = 0;
        elements.scores.oScore.textContent = 0;
    }

    /**
     * 
     * @param {Number} idx - The index of the cell to draw the svg on
     * @param {Number} currentPlayer - X = 1, O = -1
     */
    const renderSymbol = (idx, currentPlayer) => {
        let symbol = (currentPlayer == 1) ? assetCreator.createXSymbol() : assetCreator.createOSymbol();
        elements.boardBtns[idx].appendChild(symbol);
    }

    /**
     * Place current "hover symbol" as background image of btn, then change "hover symbol" to match the next player's symbol
     * @param {Number} idx - the index of the cell to set the background of
     * @param {Number} currentPlayer - X = 1, O = -1
     */
    const switchAssets = (idx, currentPlayer) => {
        // 
        if (currentPlayer === 1) {
            elements.boardBtns[idx].style.backgroundImage = "url('../assets/x-symbol.svg')";
            doc.body.style.setProperty("--current-symbol", "url('../assets/o-symbol.svg')");
        }
        else {
            elements.boardBtns[idx].style.backgroundImage = "url('../assets/o-symbol.svg')";
            doc.body.style.setProperty("--current-symbol", "url('../assets/x-symbol.svg')");
        }

        // remove background image after animations
        new Promise(resolve => {
            setTimeout(resolve, (animationDuration));
        }).then(() => {
            elements.boardBtns[idx].style.removeProperty("background-image");
        });
    }

    /**
     * Disables one button on the board
     * @param {Number} idx - index of the button to disable
     */
    const disableBtn = (idx) => {
        elements.boardBtns[idx].disabled = true;
    }

    /**
     * Disables all buttons on the board
     */
    const disableBtns = () => {
        for (let btn of elements.boardBtns) btn.disabled = true;
    }

    /**
     * Enables all buttons on the board and removes all animations as well as the svg line (if there was a winner)
     */
    const resetBoard = () => {
        for (let btn of elements.boardBtns) {
            btn.textContent = "";
            btn.disabled = false;

            // remove animations
            btn.classList.remove("shrink");
            btn.classList.remove("fade-out");
        }

        let line = doc.querySelector(".board__line");
        if (line) line.remove();
    }

    /**
     * 
     * @param {Array} scores - Contains the current match scores
     */
    const updateMatchScores = (scores) => {
        elements.scores.xScore.textContent = scores[0];
        elements.scores.oScore.textContent = scores[1];
    }

    /**
     * 
     * @param {Object} finalMove - Contains an array of the 3 symbols involved in a winning move and the direction/position of the winning move
     * @param {Number} winner - X = 1, O = -1
     */
    const applyLineAnimation = (finalMove, winner) => {
        let line = assetCreator.createLine(winner, finalMove.direction, finalMove.position);
        line.classList.add("fade-out");
        elements.boardElement.appendChild(line);
    }

    /**
     * If the final move resulted in a win, then apply a shrink animation to all symbols except those 3.
     * Otherwise, apply the animation to all symbols.
     * @param {Object} finalMove  - An object which holds the array of the 3 symbols involved in a winning move (or [-1, -1, -1])
     */
    const applyShrinkAnimation = (finalMove) => {
        elements.boardBtns.forEach((btn, i) => {
            if (btn.children[0]) {
                let symbol = btn.children[0];
                if (!finalMove.set.includes(i)) symbol.classList.add("shrink");
                symbol.classList.add("fade-out");
            }
        })
    }
    
    //#endregion
    return { init, renderSymbol, switchAssets, resetBoard, updateMatchScores, applyLineAnimation, applyShrinkAnimation, animationDuration, disableBtns, disableBtn };
})(document, AssetCreator);