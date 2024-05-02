const AXES = {
    row_top         : "top left, top center, top right",
    row_middle      : "middle left, middle center, middle right",
    row_bottom      : "bottom left, bottom center, bottom right",

    column_left     : "top left, middle left, bottom left",
    column_center   : "top center, middle center, bottom center",
    column_right    : "top right, middle right, bottom right",

    diagonal_left   : "top left, middle center, bottom right",
    diagonal_right  : "top right, middle center, bottom left"
};

function createBoard() {
    const board = {
        "top" : createRow(),
        "middle" : createRow(),
        "bottom" : createRow()
    }

    const placeMarker = (rowKey, columnKey, marker) => {
        if (!getMarker(rowKey, columnKey)) {
            board[rowKey][columnKey].setMarker(marker);
            return true;
        } else return false;
    };

    const getMarker = (rowKey, columnKey) => board[rowKey][columnKey].getMarker();

    const checkRow = (rowKey) => {
        switch (rowKey) {
            case "top" :
                if (compareCells(AXES.row_top)) {
                    return AXES.row_top;
                };
            break;
            case "middle" :
                if (compareCells(AXES.row_middle)) {
                    return AXES.row_middle;
                };
            break;
            case "bottom" :
                if (compareCells(AXES.row_bottom)) {
                    return AXES.row_bottom;
                };
            break;
        }
    };

    const checkColumn = (columnKey) => {
        switch (columnKey) {
            case "left" :
                if (compareCells(AXES.column_left)) {
                    return AXES.column_left;
                };
            break;
            case "center" :
                if (compareCells(AXES.column_center)) {
                    return AXES.column_center;
                };
            break;
            case "right" :
                if (compareCells(AXES.column_right)) {
                    return AXES.column_right;
                };
            break;
        }
    };

    const checkDiagonal = (rowKey, columnKey) => {
        if ((rowKey + columnKey) ===
            "topleft" ||
            "middlecenter" ||
            "bottomright") {
                if (compareCells(AXES.diagonal_left)) {
                    return AXES.diagonal_left;
                };
        } else if ((rowKey + columnKey) ===
            "topright" ||
            "middlecenter" ||
            "bottomleft") {
                if (compareCells(AXES.diagonal_right)) {
                    return AXES.diagonal_right;
                };
        }
    };

    function compareCells(axis) {
        const cells = axis.split(", ");
        const firstCell = cells[0].split(" ");
        const secondCell = cells[1].split(" ");
        const thirdCell = cells[2].split(" ");


        return ((getMarker(firstCell[0], firstCell[1])
                ===
                getMarker(secondCell[0], secondCell[1]))
                &&
                (getMarker(firstCell[0], firstCell[1])
                ===
                getMarker(thirdCell[0], thirdCell[1])));

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

    return {placeMarker, getMarker, checkRow, checkColumn, checkDiagonal};
}

function createPlayer(name = "", marker = "") {
    const setName = (_name) => {
        name = _name
    };
    const getName = () => name;

    const setMarker = (_marker) => {
        marker = _marker
    };
    const getMarker = () => marker;

    return {setMarker, getMarker, setName, getName};
}

const game = (function () {
    const board = createBoard();
    const players = [createPlayer("Player 1","X"), createPlayer("Player 2","O")];
    let activePlayer = players[coinFlip()];
    let rounds = 0;

    const lastMove = {row : 0, column: 0};

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        if (board.placeMarker(row, column, getActivePlayer().getMarker())) {
            rounds++;
            lastMove.row = row;
            lastMove.column = column;
            return true;
        } else return false;
    };

    const checkWin = () => {
        if (rounds === 9) {
            return {outcome: "draw"};
        }
        let win  = board.checkRow(lastMove.row);
        if (!win) win = board.checkColumn(lastMove.column);
        if (!win) win = board.checkDiagonal(lastMove.row, lastMove.column);
        if (!win) return false;
        else return {outcome: "win", lastMove, win};
    }

    function coinFlip() {
        return Math.floor(Math.random() * 2);
    }

    return {switchPlayerTurn, getActivePlayer, playRound, checkWin};
})();

const display = (function () {
    const grid = document.querySelector(".grid");
    const text = document.querySelector(".player");
    let win;
    grid.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            let row = e.target.parentElement.className;
            let column = e.target.className;
            const player = game.getActivePlayer();
            text.textContent = `Current Player: ${player.getName()} Marker: ${player.getMarker()}`;
            if(game.playRound(row, column)) {
                e.target.textContent = player.getMarker();

                win = game.checkWin();
                if (win.outcome) {
                    if (win.outcome === "win") {
                        text.textContent = `${player.getName()} wins!`
                        return;
                    } else {
                        text.textContent = "It's a draw!"
                    }
                }
            }
            game.switchPlayerTurn();
        }
    });
})();