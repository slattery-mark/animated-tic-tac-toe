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
            shapeLength: 480,
            delayMultipliers: {
                pieceOne: 0
            },
            color: undefined
        }
    };

    const createXSymbol = () => {
        let xSymbol = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let mainDiag = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        let antiDiag = document.createElementNS("http://www.w3.org/2000/svg", 'line');

        xSymbol.setAttribute("viewBox", "0 0 81 77");
        xSymbol.setAttribute("fill", "none");
        xSymbol.style.setProperty("--shape-pieces", settings.x.shapePieces);

        mainDiag.setAttribute("x1", "14.1421");
        mainDiag.setAttribute("y1", "10");
        mainDiag.setAttribute("x2", "67");
        mainDiag.setAttribute("y2", "62.8579");
        mainDiag.setAttribute("stroke", settings.x.color);
        mainDiag.setAttribute("stroke-width", "20");
        mainDiag.setAttribute("stroke-linecap", "round");
        mainDiag.style.setProperty("--delay-multiplier", settings.x.delayMultipliers.pieceOne);
        mainDiag.style.setProperty("--shape-length", settings.x.shapeLength);

        antiDiag.setAttribute("x1", "14");
        antiDiag.setAttribute("y1", "62.8579");
        antiDiag.setAttribute("x2", "66.8579");
        antiDiag.setAttribute("y2", "10.0001");
        antiDiag.setAttribute("stroke", settings.x.color);
        antiDiag.setAttribute("stroke-width", "20");
        antiDiag.setAttribute("stroke-linecap", "round");
        antiDiag.style.setProperty("--delay-multiplier", settings.x.delayMultipliers.pieceTwo);
        antiDiag.style.setProperty("--shape-length", settings.x.shapeLength);

        xSymbol.appendChild(mainDiag);
        xSymbol.appendChild(antiDiag);

        xSymbol.classList.add("board__symbol");
        mainDiag.classList.add("drawn");
        antiDiag.classList.add("drawn");

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
        path.classList.add("drawn");

        return oSymbol;
    }

    const createLine = (winner, position) => {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');

        svg.setAttribute("viewBox", "0 0 500 20");
        svg.setAttribute("fill", "none");
        svg.style.setProperty("--shape-pieces", "1");

        line.setAttribute("x1", "10");
        line.setAttribute("y1", "10");
        line.setAttribute("x2", "490");
        line.setAttribute("y2", "10");
        line.setAttribute("stroke-width", "20");
        line.setAttribute("stroke-linecap", "round");
        line.style.setProperty("--delay-multiplier", settings.line.delayMultipliers.pieceOne);
        line.style.setProperty("--shape-length", settings.line.shapeLength);
        line.style.setProperty("--position-multiplier", position);

        (winner == "x") ? line.setAttribute("stroke", settings.x.color) : line.setAttribute("stroke", settings.o.color);

        svg.appendChild(line);

        svg.classList.add("board__line");
        line.classList.add("drawn");

        return svg;
    }

    return ({ createXSymbol, createOSymbol, createLine });
})();