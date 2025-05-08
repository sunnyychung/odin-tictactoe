function createPlayer() {
    let name = "";
    let symbol = "";
    
    const setPlayer = () => {
        name = prompt("What is your name?");
        symbol = prompt("What is the symbol you want?");
    }

    const getSymbol = () => symbol

    const getName = () => name

    return {name, symbol, getSymbol, getName, setPlayer}
}

function createCell() {
    let value = "";

    const getValue = () => value;

    const setValue = function(symbol) {
        value = symbol;
    }

    return {getValue, setValue} ;
}

function gameController() {
    const board = [[], [], []]

    // Builds board, putting 3 cell objects into the 3 rows
    board.forEach((row) => {
        for (let i = 0; i < 3; i++) {
            row.push(createCell());
        }
    });

    const checkSetValue = (row, col, player) => {
        // If Value of Cell is empty set, else don't.
        if (board[row][col].getValue() == "") {
            board[row][col].setValue(player.getSymbol());
        }
        else {
            return false;
        }
    }

    const checkWin = () => {
        for (let i = 0; i < board.length; i++){
            // Checking rows
            if (board[i][0].getValue() !== "" && board[i][0].getValue() === board[i][1].getValue() && board[i][1].getValue() === board[i][2].getValue()) {
                return true
            }

            // Checking columns
            if (board[0][i].getValue() !== "" && board[0][i].getValue() == board[1][i].getValue() && board[1][i].getValue() === board[2][i].getValue()) {
                return true
            }
        }

        // Checking left to right diagonal 
        if (board[0][0].getValue() !== "" && board[0][0].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[2][2].getValue()) {
            return true
        }

        // Checking right to left diagonal 
        if (board[0][2].getValue() !== "" && board[0][2].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[2][0].getValue()) {
            return true
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        // For each row
        const boardPrint = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardPrint);
    }

    return {checkSetValue, checkWin, printBoard, getBoard}
}

const game = (function () {
    const board = gameController();
    let round = 0;

    const player1 = createPlayer()
    const player2 = createPlayer()
    player1.setPlayer();
    player2.setPlayer();

    let playerControl = player1;

    board.printBoard();

    while (round < 9) {
        let choiceRow = prompt(playerControl.getName() + ". What row? \n \nType 'exit' to quit")
        let choiceCol = prompt(playerControl.getName() + ". What column? \n \nType 'exit' to quit")

        if (choiceRow == "exit" || choiceCol == "exit") {
            break;
        }

        if (board.checkSetValue(choiceRow, choiceCol, playerControl) != false) {
            board.checkSetValue(choiceRow, choiceCol, playerControl);
            round++

            if (board.checkWin()) {
                console.log(`${playerControl.getName()} Wins`);
                board.printBoard();
                break;
            }

            playerControl = (playerControl === player1) ? player2 : player1;
        }
        else {
            console.log("Cell Already Taken");
        }

        board.printBoard();
    }
    

})();