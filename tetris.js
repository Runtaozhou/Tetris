let welcome = document.querySelector("#welcome")//h2 welcome to tetris tag
let nextItem = document.querySelector("#item")//next item prompt
let scoreText = document.querySelector("#num")//accessing the score
let content = document.querySelector(".content")//accessing the content
content.style.display ="none"
let score
const width =10
let gameboard = document.querySelector("#gameboard")//gameboard 
let startBtn = document.querySelector("#start_btn")
startBtn.addEventListener("click",renderGame)
createDivs()//adding divs 
createNextDivs()
let nextDivs = nextItem.querySelectorAll("div")
let divs = Array.from(gameboard.querySelectorAll("div"))
let currentPosition 
let currentColumn
let intervalId 
let currentSpeed
let curIndex
let checkerId
let background = document.createElement("audio")
background.src = "background.mp3"
background.setAttribute("loop",true)
let scored = document.createElement("audio")
scored.src = "hit.mp3"

let lTetro = {
    class :"l",
    rotation:[
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2],
        [width,width*2,width*2+1,width*2+2]
    ]

}
let zTetro = {
    class: "z",
    rotation:[
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
    ]

}
let sTetro = {
    class: "s",
    rotation:[
        [1,2,width+1,width+2],
        [1,2,width+1,width+2],
        [1,2,width+1,width+2],
        [1,2,width+1,width+2],
    ]
}
let tTetro = {
    class:"t",
    rotation:[
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]
}
let bTetro ={
    class:"b",
    rotation:[
        [0,1,2,3],
        [1,width+1,width*2+1,width*3+1],
        [0,1,2,3],
        [1,width+1,width*2+1,width*3+1],
    ]
}

const Tretros = [bTetro,lTetro,zTetro,sTetro,tTetro]
console.log(divs)
let currentDisplay
let currentPiece
let nextPiece
function createDivs(){
    for(let i=0;i<220;i++){
        let temp= document.createElement("div")
        temp.setAttribute("id",i)
        gameboard.appendChild(temp)
    }
}
function createNextDivs(){
    for(let i=0;i<100;i++){
        let temp =document.createElement("div")
        temp.setAttribute("id",i)
        nextItem.appendChild(temp)
    }
}
function renderGame(){
    startBtn.style.display = "none"
    welcome.style.visibility ="hidden"
    content.style.display = "flex"
    for(let i=210;i<220;i++){
        divs[i].classList.add("bottom")
    }
    background.play()
    document.addEventListener("keydown",handle)
    currentPiece = Tretros[Math.floor(Math.random()*Tretros.length)]
    nextPiece = Tretros[Math.floor(Math.random()*Tretros.length)]
    currentDisplay = 0
    score = 0
    scoreText.textContent = score
    currentPosition =3
    currentColumn =4*width
    intervalId = setInterval(moveTetris,300)
    

}
function drawNext(){
    nextPiece.rotation[0].forEach(element=>{
        nextDivs[element+3+currentColumn].classList.add(nextPiece.class)
    })
}
function clearNext(){
    nextDivs.forEach(element=>element.classList.remove(nextPiece.class))
}
function handle(e){
    if(e.keyCode===38){
        rotate()
    }
    else if(e.keyCode===39){
        moveRight()
        
    }
    else if(e.keyCode===37){
        moveLeft()
        
    }
}
function moveTetris(){
    undraw()
    currentPosition+=width
    if(currentPiece.rotation[currentDisplay].some(index=>divs[currentPosition+index+width].classList.contains("bottom"))||
    currentPiece.rotation[currentDisplay].some(index=>divs[currentPosition+index+width].classList.contains("bottom"))){
        draw()
        setTimeout(() => {
            freeze()
            gameOver()
            drawNext()
        }, 200);
        draw()
    }
    else{
        freeze()
        draw()
        gameOver()
        drawNext()
    }
    
    
}


function draw(){
    currentPiece.rotation[currentDisplay].forEach(index=>{
        divs[currentPosition+index].classList.add(currentPiece.class)
    })
}
function undraw(){
    currentPiece.rotation[currentDisplay].forEach(index=>{
        divs[currentPosition+index].classList.remove(currentPiece.class)
    })
}

function moveRight(){
    undraw()
    const rightEdge = currentPiece.rotation[currentDisplay].some(index=> (currentPosition+index)%width ===width-1)
    const collison = currentPiece.rotation[currentDisplay].some(index=> divs[currentPosition+index+1].classList.contains("frozen"))
    if(!rightEdge&&!collison){
        currentPosition++
    }
    draw()
    
}
function moveLeft(){
    undraw()
    const rightEdge = currentPiece.rotation[currentDisplay].some(index=> (currentPosition+index)%width ===0)
    const collison = currentPiece.rotation[currentDisplay].some(index=> divs[currentPosition+index-1].classList.contains("frozen"))
    if(!rightEdge&&!collison){
        currentPosition--
    }
    
    draw()
    
}
function rotate(){
    undraw()
    const rightEdge = currentPiece.rotation[currentDisplay].some(index=> (currentPosition+index)%width ===width-1)
    const leftEdge = currentPiece.rotation[currentDisplay].some(index=> (currentPosition+index)%width ===0)
    let rightCollision 
    let leftCollision 
    if(currentDisplay==3){
        currentDisplay=0
        rightCollision = currentPiece.rotation[currentDisplay].some(index=> (currentPosition+index)%width ===0)
        leftCollision = currentPiece.rotation[currentDisplay].some(index=> (currentPosition+index)%width ===width-1)
        Collision = currentPiece.rotation[currentDisplay].some(index=>divs[currentPosition+index].classList.contains("bottom"))||
        currentPiece.rotation[currentDisplay].some(index=>divs[currentPosition+index].classList.contains("frozen")) 
        console.log(Collision)
        if(rightEdge&&rightCollision||leftEdge&&leftCollision||Collision){
            currentDisplay=3
        }
    }
    else{
        currentDisplay++
        rightCollision = currentPiece.rotation[currentDisplay].some(index=> (currentPosition+index)%width ===0)
        leftCollision = currentPiece.rotation[currentDisplay].some(index=> (currentPosition+index)%width ===width-1)
        Collision = currentPiece.rotation[currentDisplay].some(index=>divs[currentPosition+index].classList.contains("bottom"))||
        currentPiece.rotation[currentDisplay].some(index=>divs[currentPosition+index].classList.contains("frozen")) 
        console.log(Collision)
        if(rightEdge&&rightCollision||leftEdge&&leftCollision||Collision){
            currentDisplay--
        }
    }
    
    draw()

}
function freeze(){
   
   if(currentPiece.rotation[currentDisplay].some(index=>divs[currentPosition+index+width].classList.contains("bottom"))||
   currentPiece.rotation[currentDisplay].some(index=>divs[currentPosition+index+width].classList.contains("frozen")) ){
        currentPiece.rotation[currentDisplay].forEach(index=>divs[currentPosition+index].classList.remove(currentPiece.class))
        currentPiece.rotation[currentDisplay].forEach(index=>divs[currentPosition+index].classList.add("frozen"))
        currentPosition =3
        currentPiece = nextPiece
        clearNext()
        nextPiece = Tretros[Math.floor(Math.random()*Tretros.length)]
        addScore()
   }

}
function gameOver(){

    for(let i=13;i<17;i++){
        if(divs[i].classList.contains("frozen")){
            clearInterval(intervalId)
            scoreText.textContent = "Game Over"
            document.removeEventListener("keydown",handle)
        }
    }


}

function addScore(){
    let consecutive = 0
    for(let curIndex = 0;curIndex<209;curIndex+=width){
        let row = [curIndex,curIndex+1,curIndex+2,curIndex+3,curIndex+4,curIndex+5,curIndex+6,curIndex+7,curIndex+8,curIndex+9]
        row.forEach(index=>console.log(divs[index]))
        if(row.every(element=>divs[element].classList.contains("frozen"))){
            console.log("score!")
            consecutive++
            row.forEach(index=>{
                divs[index].classList.remove("frozen")
            })
            
            const squareRemoved = divs.splice(curIndex,width)
            divs = squareRemoved.concat(divs)
            divs.forEach(cell=>gameboard.appendChild(cell))

        }
    }
    if(consecutive===1){
        scored.play()
        score+=10
        scoreText.textContent = score
    }
    else if(consecutive===2){
        scored.play()
        score+=40
        scoreText.textContent = score
    }
    else if(consecutive===3){
        scored.play()
        score+=90
        scoreText.textContent = score
    }
    else if(consecutive===4){
        scored.play()
        score+=160
        scoreText.textContent = score
    }
}
