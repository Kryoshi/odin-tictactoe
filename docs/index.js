function createBoard() {
    const rows = 3;
    const columns = 3;
    const board = {
        "top" : createRow(),
        "middle" : createRow(),
        "bottom" : createRow()
    }

    const placeMarker = (rowKey, columnKey, marker) => {
        if (!getMarker(rowKey, columnKey)) {
            board[rowKey][columnKey].setMarker(marker);
        };
    };

    const getMarker = (rowKey, columnKey) => board[rowKey][columnKey].getMarker();

    const checkRow = (rowKey) => {
        switch (rowKey) {
            case "top" :
                if (compareCells("top", "left", "top", "center", "top", "right")) {

                };
            break;
            case "middle" :
                if (compareCells("middle", "left", "middle", "center", "middle", "right")) {

                };
            break;
            case "bottom" :
                if (compareCells("bottom", "left", "bottom", "center", "bottom", "right")) {

                };
            break;
        }
    };

    const checkColumn = (columnKey) => {
        switch (columnKey) {
            case "left" :
                if (compareCells("top", "left", "middle", "left", "bottom", "left")) {

                };
            break;
            case "center" :
                if (compareCells("top", "center", "middle", "center", "bottom", "center")) {

                };
            break;
            case "right" :
                if (compareCells("top", "right", "middle", "right", "bottom", "right")) {

                };
            break;
        }
    };

    const checkDiagonal = (rowKey, columnKey) => {
        if ((rowKey + columnKey) ===
            "topleft" ||
            "middlecenter" ||
            "bottomright") {
                if (compareCells("top", "left", "middle", "center", "bottom", "right")) {

                };
        } else if ((rowKey + columnKey) ===
            "topright" ||
            "middlecenter" ||
            "bottomleft") {
                if (compareCells("top", "right", "middle", "center", "bottom", "left")) {

                };
        }
    };

    function compareCells(firstCellRow, firstCellColumn,
                        secondCellRow, secondCellColumn,
                        thirdCellRow = false, thirdCellColumn = false) {

        if (thirdCellRow && thirdCellColumn) {
            return ((getMarker(firstCellRow, firstCellColumn)
                    ===
                    getMarker(secondCellRow, secondCellColumn))
                    &&
                    (getMarker(firstCellRow, firstCellColumn)
                    ===
                    getMarker(thirdCellRow, thirdCellColumn)));
        }
        else return (getMarker(firstCellRow, firstCellColumn)
                    ===
                    getMarker(secondCellRow, secondCellColumn));
    };

    function createRow() {
        return {
            "left" : createCell(),
            "center" : createCell(),
            "right" : createCell()
        };
    }
    
    function createCell() {
        let marker;
    
        const setMarker = (_marker) => {
            marker = _marker;
        };
    
        const getMarker = () => marker;
    
        return {setMarker, getMarker};
    }

    const print = () => console.log(`${board["top"]["left"].getMarker()} ${board["top"]["center"].getMarker()} ${board["top"]["left"].getMarker()}\n` +
                                    `${board["middle"]["left"].getMarker()} ${board["middle"]["center"].getMarker()} ${board["middle"]["right"].getMarker()}\n` +
                                    `${board["bottom"]["left"].getMarker()} ${board["bottom"]["center"].getMarker()} ${board["bottom"]["right"].getMarker()}`);

    return {placeMarker, getMarker, checkRow, checkColumn, checkDiagonal, print};
}

function createPlayer(marker = "") {
    const setMarker = (_marker) => {
        marker = _marker
    };
    const getMarker = () => marker;

    return {setMarker, getMarker};
}

const game = (function () {
    const board = createBoard();
    const players = [createPlayer("X"), createPlayer("O")];
    let activePlayer = players[coinFlip()];
    const lastMove = {row : 0, column: 0};

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        board.placeMarker(row, column, getActivePlayer().getMarker());
        board.print();
        lastMove.row = row;
        lastMove.column = column;
    };

    const checkWin = () => {
        let win  = board.checkRow(lastMove.row);
        if (!win) win = board.checkColumn(lastMove.column);
        if (!win) win = board.checkDiagonal(lastMove.row, lastMove.column);
        if (!win) return false;
        else return {activePlayer, win};
    }
})();

function coinFlip() {
    return Math.floor(Math.random() * 2);
}
