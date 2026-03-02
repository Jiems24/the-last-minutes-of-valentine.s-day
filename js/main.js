
class Player {
    constructor() {
        this.positionX = 20
        this.positionY = 20
        this.width = 25
        this.height = 25

        //PARA EL SALTO
        this.isJumping = false;
        this.jumpheight = 80;
        this.jumpspeed = 4;
        this.groundY = 20;
    }

    moveUp() {
        this.positionY--;
    }

}

const playerRed = new Player()

const playerElement = document.querySelector(".player");

function renderPlayer() {
    playerElement.style.left = playerRed.positionX + "px";
    playerElement.style.bottom = playerRed.positionY + "px";

}

renderPlayer();

function jump() {
    if (playerRed.isJumping) return;
    playerRed.isJumping = true;

    const startY = playerRed.positionY;
    const peakY = startY + playerRed.jumpheight;

    const upInterval = setInterval(() => {
        playerRed.positionY += playerRed.jumpspeed;

        if (playerRed.positionY >= peakY) {
            playerRed.positionY = peakY;
            clearInterval(upInterval);


            const downInterval = setInterval(() => {
                playerRed.positionY -= playerRed.jumpspeed;

                if (playerRed.positionY <= playerRed.groundY) {
                    playerRed.positionY = playerRed.groundY;
                    clearInterval(downInterval);
                    playerRed.isJumping = false;
                }

                renderPlayer();
            }, 16);
        }

        renderPlayer();
    }, 16);
}

document.addEventListener("keyup", (e) => {
    console.log(e.code)
    if (e.code === "ArrowUp") {
        playerRed.moveUp()
        renderPlayer();
    }
})