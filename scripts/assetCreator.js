"use strict";
const AssetCreator = (() => {
    const settings = {
        x: {
            shapePieces: 2,
            shapeLength: 75,
            delayMultipliers: {
                pieceOne: 0,
                pieceTwo: 1
            },
            color: "#EA526E"
        },
        o: {
            shapePieces: 1,
            shapeLength: 167,
            delayMultipliers: {
                pieceOne: 0
            },
            color: "#3AA6F1"
        },
        line: {
            shapePieces: 1,
            shapeLength: 500,
            delayMultipliers: {
                pieceOne: 1
            },
            color: undefined
        }
    };

    const createXSymbol = () => {
        let xSymbol = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let mainDiag = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        let antiDiag = document.createElementNS("http://www.w3.org/2000/svg", 'line');

        xSymbol.setAttribute("viewBox", "0 0 73 73");
        xSymbol.setAttribute("fill", "none");
        xSymbol.style.setProperty("--shape-pieces", settings.x.shapePieces);

        mainDiag.setAttribute("x1", "10");
        mainDiag.setAttribute("y1", "10");
        mainDiag.setAttribute("x2", "62.8579");
        mainDiag.setAttribute("y2", "62.8579");
        mainDiag.setAttribute("stroke", settings.x.color);
        mainDiag.setAttribute("stroke-width", "20");
        mainDiag.setAttribute("stroke-linecap", "round");
        mainDiag.style.setProperty("--delay-multiplier", settings.x.delayMultipliers.pieceOne);
        mainDiag.style.setProperty("--shape-length", settings.x.shapeLength);

        antiDiag.setAttribute("x1", "10");
        antiDiag.setAttribute("y1", "62.8579");
        antiDiag.setAttribute("x2", "62.8579");
        antiDiag.setAttribute("y2", "10");
        antiDiag.setAttribute("stroke", settings.x.color);
        antiDiag.setAttribute("stroke-width", "20");
        antiDiag.setAttribute("stroke-linecap", "round");
        antiDiag.style.setProperty("--delay-multiplier", settings.x.delayMultipliers.pieceTwo);
        antiDiag.style.setProperty("--shape-length", settings.x.shapeLength);

        xSymbol.appendChild(mainDiag);
        xSymbol.appendChild(antiDiag);

        xSymbol.classList.add("board__symbol");
        mainDiag.classList.add("draw");
        antiDiag.classList.add("draw");

        return xSymbol;
    }

    const createOSymbol = () => {
        let oSymbol = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        oSymbol.setAttribute("viewBox", "0 0 73 73");
        oSymbol.setAttribute("fill", "none");
        oSymbol.style.setProperty("--shape-pieces", settings.o.shapePieces);

        path.setAttribute("d", "M36.5 10C21.8645 10 10 21.8644 10 36.5C10 51.1355 21.8645 63 36.5 63C51.1355 63 63 51.1355 63 36.5C63 21.8644 51.1355 10 36.5 10Z");
        path.setAttribute("stroke", settings.o.color);
        path.setAttribute("stroke-width", "20");
        path.setAttribute("stroke-linecap", "round");
        path.style.setProperty("--delay-multiplier", settings.o.delayMultipliers.pieceOne);
        path.style.setProperty("--shape-length", settings.o.shapeLength);

        oSymbol.appendChild(path);

        oSymbol.classList.add("board__symbol");
        path.classList.add("draw");

        return oSymbol;
    }

    const createLine = (winner, direction, position) => {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        
        svg.setAttribute("fill", "none");
        svg.setAttribute("viewBox", "0 0 500 500");
        svg.style.setProperty("--shape-pieces", "1");
        svg.style.setProperty("--position-multiplier", position);
        svg.classList.add(`board__line--${direction}`);

        switch (direction) {
            case "row":
                line.setAttribute("x1", "15");
                line.setAttribute("y1", "15");
                line.setAttribute("x2", "485");
                line.setAttribute("y2", "15");
                line.style.setProperty("--shape-length", settings.line.shapeLength);
                break;
            case "col":
                line.setAttribute("x1", "15");
                line.setAttribute("y1", "15");
                line.setAttribute("x2", "15");
                line.setAttribute("y2", "485");
                line.style.setProperty("--shape-length", settings.line.shapeLength);
                break;
            case "diag":
                line.setAttribute("x1", "15");
                line.setAttribute("y1", "15");
                line.setAttribute("x2", "485");
                line.setAttribute("y2", "485");
                line.style.setProperty("--shape-length", settings.line.shapeLength * 1.33);
                break;
        }

        line.setAttribute("stroke-width", "30");
        line.setAttribute("stroke-linecap", "round");
        line.style.setProperty("--delay-multiplier", settings.line.delayMultipliers.pieceOne);

        (winner == 1) ? line.setAttribute("stroke", settings.x.color) : line.setAttribute("stroke", settings.o.color);

        svg.appendChild(line);

        svg.classList.add("board__line");
        line.classList.add("draw");

        return svg;
    }

    return ({ createXSymbol, createOSymbol, createLine });
})();