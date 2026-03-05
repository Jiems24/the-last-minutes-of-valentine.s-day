// Clase del jugador
class Player {
    constructor() {
        this.positionX = 80
        this.positionY = 60
        this.width = 40
        this.height = 40
    }
}

// Instancia del jugador
const playerRed = new Player()

//Elementos del DOM: Jugador y carretera
const playerElement = document.querySelector(".player");
const road = document.querySelector(".road");

const board = document.querySelector(".gamebackground");
const title = document.querySelector("h1");

// Seleccionar pantalla Game Over
const gameOverScreen = document.querySelector(".gameOverScreen");
const restartBtn = document.querySelector("#restartBtn");

//Configuración de carriles (4 carriles y carril actual)
const trackCount = 4;
let trackIndex = 1;

function setGameSizes() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    document.body.style.height = screenHeight + "px";

    board.style.width = screenWidth + "px";
    board.style.height = Math.floor(screenHeight * 0.98) + "px";

    road.style.width = screenWidth + "px";
    road.style.height = Math.floor(screenHeight * 0.45) + "px";

    const playerWidth = Math.floor(screenWidth * 0.05);
    const playerHeight = Math.floor(screenHeight * 0.10);
    playerElement.style.width = playerWidth + "px";
    playerElement.style.height = playerHeight + "px";

    playerRed.positionX = Math.floor(screenWidth * 0.10);
    playerElement.style.left = playerRed.positionX + "px";

    setTimeout(() => {
        title.style.left = Math.floor((screenWidth - title.offsetWidth) / 2) + "px";
    }, 0);
}

// Calcula el "top" (altura) para colocar un elemento centrado en un carril
function getLaneTop(laneIndex, elementHeight) {
    const roadHeight = road.clientHeight;
    const trackHeight = roadHeight / trackCount;
    return laneIndex * trackHeight + (trackHeight - elementHeight) / 2;
}

// Coloca al jugador en el carril actual (trackIndex)
function playerSecondTrack() {
    const top = getLaneTop(trackIndex, playerElement.clientHeight);

    playerElement.style.left = playerRed.positionX + "px";
    playerElement.style.top = top + "px";

    playerRed.positionY = top;
}
// Cambio de carril con flechas (arriba/abajo)
function changeTrack(event) {
    if (event.code === "ArrowUp") {
        if (trackIndex > 0) {
            trackIndex--;
            playerSecondTrack()
        }
    }

    if (event.code === "ArrowDown") {
        if (trackIndex < trackCount - 1) {
            trackIndex++;
            playerSecondTrack();
        }
    }
}

const cars = [];
const carTravelTime = 4000;
const maxCars = 5
let spawnIntervalId = null;
let gameLoopId = null;
let isGameOver = false;

// Clase del coche/obstáculo
class Car {
    constructor(laneIndex) {
        // Carril del coche
        this.laneIndex = laneIndex;

        // Crear elemento IMG del coche
        this.element = document.createElement("img");
        this.element.classList.add("car");
        this.element.src = "./Img/car.gif";
        this.element.alt = "car";

        // Estilos básicos del coche
        this.element.style.position = "absolute";
        this.element.style.width = Math.floor(window.innerWidth * 0.10) + "px"
        this.element.style.height = "auto";

        // Añadir coche dentro de la carretera
        road.appendChild(this.element);

        // Colocar el coche en el carril 
        const carHeight = this.element.clientHeight || 60;
        const top = getLaneTop(this.laneIndex, carHeight);
        this.element.style.top = top + "px"

        // Punto inicial (derecha) y final (izquierda)
        this.startX = road.clientWidth + 20;
        this.width = this.element.clientWidth || 90;
        this.endX = -this.width - 20;

        // Posición inicial X
        this.element.style.left = this.startX + "px";

        // Tiempo de inicio del movimiento
        this.startTime = Date.now();

        // Flag para saber si ya se eliminó
        this.removed = false;
    }

    // Actualiza posición del coche en función del tiempo
    update(now) {
        if (this.removed) {

        } else {
            const timePassed = now - this.startTime;
            const progress = timePassed / carTravelTime;

            const currentX = this.startX + (this.endX - this.startX) * progress;
            this.element.style.left = currentX + "px";

            // Si llegó al final, eliminarlo
            if (progress >= 1) {
                this.remove();
            }
        }
    }

    // Elimina el coche del DOM y marca removed
    remove() {
        if (this.removed) {

        } else {
            this.removed = true;
            this.element.remove();
        }
    }
}

// Devuelve un carril aleatorio
function getRandomTrackIndex() {
    return Math.floor(Math.random() * trackCount);
}

// Crea un coche nuevo si no hay game over y no se supera el máximo
function spawnCar() {
    if (isGameOver) return;
    if (cars.length >= maxCars) return;
    const laneIndex = getRandomTrackIndex();
    const newCar = new Car(laneIndex);
    cars.push(newCar);
}

// Comprueba colisión
function isColliding(playerBox, carBox) {
    return (
        playerBox.left < carBox.right &&
        playerBox.right > carBox.left &&
        playerBox.top < carBox.bottom &&
        playerBox.bottom > carBox.top
    );
}

function checkCollision() {
    const playerBox = playerElement.getBoundingClientRect();

    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        if (car.removed) continue;

        const carBox = car.element.getBoundingClientRect();

        if (isColliding(playerBox, carBox)) {
            gameOver();
            return;
        }
    }
}

function startLoops() {
    clearInterval(spawnIntervalId);
    clearInterval(gameLoopId);

    spawnIntervalId = setInterval(() => {
        spawnCar();
        if (Math.random() < 0.3) {
            spawnCar();
        }
    }, 1200);

    gameLoopId = setInterval(() => {
        const now = Date.now();

        for (let i = 0; i < cars.length; i++) {
            cars[i].update(now);
        }
        for (let i = cars.length - 1; i >= 0; i--) {
            if (cars[i].removed) cars.splice(i, 1);
        }
        // Comprobar colisión jugador vs coches
        checkCollision();
    }, 16);
}


// Para el juego y muestra cartel "GAME OVER"
function gameOver() {
    isGameOver = true;
    clearInterval(spawnIntervalId);
    clearInterval(gameLoopId);

    if (gameOverScreen) gameOverScreen.style.display = "flex";
}

function restartGame() {

    if (gameOverScreen) gameOverScreen.style.display = "none";

    clearInterval(spawnIntervalId);
    clearInterval(gameLoopId);

    isGameOver = false;

    for (let i = 0; i < cars.length; i++) {
        cars[i].remove();
    }
    cars.length = 0;

    trackIndex = 1;
    playerSecondTrack();

    startLoops();

}



// Espera a que el HTML esté cargado antes de iniciar el juego
document.addEventListener("DOMContentLoaded", () => {

    setGameSizes();

    playerElement.addEventListener("load", playerSecondTrack);

    playerSecondTrack();
    document.addEventListener("keydown", changeTrack);

    const roadSize = new ResizeObserver(() => {
        playerSecondTrack();
    });

    window.addEventListener("resize", () => {
        setGameSizes();
        playerSecondTrack();
    });

    roadSize.observe(road);

    restartBtn.addEventListener("click", restartGame);
    startLoops();
});