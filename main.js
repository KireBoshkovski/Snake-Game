var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
window.onload = function () {
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    var scoreDisplay = document.getElementById("score");
    var gridSize = 20;
    var tileCount = canvas.width / gridSize;
    var snake = [{ x: 10, y: 10 }];
    var velocity = { x: 0, y: 0 };
    var food = { x: 15, y: 15 };
    var isRunning = false;
    var lastDirection = { x: 1, y: 0 };
    var score = 0;
    function startGame() {
        if (isRunning)
            return;
        isRunning = true;
        velocity = { x: 1, y: 0 };
        gameLoop();
    }
    function onStartKey(e) {
        startGame();
        document.removeEventListener("keydown", onStartKey);
    }
    document.addEventListener("keydown", onStartKey);
    function gameLoop() {
        lastDirection = __assign({}, velocity);
        update();
        draw();
        if (isRunning) {
            setTimeout(gameLoop, 100);
        }
    }
    function placeFood() {
        var newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount),
            };
        } while (snake.some(function (segment) { return segment.x === newFood.x && segment.y === newFood.y; }));
        food = newFood;
    }
    function update() {
        var head = {
            x: snake[0].x + velocity.x,
            y: snake[0].y + velocity.y,
        };
        if (head.x < 0 || head.x >= tileCount ||
            head.y < 0 || head.y >= tileCount ||
            snake.some(function (segment) { return segment.x === head.x && segment.y === head.y; })) {
            alert("Game Over");
            isRunning = false;
            snake = [{ x: 10, y: 10 }];
            velocity = { x: 0, y: 0 };
            food = { x: 15, y: 15 };
            score = 0;
            document.addEventListener("keydown", onStartKey);
            return;
        }
        snake.unshift(head); // add new tile (head)
        if (head.x === food.x && head.y === food.y) { // same tile head and food
            placeFood();
            score++;
            scoreDisplay.textContent = "Score: ".concat(score);
        }
        else {
            snake.pop(); // if not remove the tail tile for maintaining same length
        }
    }
    function draw() {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "lime";
        snake.forEach(function (part) {
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
        });
        ctx.fillStyle = "red";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }
    document.addEventListener("keydown", function (e) {
        if (!isRunning)
            return;
        switch (e.key) {
            case "ArrowUp":
                if (lastDirection.y === 0)
                    velocity = { x: 0, y: -1 };
                break;
            case "ArrowDown":
                if (lastDirection.y === 0)
                    velocity = { x: 0, y: 1 };
                break;
            case "ArrowLeft":
                if (lastDirection.x === 0)
                    velocity = { x: -1, y: 0 };
                break;
            case "ArrowRight":
                if (lastDirection.x === 0)
                    velocity = { x: 1, y: 0 };
                break;
        }
    });
};
