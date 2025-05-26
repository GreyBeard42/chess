class Tile {
    constructor(x,y,img=0,side=0,inverted=false) {
        this.cords = {x: x, y: y}
        this.img = img
        this.element = document.createElement("div")
        this.element.classList.add("tile")
        this.hasmoved = false

        //Checkered coloring
        if((x+y)%2===1) {
            this.element.style = "background-color: #426d4e; color: #edfff3;"
        }

        //markup
        this.markup = document.createElement("div")
        this.markup.classList.add("markup")
        this.markup.style = ""
        this.element.appendChild(this.markup)

        //Tile Coordinates
        let numx = (x==0)
        if(inverted) numx = (x==7)
        if(numx) {
            let lilnum = document.createElement("div")
            lilnum.innerText = y+1
            lilnum.style = "position: absolute; top: 0; left: 1px;"
            if(inverted) {
                lilnum.innerText = 7-y+1
                lilnum.style = "position: absolute; top: 0; right: 1px;"
            }
            this.element.appendChild(lilnum)
        }
        if(y==7) {
            let lilnum = document.createElement("div")
            lilnum.innerText = ["a","b","c","d","e","f","g","h"][7-x]
            lilnum.style = "position: absolute; bottom: 0; right: 5px;"
            if(inverted) lilnum.style = "position: absolute; bottom: 0; left: 5px;"
            this.element.appendChild(lilnum)
        }

        //Peice
        this.peice = document.createElement("img")
        if(img>=0) {
            this.side = side
            if(this.side===0) {
                this.peice.src = `images/0${img+6}.png`
                if(img+6>9) this.peice.src = `images/${img+6}.png`
            } else this.peice.src = `images/0${img}.png`
        } else this.peice.style.display = "none"
        this.element.appendChild(this.peice)
    }
    update(tile) {
        this.hasmoved = true
        this.img = tile.img
        this.side = tile.side
        if(this.img>=0) {
            this.peice.style.display = "block"
            if(this.side===0) {
                this.peice.src = `images/0${this.img+6}.png`
                if(this.img+6>9) this.peice.src = `images/${this.img+6}.png`
            } else this.peice.src = `images/0${this.img}.png`
        } else this.peice.style.display = "none"
    }
    getMoves() {
        //each move is an array with [x,y] change
        this.moves = []
        //pawn
        if(this.img === 0) {
            this.moves = [[0,-1]]
            let tile = game.board[`${this.cords.x-1},${this.cords.y-1}`]
            if(tile) if(tile.img >= 0 && tile.side != this.side) this.moves.push([-1,-1])
            tile = game.board[`${this.cords.x+1},${this.cords.y-1}`]
            if(tile) if(tile.img >= 0 && tile.side != this.side) this.moves.push([1,-1])
            tile = game.board[`${this.cords.x},${this.cords.y-1}`]
            if(this.side === 0) tile = game.board[`${this.cords.x},${this.cords.y+1}`]
            if(!this.hasmoved && tile.img === -1) this.moves.push([0,-2])
            if(this.side === 0) {
                this.moves.forEach((move) => {
                    move[1] = 0-move[1]
                })
            }
        }
        //knight
        if(this.img === 1) this.moves = [[1,2],[-1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1]]
        //bishop & queen
        if(this.img === 2 || this.img === 4) {
            for(let i=1; i<8; i++) {
                this.moves.push([i,i])
                let tile = game.board[`${this.cords.x+i},${this.cords.y+i}`]
                if(!tile) continue
                if(tile.img >= 0) i=8
            }
            for(let i=1; i<8; i++) {
                this.moves.push([-i,i])
                let tile = game.board[`${this.cords.x-i},${this.cords.y+i}`]
                if(!tile) continue
                if(tile.img >= 0) i=8
            }
            for(let i=1; i<8; i++) {
                this.moves.push([-i,-i])
                let tile = game.board[`${this.cords.x-i},${this.cords.y-i}`]
                if(!tile) continue
                if(tile.img >= 0) i=8
            }
            for(let i=1; i<8; i++) {
                this.moves.push([i,-i])
                let tile = game.board[`${this.cords.x+i},${this.cords.y-i}`]
                if(!tile) continue
                if(tile.img >= 0) i=8
            }
        }
        //rook & queen
        if(this.img === 3 || this.img === 4) {
            for(let i=1; i<8; i++) {
                this.moves.push([i,0])
                let tile = game.board[`${this.cords.x+i},${this.cords.y}`]
                if(!tile) continue
                if(tile.img >= 0) i=8
            }
            for(let i=1; i<8; i++) {
                this.moves.push([-i,0])
                let tile = game.board[`${this.cords.x-i},${this.cords.y}`]
                if(!tile) continue
                if(tile.img >= 0) i=8
            }
            for(let i=1; i<8; i++) {
                this.moves.push([0,i])
                let tile = game.board[`${this.cords.x},${this.cords.y+i}`]
                if(!tile) continue
                if(tile.img >= 0) i=8
            }
            for(let i=1; i<8; i++) {
                this.moves.push([0,-i])
                let tile = game.board[`${this.cords.x},${this.cords.y-i}`]
                if(!tile) continue
                if(tile.img >= 0) i=8
            }
        }
        if(this.img === 5) {
            this.moves.push([-1,1])
            this.moves.push([0,1])
            this.moves.push([1,1])
            this.moves.push([-1,0])
            this.moves.push([1,0])
            this.moves.push([-1,-1])
            this.moves.push([0,-1])
            this.moves.push([1,-1])
        }

        //Check if each option is moveable
        let newmoves = []
        this.moves.forEach((move) => {
            let tile = game.board[`${move[0]+this.cords.x},${move[1]+this.cords.y}`]
            if(!tile) return
            if(tile.side === this.side && tile.img >= 0) return
            move[0] += this.cords.x
            move[1] += this.cords.y
            newmoves.push(move)
        })
        this.moves = newmoves
    }
    isMove(x,y) {
        this.getMoves()
        let is = false
        this.moves.forEach((move) => {
            if(move[0] === x && move[1] === y) is = true
        })
        return is
    }
}

class Game {
    constructor(side, urldata) {
        this.board = {}
        this.side = side+1
        this.side %= 2

        this.outer = document.getElementById("content")

        this.inner = document.createElement("div")
        this.inner.id = "board"
        this.outer.appendChild(this.inner)

        this.hand = undefined

        for(let y=0; y<8; y++) {
            let row = document.createElement("div")
            for(let x=0; x<8; x++) {
                let side=0
                if(y>4) side=1

                let img = -1
                if(y==1 || y==6) img = 0
                if((x==0 || x==7) && (y==0 || y==7)) img=3
                if((x==1 || x==6) && (y==0 || y==7)) img=1
                if((x==2 || x==5) && (y==0 || y==7)) img=2
                if((x==3) && (y==0 || y==7)) img=4
                if((x==4) && (y==0 || y==7)) img=5
                
                if(urldata) {
                    if(urldata[`${x},${y}`]) {
                        img = parseInt(urldata[`${x},${y}`].img)
                        side = parseInt(urldata[`${x},${y}`].side)
                    } else {
                        img = -1
                        side = 0
                    }
                }

                let tile
                if(this.side) tile = new Tile(x,y,img,side,true)
                else tile = new Tile(x,y,img,side)
                tile.element.addEventListener("click", () => {
                    this.clearMarkup()
                    if(!game.hand) {
                        if(tile.img === -1) return
                        game.hand = tile
                        tile.markup.style = "background-color: yellow; display: block;"
                        game.hand.moves.forEach((move) => {
                            game.board[`${move[0]},${move[1]}`].markup.style = "background-color: yellow; display: block;"
                        })
                    } else {
                        //movement rules
                        if(tile === game.hand) {
                            game.hand = undefined
                            return
                        }
                        if(!game.hand.isMove(tile.cords.x, tile.cords.y)) {
                            game.hand = undefined
                            return
                        }
                        if(tile.img>=0 && tile.side === game.hand.side) return
                        //swap peices
                        let oldhand = new Tile(game.hand.cords.x,game.hand.cords.y, game.hand.img, game.hand.side)
                        game.board[`${game.hand.cords.x},${game.hand.cords.y}`].update(tile)
                        game.board[`${tile.cords.x},${tile.cords.y}`].update(oldhand)
                        game.hand = undefined
                        game.makeLink()
                    }
                })
                this.board[`${x},${y}`] = tile
                row.appendChild(tile.element)
                tile.element.addEventListener("contextmenu", (event) => {
                    event.preventDefault()
                    if(tile.markup.style.cssText === "") tile.markup.style = "background-color: red; display: block;"
                    else tile.markup.style = ""
                })
            }
            if(this.side === 0) this.inner.prepend(row)
            else this.inner.appendChild(row)
        }
    }
    getMoves() {
        Object.keys(this.board).forEach(key => {
            let x, y
            let temp = ""
            key.split("").forEach((char) => {
                if(char == ",") {
                    x = parseInt(temp)
                    temp = ""
                } else temp += char
            })
            y = parseInt(temp)
            this.board[`${x},${y}`].getMoves()
        })
    }
    clearMarkup() {
        Object.keys(this.board).forEach(key => {
            let x, y
            let temp = ""
            key.split("").forEach((char) => {
                if(char == ",") {
                    x = parseInt(temp)
                    temp = ""
                } else temp += char
            })
            y = parseInt(temp)
            this.board[`${x},${y}`].getMoves()
            this.board[`${x},${y}`].markup.style = ""
        })
    }
    makeLink() {
        let data = ""
        Object.keys(this.board).forEach(key => {
            let x, y
            let temp = ""
            key.split("").forEach((char) => {
                if(char == ",") {
                    x = parseInt(temp)
                    temp = ""
                } else temp += char
            })
            y = parseInt(temp)
            let tile = this.board[`${x},${y}`]
            if(tile.img >= 0) {
                data += x
                data += y
                data += tile.img
                data += tile.side
            }
        })
        data += this.side.toString()
        let url = new URL(window.location)
        url.searchParams.set("data", data)
        history.replaceState(null, "", url)
        navigator.clipboard.writeText(window.location)
    }
}


let data = new URLSearchParams(window.location.search).get('data')
let peices = {}
let side = 0
if(data) {
    side = parseInt(data[data.length-1])
    let chunk = ""
    for(let i=0; i<data.length-1; i++) {
        chunk += data[i]
        if(i%4===3) {
            let x = chunk[0]
            let y = chunk[1]
            let cords = `${x},${y}`
            let img = chunk[2]
            let side = chunk[3]
            peices[cords] = {img,side}
            chunk = ""
        }
    }
} else peices = undefined

let game = new Game(side,peices)
game.getMoves()

function resetGame() {
    let url = new URL(window.location)
    url.search = ""
    window.location = url
}