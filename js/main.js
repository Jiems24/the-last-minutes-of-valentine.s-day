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

//Configuración de carriles (4 carriles y carril actual)
const trackCount = 4;
let trackIndex = 1;

function getLaneTop(laneIndex, elementHeight) {
    const roadHeight = road.clientHeight;
    const trackHeight = roadHeight / trackCount;
    return laneIndex * trackHeight + (trackHeight - elementHeight) / 2;
}

function playerSecondTrack() {
    const top = getLaneTop(trackIndex, playerElement.clientHeight);

    playerElement.style.left = playerRed.positionX + "px";
    playerElement.style.top = top + "px";

    playerRed.positionY = top;
}

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
const carTravelTime = 5000;
const maxCars = 3
let spawnIntervalId = null;
let gameLoopId = null;
let isGameOver = false;

class Car {
    constructor(laneIndex) {
        this.laneIndex = laneIndex;
        this.element = document.createElement("img");
        this.element.classList.add("car");
        this.element.src = "./Img/car.gif";
        this.element.alt = "car";

        this.element.style.position = "absolute";
        this.element.style.width = "10vw"
        this.element.style.height = "auto";

        road.appendChild(this.element);

        const carHeight = this.element.clientHeight || 60;
        const top = getLaneTop(this.laneIndex, carHeight);
        this.element.style.top = top + "px"

        this.startX = road.clientWidth + 20;
        this.width = this.element.clientWidth || 90;
        this.endX = -this.width - 20;

        this.element.style.left = this.startX + "px";

        this.startTime = Date.now();

        this.removed = false;
    }


    update(now) {
        if (this.removed) {

        } else {
            const timePassed = now - this.startTime;
            const progress = timePassed / carTravelTime;

            const currentX = this.startX + (this.endX - this.startX) * progress;
            this.element.style.left = currentX + "px";

            if (progress >= 1) {
                this.remove();
            }
        }
    }

    remove() {
        if (this.removed) {

        } else {
            this.removed = true;
            this.element.remove();
        }
    }
}

function getRandomTrackIndex() {
    return Math.floor(Math.random() * trackCount);
}

function spawnCar() {
    if (isGameOver) return;
    if (cars.length >= maxCars) return;
    const laneIndex = getRandomTrackIndex();
    const newCar = new Car(laneIndex);
    cars.push(newCar);
}

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

function gameOver() {
    isGameOver = true;
    clearInterval(spawnIntervalId);
    clearInterval(gameLoopId);

    const over = document.createElement("div")
    over.textContent = "GAME OVER";
    over.style.position = "absolute";
    over.style.top = "50%";
    over.style.left = "50%";
    over.style.transform = "translate(-50%, -50%)";
    over.style.padding = "20px 30px";
    over.style.background = "rgba(0,0,0,0.8)";
    over.style.color = "white";
    over.style.fontSize = "48px";
    over.style.fontFamily = "Arial";
    over.style.zIndex = "9999";

    document.body.appendChild(over);
}




document.addEventListener("DOMContentLoaded", () => {

    playerElement.addEventListener("load", playerSecondTrack);

    playerSecondTrack();
    document.addEventListener("keydown", changeTrack);

    const roadSize = new ResizeObserver(() => {
        playerSecondTrack();
    });
    roadSize.observe(road);
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
            checkCollision();
        }, 16);


});