const board = ["", "", "", "", "", "", "", "", ""];
const human = "X";
const ai = "O";
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");

function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        // console.log(pattern)
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes("") ? null : "T";
}

function minimax(newBoard, player) {
    let availableSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    let winner = checkWinner(board);
    if (winner === human) return { score: -10 };
    if (winner === ai) return { score: 10 };
    if (winner === "T") return { score: 0 };

    let moves = [];
    for (let i of availableSpots) {
        let move = {};
        move.index = i;
        newBoard[i] = player;

        let result;
        if (player === ai) {
            result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            result = minimax(newBoard, ai);
            move.score = result.score;
        }
        newBoard[i] = "";
        moves.push(move);

        let bestMove = 0;
        if (player === ai) {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].sccore > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }
}

function bestMove() {
    let move = minimax(board, ai);
    board[move.index] = ai;
    updateBoard()
}

function makeMove(index) {
    if (board[index] === "") {
        board[index] = human;
        updateBoard();
        let winner = checkWinner(board);
        if (!winner) bestMove();
        updateBoard()
    }
}

function updateBoard() {
    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
        let cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        if (cell !== "") cellElement.classList.add("taken");
        cellElement.textContent = cell;
        cellElement.onclick = () => makeMove(index);
        boardElement.appendChild(cellElement);
    });
    let winner = checkWinner(board);
    if (winner) {
        statusElement.textContent = winner === "T" ? "It's a Tie!" : `${winner} Wins!`;
    }
}

function resetGame() {
    board.fill("");
    statusElement.textContent = "";
    updateBoard();
}

updateBoard();