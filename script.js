function createPlayer() {
    let name = "";
    let symbol = "";
    
    const setPlayer = (newName, newSymbol) => {
        name = newName
        symbol = newSymbol
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
    const board = [];

    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            row.push(createCell());
        }
        board.push(row);
    }

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

function restartGame() {
    document.querySelectorAll(".played").forEach(played => {
        played.remove();
    })
}

function playerModal(startGame) {
    document.getElementById("dialog").showModal();

    document.querySelectorAll('input[name="symbol1"]').forEach(radio => {
        radio.addEventListener("change", () => {
            const player1Symbol = document.querySelector('input[name="symbol1"]:checked').value;
            const oppositeSymbol = player1Symbol === 'x' ? 'o' : 'x';
            document.querySelector(`input[name="symbol2"][value="${oppositeSymbol}"]`).checked = true;
        });
    });

    document.querySelectorAll('input[name="symbol2"]').forEach(radio => {
        radio.addEventListener("change", () => {
            const player2Symbol = document.querySelector('input[name="symbol2"]:checked').value;
            const oppositeSymbol = player2Symbol === 'x' ? 'o' : 'x';
            document.querySelector(`input[name="symbol1"][value="${oppositeSymbol}"]`).checked = true;
        });
    });


    document.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault();

        const usernamePlayer1 = document.getElementById("username1").value;
        const player1Symbol = document.querySelector('input[name="symbol1"]:checked').value;

        const usernamePlayer2 = document.getElementById("username2").value;
        const player2Symbol = document.querySelector('input[name="symbol2"]:checked').value;

        console.log(usernamePlayer1, player1Symbol, usernamePlayer2, player2Symbol);

        document.getElementById("player1").textContent = usernamePlayer1 + " : " + player1Symbol;
        document.getElementById("player2").textContent = usernamePlayer2 + " : " + player2Symbol;    

        dialog.close();

        startGame({usernamePlayer1, player1Symbol, usernamePlayer2, player2Symbol});
    });
}

const startGame = function ({usernamePlayer1, player1Symbol, usernamePlayer2, player2Symbol}) {    
    const board = gameController();
    let round = 0;

    const player1 = createPlayer()
    const player2 = createPlayer()

    player1.setPlayer(usernamePlayer1, player1Symbol);
    player2.setPlayer(usernamePlayer2, player2Symbol);

    console.log(player1.getName(), " Symbol: ", player1.getSymbol());
    console.log(player2.getName(), " Symbol: ", player2.getSymbol());


    let playerControl = player1;

    document.querySelector(".turn").textContent = playerControl.getName();

    const stringPlayerControl = playerControl === player1 ? "player1" : "player2";
    document.getElementById(stringPlayerControl).classList.add("player-selected");

    document.querySelectorAll(".cell").forEach(cell => {
        cell.addEventListener("click", () => {
            const [, choiceRow, choiceCol] = cell.id.split("-");
    
            if (board.checkSetValue(choiceRow, choiceCol, playerControl) !== false) {
                board.checkSetValue(choiceRow, choiceCol, playerControl);
                const img = document.createElement("img")
                img.setAttribute("src", "imgs/" + playerControl.getSymbol() + ".png")
                img.classList.add("played");
                cell.appendChild(img);
                round++
    
                if (board.checkWin()) {
                    alert(`${playerControl.getName()} Wins`);
                    restartGame();
                    playerModal(startGame);
                    board.printBoard();
                }
                else if (round == 9) {
                    alert("Nobody won")
                    restartGame();
                    playerModal(startGame);
                }
    
                playerControl = (playerControl === player1) ? player2 : player1;
            }
            else {
                alert("Cell Already Taken");
            }
        });
    });
} 

playerModal(startGame);