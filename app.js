let board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];
let O = "O";
let X = "X";
let currentPlayer = X;
let mode = "human";

let resultat = document.getElementById("resultat");

function startGame(selectedMode) {
    mode = selectedMode;
    document.getElementById("mode").textContent = mode === "human" ? "Mode : Player 1 Vs Player 2" : "Mode : Player Vs AI";
    board = board.map(row => row.map(() => null));
    document.querySelectorAll(".cell").forEach(cell => (cell.textContent = ""));
    currentPlayer = X;
    resultat.textContent = "Who will win ?";
}

function makeMove(row, col) {
    if (board[row][col] || winner(board)) return;
    currentPlayer = player(board);
    board[row][col] = currentPlayer;
    document.querySelectorAll(".cell")[row * 3 + col].textContent = currentPlayer;

    if (winner(board)) {
        if (mode === "human") resultat.textContent = `${currentPlayer} wins !`;
        else resultat.textContent = currentPlayer === O ? "AI wins !" : "Player wins";
    } else if (terminal(board)) {
        resultat.textContent = "Tie !";
    } else {
        currentPlayer = player(board);
        // console.log(currentPlayer);
        if (mode === "ai" && currentPlayer === O) {
            const m = minimax(board, O);
            // console.log(m)
            makeMove(m[0], m[1]);
        }
    }
}

function player(board) {
    let xCount = 0;
    let oCount = 0;

    for (let row of board) {
        xCount += row.filter(cell => cell === X).length;
        oCount += row.filter(cell => cell === O).length;
    }

    return xCount > oCount ? O : X;
}

function actions(board) {
    const actions = [];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === null) {
                actions.push([i, j]);
            }
        }
    }

    return actions;
}

function result(board, action) {
    const [i, j] = action;

    if (![0, 1, 2].includes(i) || ![0, 1, 2].includes(j)) {
        throw new Error("Action not valid");
    }
    if (board[i][j] !== null) {
        throw new Error("Action not valid");
    }

    // Copie profonde du plateau
    const copyBoard = board.map(row => row.slice());
    copyBoard[i][j] = player(copyBoard);

    return copyBoard;
}

function winner(board) {
    // Vérifie les lignes
    for (let row of board) {
        if (row.filter(cell => cell === X).length === 3) {
            return X;
        } else if (row.filter(cell => cell === O).length === 3) {
            return O;
        }
    }

    // Vérifie les colonnes
    for (let i = 0; i < 3; i++) {
        const col = [board[0][i], board[1][i], board[2][i]];
        if (col.filter(cell => cell === X).length === 3) {
            return X;
        } else if (col.filter(cell => cell === O).length === 3) {
            return O;
        }
    }

    // Vérifie les diagonales
    const diag1 = [board[0][0], board[1][1], board[2][2]];
    const diag2 = [board[0][2], board[1][1], board[2][0]];

    for (let diag of [diag1, diag2]) {
        if (diag.filter(cell => cell === X).length === 3) {
            return X;
        } else if (diag.filter(cell => cell === O).length === 3) {
            return O;
        }
    }

    // Aucun gagnant
    return null;
}

function terminal(board) {
    // Vérifie si le jeu est terminé
    return winner(board) !== null || actions(board).length === 0;
}

function utility(board) {
    const win = winner(board);
    if (win === X) {
        return 1;
    } else if (win === O) {
        return -1;
    } else {
        return 0;
    }
}

function isBoardFull() {
  return board.flat().every(cell => cell !== null);
}

function minimax(board) {
    function maxPlayer(board, bestMin = 10) {
        if (terminal(board)) {
            return { score: utility(board), move: null };
        }

        let bestAction = null;
        let v = -10;

        const actionSet = actions(board);
        for (let i = 0; i < actionSet.length; i++) {
            const action = actionSet[i];

            if (bestMin <= v) break;

            const minPlayerResult = minPlayer(result(board, action), v);
            if (minPlayerResult.score > v) {
                bestAction = action;
                v = minPlayerResult.score;
            }
        }

        return { score: v, move: bestAction };
    }

    function minPlayer(board, bestMax = -10) {
        if (terminal(board)) {
            return { score: utility(board), move: null };
        }

        let bestAction = null;
        let v = 10;

        const actionSet = actions(board);
        for (let i = 0; i < actionSet.length; i++) {
            const action = actionSet[i];

            if (bestMax >= v) break;

            const maxPlayerResult = maxPlayer(result(board, action), v);
            if (maxPlayerResult.score < v) {
                bestAction = action;
                v = maxPlayerResult.score;
            }
        }

        return { score: v, move: bestAction };
    }

    if (terminal(board)) {
        return null;
    }

    const currentPlayer = player(board);
    if (currentPlayer === X) {
        return maxPlayer(board).move;
    } else {
        return minPlayer(board).move;
    }
}

  