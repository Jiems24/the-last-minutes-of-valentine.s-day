
class Player {
    constructor() {
        this.positionX = 20
        this.positionY = 20
        this.width = 25
        this.height = 25
    }

    moveUp() {
        this.positionY--
    }

}

const playerRed = new Player()

document.addEventListener("keyup", (e) => {
    console.log(e.code)
    if (e.code === "ArrowUp") {
        playerRed.moveUp()
    }
})