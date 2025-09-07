document.addEventListener('DOMContentLoaded', () => {
    // Game canvas setup
    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('final-score');
    const gameOverElement = document.getElementById('game-over');
    
    // Game variables
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [];
    let food = {};
    let dx = gridSize;
    let dy = 0;
    let score = 0;
    let gameSpeed = 150; // milliseconds
    let gameLoop;
    let gameActive = false;
    
    // Initialize game
    function initGame() {
        // Reset snake
        snake = [
            { x: 5 * gridSize, y: 5 * gridSize },
            { x: 4 * gridSize, y: 5 * gridSize },
            { x: 3 * gridSize, y: 5 * gridSize }
        ];
        
        // Reset direction
        dx = gridSize;
        dy = 0;
        
        // Reset score
        score = 0;
        scoreElement.textContent = score;
        
        // Generate food
        generateFood();
        
        // Hide game over screen
        gameOverElement.classList.add('hidden');
        
        // Reset game speed
        gameSpeed = 150;
    }
    
    // Generate food at random position
    function generateFood() {
        // Generate random coordinates
        let foodX = Math.floor(Math.random() * tileCount) * gridSize;
        let foodY = Math.floor(Math.random() * tileCount) * gridSize;
        
        // Check if food is on snake
        const isOnSnake = snake.some(segment => segment.x === foodX && segment.y === foodY);
        
        if (isOnSnake) {
            // If food is on snake, generate new food
            generateFood();
        } else {
            food = { x: foodX, y: foodY };
        }
    }
    
    // Draw game elements
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        snake.forEach((segment, index) => {
            // Head is a different color
            if (index === 0) {
                ctx.fillStyle = '#2196F3';
            } else {
                ctx.fillStyle = '#4CAF50';
            }
            ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
            
            // Draw border around segment
            ctx.strokeStyle = '#333';
            ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
        });
        
        // Draw food
        ctx.fillStyle = '#f44336';
        ctx.fillRect(food.x, food.y, gridSize, gridSize);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(food.x, food.y, gridSize, gridSize);
    }
    
    // Update game state
    function update() {
        // Create new head
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        // Check for collisions
        if (checkCollision(head)) {
            gameOver();
            return;
        }
        
        // Add new head to beginning of snake array
        snake.unshift(head);
        
        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score += 10;
            scoreElement.textContent = score;
            
            // Generate new food
            generateFood();
            
            // Increase game speed every 50 points
            if (score % 50 === 0 && gameSpeed > 50) {
                gameSpeed -= 10;
                clearInterval(gameLoop);
                gameLoop = setInterval(gameStep, gameSpeed);
            }
        } else {
            // Remove tail segment
            snake.pop();
        }
    }
    
    // Check for collisions
    function checkCollision(head) {
        // Check wall collision
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            return true;
        }
        
        // Check self collision (skip the tail as it will be removed)
        for (let i = 1; i < snake.length - 1; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    // Game over function
    function gameOver() {
        clearInterval(gameLoop);
        gameActive = false;
        finalScoreElement.textContent = score;
        gameOverElement.classList.remove('hidden');
    }
    
    // Game step function
    function gameStep() {
        update();
        draw();
    }
    
    // Start game
    function startGame() {
        if (!gameActive) {
            initGame();
            gameActive = true;
            gameLoop = setInterval(gameStep, gameSpeed);
            startBtn.textContent = 'Pause';
        } else {
            clearInterval(gameLoop);
            gameActive = false;
            startBtn.textContent = 'Resume';
        }
    }
    
    // Reset game
    function resetGame() {
        clearInterval(gameLoop);
        gameActive = false;
        initGame();
        draw();
        startBtn.textContent = 'Start Game';
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', startGame);
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        // Prevent snake from reversing direction
        switch (e.key) {
            case 'ArrowUp':
                if (dy === 0) {
                    dx = 0;
                    dy = -gridSize;
                }
                break;
            case 'ArrowDown':
                if (dy === 0) {
                    dx = 0;
                    dy = gridSize;
                }
                break;
            case 'ArrowLeft':
                if (dx === 0) {
                    dx = -gridSize;
                    dy = 0;
                }
                break;
            case 'ArrowRight':
                if (dx === 0) {
                    dx = gridSize;
                    dy = 0;
                }
                break;
        }
    });
    
    // Initialize game on load
    initGame();
    draw();
});