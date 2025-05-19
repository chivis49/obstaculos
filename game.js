const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

let player, obstacle, gameOver;

function initGame() {
  player = {
    x: 50,
    y: 180,
    radius: 12,
    color: "lime",
    speed: 4
  };

  obstacle = {
    x: 400,
    y: 180,
    size: 25,
    color: "red",
    speed: 3
  };

  gameOver = false;
  restartBtn.style.display = "none";
  gameLoop();
}

let keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

function update() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  // Límite del canvas
  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

  // Movimiento del obstáculo
  obstacle.x -= obstacle.speed;
  if (obstacle.x + obstacle.size < 0) {
    obstacle.x = canvas.width + Math.random() * 100;
    obstacle.y = Math.random() * (canvas.height - obstacle.size);
  }

  if (isColliding(player, obstacle)) {
    gameOver = true;
    restartBtn.style.display = "block";
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawObstacle() {
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.moveTo(obstacle.x, obstacle.y);
  ctx.lineTo(obstacle.x + obstacle.size, obstacle.y + obstacle.size / 2);
  ctx.lineTo(obstacle.x, obstacle.y + obstacle.size);
  ctx.closePath();
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacle();

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("¡Has muerto!", 130, 190);
  }
}

function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  } else {
    draw();
  }
}

function isColliding(player, obstacle) {
  // Colisión básica círculo vs triángulo (como caja)
  const triBox = {
    x: obstacle.x,
    y: obstacle.y,
    width: obstacle.size,
    height: obstacle.size
  };
  const distX = Math.abs(player.x - triBox.x - triBox.width / 2);
  const distY = Math.abs(player.y - triBox.y - triBox.height / 2);

  if (distX > (triBox.width / 2 + player.radius)) return false;
  if (distY > (triBox.height / 2 + player.radius)) return false;

  return true;
}

restartBtn.addEventListener("click", () => {
  initGame();
});

initGame();
