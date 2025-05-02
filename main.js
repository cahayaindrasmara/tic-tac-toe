// Variabel awal
const board = ["", "", "", "", "", "", "", "", ""]; //array 1D dengan 9 elemen merepresentasikan papan permainan 3x3
const human = "X"; //simbol pemain manusia X
const ai = "O"; // simbol ai O
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
//boardElement dan statusElement referensi ke elemen HTML untuk papan dan status game

function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], //baris
        [0, 3, 6], [1, 4, 7], [2, 5, 8], //kolom
        [0, 4, 8], [2, 4, 6] //diagonal
    ];

    for (let pattern of winPatterns) {
        // console.log(pattern)
        // [0, 1, 2]
        // [3, 4, 5]
        // [6, 7, 8]
        // [0, 3, 6]
        // [1, 4, 7]
        // [2, 5, 8]
        // [0, 4, 8]
        // [2, 4, 6]

        const [a, b, c] = pattern; //mengambil tiga nilai dari array pattern dan mengaksees tiga indeks dalam array board dengan cara yang rapi tanpa pattern[0], pattern[1], pattern[2]

        if (board[a] && board[a] === board[b] && board[a] === board[c]) { // board[a] ini memastikan sel tidak kosong, jika board[a] ="" (kosong), maka kondisi langsung false dan tidak perlu lanjut cek, tanpa board[a] "" === "" && "" === "" dianggap true, padahal belum ada pemain yang menaruh simbol disana.
            return board[a];
        }
    }
    return board.includes("") ? null : "T";
}

function minimax(newBoard, player) {
    let availableSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null); //ini akan membuat array baru dengan mengganti: 1. jika nilai v (nilai sel di papan) adalah "" (kosong), kembalikan indexnya, 2.jika tidak kosong kembalikan null
    /*
    contoh:
    1. newBoard.map((v, i) => v === "" ? i : null)
    ["X", "", "O", "", "X", "", "", "", ""]
    hasil map:
    ["null", "1", "null", "3", "null", "5", "6", "7", "8"]

    2. newBoard.filter(v => v !== null), menghapus semua null, jadi hanya menyisakan indeks kosong
    ["1", "3", "5", "6", "7", "8"]
    */

    let winner = checkWinner(newBoard);
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
    }

    let bestMove = 0;
    if (player === ai) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
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

function bestMove() {
    let move = minimax(board, ai); //ai memilih langkah terbaik menggunakan algoritma minimax
    board[move.index] = ai; //ai menaruh posisi O di tempat terbaik
    updateBoard() //update tampilan papan
}

function makeMove(index) {
    if (board[index] === "") { //cek apakah kotak masih kosong
        board[index] = human; //isi kotak dengan simbol pemain "X"
        updateBoard(); //tampilkan langkah pemain
        let winner = checkWinner(board); //cek apakah sudah ada pemenang
        if (!winner) bestMove(); // jika belum ada pemenang, giliran ai
        updateBoard() //tampilkan papan setelah giliran ai
    }
}

function updateBoard() {
    boardElement.innerHTML = ""; //menghapus semua isi html dalam elemen board (<div id="board"></div>) agar bisa digambar ulang dari awal
    board.forEach((cell, index) => { // untuk setiap elemen di board, buat elemen (<div></div>) baru, tambahkan class cell untuk styling
        let cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        if (cell !== "") cellElement.classList.add("taken"); //jika cell sudah terisi oleh pemain (X atau O) tambahkan class taken, ini  biasanya untuk nonaktifkan klik atau menambahkan warna berbeda pada sel yang sudah terisi
        cellElement.textContent = cell; //isi konten sel html dengan simbol yang ada di board[index] yaitu X,O atau "" (kosong)
        cellElement.onclick = () => makeMove(index); //saat sel diklik jalankan function makeMove()
        boardElement.appendChild(cellElement); //masukkan sel yang sudah dibuat kedalam elemen papan (boardElement) sehingga tampil dilayar
    });
    let winner = checkWinner(board); //cek pemenang dengan memanggil function checkWinner()
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