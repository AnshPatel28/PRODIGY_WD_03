let boxes = document.querySelectorAll(".box");
let turn = "X";
let isGameOver = false;
let mode = "multiplayer";

function setMode(selectedMode) {
    mode = selectedMode;
    document.querySelector(".play-again").click();  // Reset the game when mode is changed
    updateModeButtons();
}

function updateModeButtons() {
    const modeButtons = document.querySelectorAll(".mode");
    modeButtons.forEach(button => {
        if (button.textContent.toLowerCase().includes(mode)) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }
    });
}

boxes.forEach(box => {
    box.innerHTML = "";  // Clear each box
    box.addEventListener("click", () => {
        if (!isGameOver && box.innerHTML === "") {
            box.innerHTML = turn;
            if (checkWin()) {
                isGameOver = true;
                document.getElementById("results").innerHTML = `${turn} wins!`;
                document.querySelector(".play-again").style.display = "inline";
            } else if (checkDraw()) {
                isGameOver = true;
                document.getElementById("results").innerHTML = "It's a draw!";
                document.querySelector(".play-again").style.display = "inline";
            } else {
                changeTurn();
                if (mode === "ai" && turn === "O") {
                    setTimeout(aiMove, 1000);  // Add a 1 second delay for AI move
                }
            }
        }
    });
});

function changeTurn() {
    turn = turn === "X" ? "O" : "X";
    document.querySelector(".bg").style.left = turn === "X" ? "0" : "85px";
}

function checkWin() {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < winConditions.length; i++) {
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        if (v0 !== "" && v0 === v1 && v0 === v2) {
            isGameOver = true;
            document.querySelector("#results").innerHTML = turn + " wins!";
            document.querySelector(".play-again").style.display = "inline";

            for (let j = 0; j < 3; j++) {
                boxes[winConditions[i][j]].style.backgroundColor = "#08D9D6";
                boxes[winConditions[i][j]].style.color = "#000";
            }
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return Array.from(boxes).every(box => box.innerHTML !== "");
}

function aiMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerHTML === "") {
            boxes[i].innerHTML = turn;
            let score = minimax(boxes, 0, false, -Infinity, Infinity);
            boxes[i].innerHTML = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    boxes[move].innerHTML = turn;
    if (checkWin()) {
        isGameOver = true;
        document.getElementById("results").innerHTML = `${turn} wins!`;
        document.querySelector(".play-again").style.display = "inline";
    } else if (checkDraw()) {
        isGameOver = true;
        document.getElementById("results").innerHTML = "It's a draw!";
        document.querySelector(".play-again").style.display = "inline";
    } else {
        changeTurn();
    }
}

function minimax(board, depth, isMaximizing, alpha, beta) {
    let scores = {
        X: -1,
        O: 1,
        tie: 0
    };
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].innerHTML === "") {
                board[i].innerHTML = "O";
                let score = minimax(board, depth + 1, false, alpha, beta);
                board[i].innerHTML = "";
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].innerHTML === "") {
                board[i].innerHTML = "X";
                let score = minimax(board, depth + 1, true, alpha, beta);
                board[i].innerHTML = "";
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (boxes[a].innerHTML && boxes[a].innerHTML === boxes[b].innerHTML && boxes[a].innerHTML === boxes[c].innerHTML) {
            return boxes[a].innerHTML;
        }
    }
    if (Array.from(boxes).every(box => box.innerHTML !== "")) {
        return "tie";
    }
    return null;
}

document.querySelector(".play-again").addEventListener("click", () => {
    boxes.forEach(box => {
        box.innerHTML = "";
        box.style.backgroundColor = ""; // Reset background color
        box.style.color = ""; // Reset text color
    });
    turn = "X";
    isGameOver = false;
    document.querySelector(".bg").style.left = "0";
    document.getElementById("results").innerHTML = "";
    document.querySelector(".play-again").style.display = "none"; // Hide play again button
    updateModeButtons(); // Ensure correct mode button is highlighted on game reset
});

// Initial call to highlight the default mode button
updateModeButtons();
