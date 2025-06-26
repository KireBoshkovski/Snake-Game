type Point = {
    x: number;
    y: number;
};

type GameState = {
    snake: Point[];
    velocity: Point;
    lastDirection: Point;
    food: Point;
    isRunning: boolean;
    score: number;
};

const gridSize = 20;
const canvasSize = 400;
const tileCount = canvasSize / gridSize;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let scoreDisplay: HTMLElement;
let state: GameState;

window.onload = () => {
    canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d")!;
    scoreDisplay = document.getElementById("score")! as HTMLElement;

    state = createInitialState();
    draw();

    document.addEventListener("keydown", onStartKey);
    document.addEventListener("keydown", handleDirectionInput);
};

function createInitialState(): GameState {
    return {
        snake: [{ x: 10, y: 10 }],
        velocity: { x: 0, y: 0 },
        lastDirection: { x: 1, y: 0 },
        food: { x: 15, y: 15 },
        isRunning: false,
        score: 0,
    };
}

function onStartKey(e: KeyboardEvent): void {
    if (state.isRunning) return;
    state.isRunning = true;
    state.velocity = { x: 1, y: 0 };
    document.removeEventListener("keydown", onStartKey);
    gameLoop();
}

function gameLoop(): void {
    state.lastDirection = state.velocity;

    update();
    draw();

    if (state.isRunning) {
        setTimeout(gameLoop, 100);
    }
}

function update(): void {
    const head = {
        x: state.snake[0].x + state.velocity.x,
        y: state.snake[0].y + state.velocity.y,
    };

    const hitWall = head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
    const hitSelf = state.snake.some(segment => segment.x === head.x && segment.y === head.y);

    if (hitWall || hitSelf) {
        alert("Game Over");
        state = createInitialState();
        document.addEventListener("keydown", onStartKey);
        return;
    }

    state.snake.unshift(head);

    if (head.x === state.food.x && head.y === state.food.y) {
        state.food = generateNewFood(state.snake);
        state.score += 1;
        scoreDisplay.textContent = `Score: ${state.score}`;
    } else {
        state.snake.pop();
    }
}

function generateNewFood(snake: Point[]): Point {
    let food: Point;
    do {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
        };
    } while (snake.some(part => part.x === food.x && part.y === food.y));
    return food;
}

function draw(): void {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    state.snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(state.food.x * gridSize, state.food.y * gridSize, gridSize - 2, gridSize - 2);
}

function handleDirectionInput(e: KeyboardEvent): void {
    if (!state.isRunning) return;

    const { x: dx, y: dy } = state.lastDirection;

    switch (e.key) {
        case "ArrowUp":
            if (dy === 0) state.velocity = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (dy === 0) state.velocity = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (dx === 0) state.velocity = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (dx === 0) state.velocity = { x: 1, y: 0 };
            break;
    }
}