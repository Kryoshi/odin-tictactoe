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
        const key = rowKey + columnKey;
        if (key === "topleft" ||
            key === "middlecenter" ||
            key === "bottomright") {
                if (compareCells(AXES.diagonal_left)) {
                    return AXES.diagonal_left;
                };
        } else if (key === "topright" ||
            key === "middlecenter" ||
            key === "bottomleft") {
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

const gameController = (function () {
    let board;
    let players;
    let activePlayer;
    let rounds = 0;
    let gameOver = false;
    let winningAxis;
    const lastMove = {row: null, column: null};

    const resetGame = (playerOne, playerTwo) => {
        gameOver = false;
        board = createBoard();
        players = [createPlayer(playerOne,"X"), createPlayer(playerTwo,"O")];
        activePlayer = players[coinFlip()];
        rounds = 0;
        lastMove.row = null;
        lastMove.column = null;
    };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        if (!gameOver) {
            if (board.placeMarker(row, column, getActivePlayer().getMarker())) {
                rounds++;
                lastMove.row = row;
                lastMove.column = column;
                return true;
            } else return false;
        }
    };

    const checkWin = () => {
        if (rounds === 9) {
            gameOver = true;
            return {outcome: "draw"};
        }
        let win  = board.checkRow(lastMove.row); 
        if (!win) win = board.checkColumn(lastMove.column);
        if (!win) win = board.checkDiagonal(lastMove.row, lastMove.column);
        if (!win) return false;
        else {
            gameOver = true;
            winningAxis = win;
            return {outcome: "win"};
        }
    }

    function coinFlip() {
        return Math.floor(Math.random() * 2);
    }

    return {resetGame, switchPlayerTurn, getActivePlayer, playRound, checkWin};
})();

const gameInterface = (function () {    

    const newGame = (playerOne, playerTwo) => {
        gameController.resetGame(playerOne, playerTwo);
        displayController.removeGrid();
        displayController.createGrid();
        displayController.displayTurn(gameController.getActivePlayer().getName());
    }

    const movePlayed = (element) => {
        if (element.tagName === "BUTTON") {
            let row = element.parentElement.className;
            let column = element.className;
            player = gameController.getActivePlayer();
            if(gameController.playRound(row, column)) {
                displayController.displayMove(element, player.getMarker());
                win = gameController.checkWin();
                if (win.outcome) {
                    if (win.outcome === "win") {
                        displayController.displayWin(player.getName())
                    } else if (win.outcome === "draw"){
                        displayController.displayDraw();
                    }
                    return;
                }
                gameController.switchPlayerTurn();
                displayController.displayTurn(player.getName());
            }
        }
    }
    return {newGame, movePlayed};
})();

const displayController = (function () {
    const content = document.querySelector('#content');
    const display = document.querySelector('#display');
    const newGame = document.querySelector('#newgame');
    const players = document.querySelectorAll('input');

    newGame.addEventListener('submit', (e) => {
        e.preventDefault();
        for (const player of players) {
            player.disabled = true;
        }
        const playerOne = players[0].value;
        const playerTwo = players[1].value;
        gameInterface.newGame(playerOne, playerTwo);
    });

    const displayMove = (cell, marker) => {
        cell.textContent = marker;
    };

    const displayTurn = (player) => {
        display.textContent = `${player}'s turn!`;
    };

    const displayDraw = () => {
        display.textContent = "It's a draw!"
    }

    const displayWin = (player) => {
        display.textContent = `${player} wins!`
    };


    const createGrid = () => {
        const grid = document.createElement('div');
        grid.setAttribute('id', 'grid');

        const topRow = createGridRow();
        const middleRow = createGridRow();
        const bottomRow = createGridRow();

        topRow.className = "top";    
        middleRow.className = "middle";    
        bottomRow.className = "bottom";    


        grid.append(topRow, middleRow, bottomRow);
        content.appendChild(grid);

        grid.addEventListener("click", (e) => {
            gameInterface.movePlayed(e.target);
        });
    };

    const createGridRow = () => {
        const row = document.createElement('div');

        const leftCell = document.createElement('button');
        const centerCell = document.createElement('button');
        const rightCell = document.createElement('button');

        leftCell.className = "left";
        centerCell.className = "center";
        rightCell.className = "right";

        row.append(leftCell, centerCell, rightCell);

        return row;
    };

    const removeGrid = () => {
        let child = content.lastElementChild;
        while (child) {
            content.removeChild(child);
            child = content.lastElementChild;
        }
    };

    return {createGrid, removeGrid, displayMove, displayTurn, displayDraw, displayWin};
})();