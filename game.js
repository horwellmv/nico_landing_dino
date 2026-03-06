
// ============================================================================
// SUPER NICO #3 - Game Loop
// Game Dino modificado para campaña política estudiantil
// ============================================================================


const SPRITE_MAP = {
  run: [
    { x: 80, y: 340, w: 98, h: 138 },  { x: 218, y: 340, w: 98, h: 138 },
    { x: 357, y: 340, w: 98, h: 138 }, { x: 492, y: 340, w: 98, h: 138 },
    { x: 85, y: 548, w: 98, h: 138 },  { x: 215, y: 548, w: 98, h: 138 },
    { x: 361, y: 548, w: 98, h: 138 }, { x: 494, y: 548, w: 98, h: 138 }
  ],
  jump: { x: 740, y: 305, w: 120, h: 175 },
  gameOver: { x: 695, y: 565, w: 195, h: 140 },
  obstacles: {
    1: { x: 1050, y: 355, w: 260, h: 341 },
    2: { x: 1440, y: 350, w: 280, h: 350 }
  },
  powerUp: { x: 1360, y: 730, w: 400, h: 350 },
  ground: { x: 60, y: 855, w: 240, h: 220 }
};


// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// DOM elements
const startBtn = document.getElementById('startGameBtn');
const gameContainer = document.getElementById('gameContainer');
const gameStartPrompt = document.getElementById('gameStartPrompt');
const gameOverModal = document.getElementById('gameOverModal');
const playAgainBtn = document.getElementById('playAgainBtn');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const jumpBtn = document.getElementById('jumpBtn');
const quitGameBtn = document.getElementById('quitGameBtn');
const playerNameInput = document.getElementById('playerName');
const playerClassInput = document.getElementById('playerClass');

// Display elements
const livesDisplay = document.getElementById('livesDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const finalScore = document.getElementById('finalScore');
const finalTime = document.getElementById('finalTime');
const finalRank = document.getElementById('finalRank');
const rankingInfo = document.getElementById('rankingInfo');
const topScoreForm = document.getElementById('topScoreForm');
const notTopScoreMessage = document.getElementById('notTopScoreMessage');

// Game state
let gameState = {
  running: false,
  score: 0,
  lives: 3,
  speed: 5,
  difficulty: 1,
  playerX: 0,
  playerY: 0,
  playerJumping: false,
  playerVelocityY: 0,
  startTime: 0,
  elapsedTime: 0,
  nextSpeedThreshold: 100 // only increase when score >= this
};

// Game constants
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const PLAYER_SIZE = 90;
const GROUND_LEVEL = CANVAS_HEIGHT - 130;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -15;
const OBSTACLE_WIDTH = 70;
const OBSTACLE_HEIGHT = 60;
const POWERUP_SIZE = 90;

// Game objects arrays
let obstacles = [];
let powerups = [];
let particles = [];

// Spritesheet (se cargará si existe)
let spritesheet = null;
const spritesheetPath = './assets/sprite-sheet.webp';

// Animation state
let playerFrame = 0;
let frameCounter = 0;
const FRAME_CHANGE_INTERVAL = 5; // change every 5 loops


// ============================================================================
// Classes
// ============================================================================

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = PLAYER_SIZE;
    this.height = PLAYER_SIZE;
    this.velocityY = 0;
    this.jumping = false;
  }

  jump() {
    if (!this.jumping) {
      this.velocityY = JUMP_STRENGTH;
      this.jumping = true;
    }
  }

  update() {
    this.velocityY += GRAVITY;
    this.y += this.velocityY;

    if (this.y >= GROUND_LEVEL) {
      this.y = GROUND_LEVEL;
      this.velocityY = 0;
      this.jumping = false;
    }
  }

  draw() {
    if (spritesheet) {
      // choose frame based on jumping state
      let frameMap;
      if (this.jumping) {
        frameMap = SPRITE_MAP.jump;
      } else {
        frameMap = SPRITE_MAP.run[playerFrame % SPRITE_MAP.run.length];
      }
      ctx.drawImage(
        spritesheet,
        frameMap.x,
        frameMap.y,
        frameMap.w,
        frameMap.h,
        this.x,
        this.y,
        this.width,
        this.height
      );
      return;
    }

    // fallback geometric draw
    ctx.fillStyle = '#0033A0';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Ojos
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(this.x + 8, this.y + 8, 8, 8);
    ctx.fillRect(this.x + 24, this.y + 8, 8, 8);

    // Boca
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x + PLAYER_SIZE / 2, this.y + 28, 6, 0, Math.PI);
    ctx.stroke();
  }

  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

class Obstacle {
  constructor(x, y, number) {
    this.x = x;
    this.y = y;
    this.width = OBSTACLE_WIDTH;
    this.height = OBSTACLE_HEIGHT;
    this.number = number; // 1 o 2
    this.velocityX = -gameState.speed;
  }

  update() {
    this.x += this.velocityX;
  }

  draw() {
    if (spritesheet) {
      const map = SPRITE_MAP.obstacles[this.number];
      if (map) {
        ctx.drawImage(
          spritesheet,
          map.x,
          map.y,
          map.w,
          map.h,
          this.x,
          this.y,
          this.width,
          this.height
        );
        return;
      }
    }
    // fondo geométrico
    ctx.fillStyle = this.number === 1 ? '#EF4444' : '#F97316';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Número
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      this.number,
      this.x + this.width / 2,
      this.y + this.height / 2
    );
  }

  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

class PowerUp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = POWERUP_SIZE;
    this.height = POWERUP_SIZE;
    this.velocityX = -gameState.speed;
    this.rotation = 0;
    this.collected = false;
  }

  update() {
    this.x += this.velocityX;
    this.rotation += 0.05;
  }

  draw() {
    if (spritesheet) {
      const map = SPRITE_MAP.powerUp;
      if (map) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.drawImage(
          spritesheet,
          map.x,
          map.y,
          map.w,
          map.h,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        );
        ctx.restore();
        return;
      }
    }

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    // Glow effect
    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, POWERUP_SIZE / 2 + 10, 0, Math.PI * 2);
    ctx.fill();

    // Fondo del power-up
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    // Número 3
    ctx.fillStyle = '#0033A0';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3', 0, 0);

    ctx.restore();
  }

  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

class Particle {
  constructor(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = 1;
    this.decay = 0.02;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2;
    this.life -= this.decay;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.fillRect(this.x, this.y, 5, 5);
    ctx.globalAlpha = 1;
  }
}

// ============================================================================
// Collision Detection
// ============================================================================

function checkCollision(box1, box2) {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  );
}

// ============================================================================
// Game Loop
// ============================================================================

let player;
let animationId;

function gameLoop() {
  // Clear canvas
  ctx.fillStyle = '#a6d1ed';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw ground
  ctx.fillStyle = '#90EE90';
  //ctx.fillStyle = SPRITE_MAP.ground;
  ctx.fillRect(0, GROUND_LEVEL, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_LEVEL);

  // Ground line
  ctx.strokeStyle = '#025d12';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_LEVEL);
  ctx.lineTo(CANVAS_WIDTH, GROUND_LEVEL);
  ctx.stroke();

  if (!gameState.running) {
    return;
  }

  // Update player
  player.update();
  player.draw();

  // update animation counter
  frameCounter++;
  if (frameCounter >= FRAME_CHANGE_INTERVAL) {
    frameCounter = 0;
    playerFrame++;
  }

  // Update and draw obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].draw();

    // Check collision with player
    if (checkCollision(player.getCollisionBox(), obstacles[i].getCollisionBox())) {
      gameState.lives--;
      obstacles.splice(i, 1);
      updateDisplay();

      if (gameState.lives <= 0) {
        endGame();
      }
      continue;
    }

    // Remove off-screen obstacles
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
    }
  }

  // Update and draw power-ups
  for (let i = powerups.length - 1; i >= 0; i--) {
    powerups[i].update();
    powerups[i].draw();

    // Check collision with player
    if (checkCollision(player.getCollisionBox(), powerups[i].getCollisionBox())) {
      gameState.score += 50;
      powerups.splice(i, 1);

      // Create particles
      for (let j = 0; j < 10; j++) {
        const angle = (Math.PI * 2 * j) / 10;
        const speed = 5;
        particles.push(
          new Particle(
            player.x + PLAYER_SIZE / 2,
            player.y + PLAYER_SIZE / 2,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            '#FFD700'
          )
        );
      }

      updateDisplay();
      continue;
    }

    // Remove off-screen power-ups
    if (powerups[i].x + powerups[i].width < 0) {
      powerups.splice(i, 1);
    }
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  // Spawn obstacles and power-ups randomly
  if (Math.random() < 0.02) {
    if (Math.random() < 0.3) {
      // Spawn power-up (#3)
      powerups.push(new PowerUp(CANVAS_WIDTH, GROUND_LEVEL - POWERUP_SIZE - 10));
    } else {
      // Spawn obstacle (1 o 2)
      const number = Math.random() < 0.5 ? 1 : 2;
      obstacles.push(new Obstacle(CANVAS_WIDTH, GROUND_LEVEL - OBSTACLE_HEIGHT, number));
    }
  }

  // Increase difficulty only once per 100-point milestone
  if (gameState.score >= gameState.nextSpeedThreshold) {
    gameState.speed += 10;
    gameState.difficulty = Math.floor(gameState.score / 100) + 1;
    gameState.nextSpeedThreshold += 100;

    // Update obstacle velocities
    obstacles.forEach(obs => (obs.velocityX = -gameState.speed));
    powerups.forEach(pu => (pu.velocityX = -gameState.speed));
  }

  // Update elapsed time
  gameState.elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);

  updateDisplay();
  animationId = requestAnimationFrame(gameLoop);
}

// ============================================================================
// Game Management
// ============================================================================

function startGame() {
  // Reset game state
  gameState = {
    running: true,
    score: 0,
    lives: 3,
    speed: 10,
    difficulty: 1,
    playerX: 50,
    playerY: GROUND_LEVEL,
    playerJumping: false,
    playerVelocityY: 0,
    startTime: Date.now(),
    elapsedTime: 0
  };

  // Clear game objects
  obstacles = [];
  powerups = [];
  particles = [];

  // Create player
  player = new Player(gameState.playerX, gameState.playerY);

  // Hide start prompt, show game container
  gameStartPrompt.classList.add('hidden');
  gameContainer.classList.remove('hidden');

  // Reset modal
  gameOverModal.classList.add('hidden');

  // Start game loop
  gameLoop();
}

async function endGame() { // Añadimos async
  gameState.running = false;
  cancelAnimationFrame(animationId);

  // EVALUACIÓN REAL CON SUPABASE
  const isTopScore = await checkIfTopScorer(gameState.score); 

  finalScore.textContent = gameState.score;
  finalTime.textContent = gameState.elapsedTime + 's';

  // Update modal
  finalScore.textContent = gameState.score;
  finalTime.textContent = gameState.elapsedTime + 's';

  if (isTopScore) {
    topScoreForm.classList.remove('hidden');
    notTopScoreMessage.classList.add('hidden');
    rankingInfo.classList.remove('hidden');
    saveScoreBtn.classList.remove('hidden');
  } else {
    topScoreForm.classList.add('hidden');
    notTopScoreMessage.classList.remove('hidden');
    rankingInfo.classList.add('hidden');
    saveScoreBtn.classList.add('hidden');
  }

  // Show modal
  gameOverModal.classList.remove('hidden');
}

function updateDisplay() {
  scoreDisplay.textContent = gameState.score;
  timeDisplay.textContent = gameState.elapsedTime + 's';

  // Update lives display
  let livesHtml = '';
  for (let i = 0; i < gameState.lives; i++) {
    livesHtml += '❤️';
  }
  livesDisplay.textContent = livesHtml || '0 vidas';
}

// ============================================================================
// Supabase-related Functions
// ============================================================================

// Placeholder: Fetch top 10 scores
async function fetchTop10() {
  // TODO: Implement Supabase fetch
  // Placeholder data
  return [
    { nombre: 'María S.', grado: '6-a', puntaje: 2450, tiempo: 145 },
    { nombre: 'Juan P.', grado: '7-b', puntaje: 1890, tiempo: 120 },
    { nombre: 'Ana R.', grado: '8-a', puntaje: 1650, tiempo: 110 },
    { nombre: 'Carlos M.', grado: '8-a', puntaje: 1420, tiempo: 95 },
    { nombre: 'Sofia L.', grado: '9-a', puntaje: 1200, tiempo: 85 },
    { nombre: 'Luis G.', grado: '6-b', puntaje: 1050, tiempo: 80 },
    { nombre: 'Emma T.', grado: '7-a', puntaje: 950, tiempo: 70 },
    { nombre: 'Diego F.', grado: '9-b', puntaje: 850, tiempo: 65 },
    { nombre: 'Paula H.', grado: '8-b', puntaje: 750, tiempo: 60 },
    { nombre: 'Mario K.', grado: '6-c', puntaje: 650, tiempo: 55 }
  ];
}

// Check if score is top 10
function checkIfTopScorer(puntaje) {
  // For now, return true if score > 400
  // TODO: Compare with actual top 10 from Supabase
  return puntaje >= 400;
}

// Calculate rank position
function calculateRank(puntaje, listaTop10) {
  // listaTop10 should be sorted from highest to lowest
  for (let i = 0; i < listaTop10.length; i++) {
    if (puntaje > listaTop10[i].puntaje) {
      return i + 1;
    }
  }
  return listaTop10.length + 1;
}

// Submit score to Supabase
async function submitScore(nombre, grado, puntaje, tiempo) {
  try {
    console.log('Enviando puntuación a Supabase:', {
      nombre,
      grado,
      puntaje,
      tiempo
    });

    // TODO: Implement Supabase INSERT
    // const response = await supabase
    //   .from('Puntajes')
    //   .insert([
    //     {
    //       nombre,
    //       grado,
    //       puntaje,
    //       tiempo,
    //     }
    //   ]);

    alert(`¡Felicidades ${nombre}! Tu puntuación fue guardada.`);
    return true;
  } catch (error) {
    console.error('Error al guardar puntuación:', error);
    return false;
  }
}

// ============================================================================
// Event Handlers
// ============================================================================

// Start game button
startBtn.addEventListener('click', startGame);

// Play again button
playAgainBtn.addEventListener('click', () => {
  playerNameInput.value = '';
  playerClassInput.value = '';
  startGame();
});

// Close modal button
closeModalBtn.addEventListener('click', () => {
  gameOverModal.classList.add('hidden');
  gameContainer.classList.add('hidden');
  gameStartPrompt.classList.remove('hidden');
  gameState.running = false;
  cancelAnimationFrame(animationId);
});

// Jump button (mobile touch)
jumpBtn.addEventListener('click', () => {
  if (!gameState.running) return;
  player.jump();
});

// Quit game button (mobile)
quitGameBtn.addEventListener('click', () => {
  endGame();
});

// Save score button
saveScoreBtn.addEventListener('click', async () => {
  const nombre = playerNameInput.value.trim();
  const grado = playerClassInput.value.trim();

  if (!nombre || !grado) {
    alert('Por favor completa tu nombre y aula.');
    return;
  }

  const success = await submitScore(
    nombre,
    grado,
    gameState.score,
    gameState.elapsedTime
  );

  if (success) {
    setTimeout(() => {
      playerNameInput.value = '';
      playerClassInput.value = '';
      startGame();
    }, 1000);
  }
});

// Keyboard input
document.addEventListener('keydown', (event) => {
  if (!gameState.running) return;

  if (event.code === 'Space' || event.code === 'ArrowUp') {
    event.preventDefault();
    player.jump();
  }
});

// Touch input (mobile)
document.addEventListener('touchstart', (event) => {
  if (!gameState.running) return;

  // Only respond to touches on the canvas area
  const canvasRect = canvas.getBoundingClientRect();
  const touch = event.touches[0];

  if (
    touch.clientX >= canvasRect.left &&
    touch.clientX <= canvasRect.right &&
    touch.clientY >= canvasRect.top &&
    touch.clientY <= canvasRect.bottom
  ) {
    player.jump();
  }
});

// Load spritesheet if available
window.addEventListener('load', () => {
  const img = new Image();
  img.src = spritesheetPath;
  img.onload = () => {
    spritesheet = img;
    console.log('Spritesheet cargado exitosamente');
  };
  img.onerror = () => {
    console.log(
      'Spritesheet no encontrado, usando formas geométricas para el render'
    );
  };
});

// ============================================================================
// Export functions for external use
// ============================================================================
window.gameExports = {
  startGame,
  endGame,
  fetchTop10,
  checkIfTopScorer,
  calculateRank,
  submitScore
};


// 1. Inicialización al inicio del archivo (después de las constantes)
const supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// 2. Implementación de Fetch Real
async function fetchTop10() {
  const { data, error } = await supabaseClient
    .from('leaderboard')
    .select('nombre, grado, puntaje, tiempo')
    .order('puntaje', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error conectando a Supabase leaderboard:', error);
    return [];
  }
  console.log
  return data;
}

// 3. Implementación de Check Real
async function checkIfTopScorer(puntaje) {
  const topScores = await fetchTop10();
  if (topScores.length < 10) return true; // Hay espacio libre
  return puntaje > topScores[topScores.length - 1].puntaje;
}

// 4. Implementación de Submit Real
async function submitScore(nombre, grado, puntaje, tiempo) {
  try {
    const { data, error } = await supabaseClient
      .from('leaderboard')
      .insert([
        { 
          nombre: nombre, 
          grado: grado, 
          puntaje: puntaje, 
          tiempo: tiempo 
        }
      ]);

    if (error) throw error;

    alert(`¡Genial ${nombre}! Tu récord ha sido registrado.`);
    return true;
  } catch (error) {
    console.error('Error guardando en Supabase:', error);
    alert('Hubo un error al guardar tu puntaje.');
    return false;
  }
}