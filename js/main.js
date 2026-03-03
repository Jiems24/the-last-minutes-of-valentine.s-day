
class Player {
    constructor() {
        this.positionX = 20
        this.positionY = 11
        this.width = 40
        this.height = 40

        //PARA EL SALTO
        this.isJumping = false;
        this.jumpheight = 80;
        this.jumpspeed = 4;
        this.groundY = 20;
    }
}

const playerRed = new Player()

const playerElement = document.querySelector(".player");
const gameBackground = document.querySelector(".gamebackground");

function renderPlayer() {
    playerElement.style.left = playerRed.positionX + "px";
    playerElement.style.bottom = playerRed.positionY + "px";
}

renderPlayer();


function jump() {

    if (playerRed.isJumping) {
        return;
    }

    playerRed.isJumping = true

    const runPosition = playerRed.positionY;
    const jumpPosition = runPosition + playerRed.jumpheight;

    const upInterval = setInterval(() => {
        playerRed.positionY += playerRed.jumpspeed;

        if (playerRed.positionY >= jumpPosition) {
            playerRed.jumpspeed *= -1  // change speed direction
        } else if (playerRed.positionY <= runPosition) {
            clearInterval(upInterval);
            playerRed.isJumping = false
            playerRed.jumpspeed *= -1 // change speed direction
        }

        renderPlayer();
    }, 16);
}

let introStarted = false;

function startIntroScroll() {
    if (introStarted) {
        return introStarted = true;
    }
    gameBackground.classList.add("hideNumbers");

}
 startIntroScroll();

document.addEventListener("keyup", (e) => {
    console.log(e.code)
    if (e.code === "ArrowUp") {
       
        jump();
    }
});

const obstaclesArr = []

/*setInterval(() => {
    obstaclesArr.forEach(() => {
        // move this obstacle

        // detect collision
        if() {
            // game over
            // player.speed  = player.speed * 0.97
        }
    })
}, 40);
*/
