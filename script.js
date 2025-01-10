let board = document.querySelector(".board");
let gameOverSound = new Audio("./audioFile/gameOver.wav");
let turnSound = new Audio("./audioFile/turn.wav");
let eatSound = new Audio("./audioFile/eat.wav");

let keys = document.querySelectorAll(".keys");

let gameOver = false;

// Random food position generator
let foodX;
let foodY;
function randomFoodPosition() {
    foodX = Math.floor(Math.random() * 14) + 1;
    foodY = Math.floor(Math.random() * 14) + 1;
}

// Snake position
let snakX = 3;
let snakY = 10;
let velocityX = 0;
let velocityY = 0;
let snakeBody = [];

// Score tracking
let score = 0;
let highestScore = localStorage.getItem("highestScore") || 0;
let highestScoreUser = localStorage.getItem("highestScoreUser") || "Anonymous"; // Username of the highest scorer

// Display the score and highest score
function updateScore() {
    document.getElementById("score").innerText = score;
    document.getElementById("highestScore").innerText = `${highestScore} by ${highestScoreUser}`;
}

// Snake movement handler
function moveSnake(e) {
    if (e.key === "ArrowUp"  && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
        turnSound.play();
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
        turnSound.play();
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
        turnSound.play();
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
        turnSound.play();
    }
    main();
}

keys.forEach((key) => {
    key.addEventListener("click", () => {
        moveSnake({ key: key.dataset.key });
    });
});

// Game over logic
function showGameOver() {
    clearInterval(setIntervalId);
    gameOverSound.play();
    document.removeEventListener("keydown", moveSnake);
    turnSound.pause();

    // Show the name input container only if the score is greater than the highest score
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem("highestScore", highestScore); // Save highest score in localStorage
        document.getElementById("nameInputContainer").style.display = "block"; // Show input field to capture username
    }
}

// Reset button logic
function reset() {
    score = 0;
    snakX = 3;
    snakY = 10;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    randomFoodPosition();
    gameOver = false;
    document.getElementById("nameInputContainer").style.display = "none"; // Hide input field when resetting the game
    main();
    setIntervalId = setInterval(main, 400); // Set speed to 400ms per frame
    updateScore();
}

// Save user's name when a new highest score is achieved
function saveUserName() {
    const userName = document.getElementById("username").value;
    if (userName.trim() === "") {
        alert("Please enter a valid name.");
        return;
    }

    highestScoreUser = userName;
    localStorage.setItem("highestScoreUser", highestScoreUser); // Save username to localStorage
    updateScore(); // Update highest score and username display
    document.getElementById("nameInputContainer").style.display = "none"; // Hide input field after saving
}

// Main game loop
let setIntervalId;

function main() {
    if (gameOver) {
        return showGameOver();
    }

    if (snakX === foodX && snakY === foodY) {
        randomFoodPosition();
        eatSound.play();
        snakeBody.push([foodX, foodY]);
        score++; // Increase score when food is eaten
    }

    // Move the snake's body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    // Render the snake and food
    let setHtml = `<div class="food" style="grid-area: ${foodY}/${foodX};"></div>`;
    snakX += velocityX;
    snakY += velocityY;
    snakeBody[0] = [snakX, snakY];

    for (let i = 0; i < snakeBody.length; i++) {
        setHtml += `<div class="snake-head" id="div${i}" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]};"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    if (snakX <= 0 || snakX > 14 || snakY <= 0 || snakY > 14) {
        gameOver = true;
    }

    board.innerHTML = setHtml;
    updateScore(); // Update the score display
}

// Load the game with the highest score and username from localStorage
function loadGame() {
    highestScore = localStorage.getItem("highestScore") || 0;
    highestScoreUser = localStorage.getItem("highestScoreUser") || "Anonymous";
    updateScore(); // Initialize the score and highest score display
}

randomFoodPosition();
main();
setIntervalId = setInterval(main, 400); // Set speed to 400ms per frame
loadGame(); // Load the highest score and username when the game is initialized

// Event listener for keyboard input
document.addEventListener("keydown", moveSnake);
