const startScreen =
document.getElementById("startScreen");

const gameScreen =
document.getElementById("gameScreen");

const memoryScreen =
document.getElementById("memoryScreen");

const finalScreen =
document.getElementById("finalScreen");

const victoryScreen =
document.getElementById("victoryScreen");

let currentPhase = 1;

let touchStartX = 0;
let touchStartY = 0;

const SWIPE_MIN_DISTANCE = 30;

/* MEMÓRIAS */

const memories = [

{
title:"FOTO 1",
text:"EDITAR MEMÓRIA 1"
},

{
title:"FOTO 2",
text:"EDITAR MEMÓRIA 2"
},

{
title:"FOTO 3",
text:"EDITAR MEMÓRIA 3"
},

{
title:"FOTO 4",
text:"EDITAR MEMÓRIA 4"
},

{
title:"FOTO 5",
text:"EDITAR MEMÓRIA 5"
},

{
title:"FOTO 6",
text:"EDITAR MEMÓRIA 6"
},

{
title:"FOTO 7",
text:"EDITAR MEMÓRIA 7"
},

{
title:"FOTO 8",
text:"EDITAR MEMÓRIA 8"
},

{
title:"FOTO 9",
text:"EDITAR MEMÓRIA 9"
},

{
title:"FOTO 10",
text:"EDITAR MEMÓRIA 10"
},

{
title:"FOTO 11",
text:"EDITAR MEMÓRIA 11"
},

{
title:"FOTO 12",
text:"EDITAR MEMÓRIA 12"
},

{
title:"FOTO 13",
text:"EDITAR MEMÓRIA 13"
},

{
title:"FOTO 14",
text:"EDITAR MEMÓRIA 14"
},

{
title:"FOTO 15",
text:"EDITAR MEMÓRIA 15"
}

];

/* START */

document
.getElementById("startBtn")
.onclick = () => {

    startScreen.style.display = "none";

    gameScreen.style.display = "flex";

    loadMaze();

};

/* TESTE */

let canvas =
document.getElementById("mazeCanvas");

let ctx =
canvas.getContext("2d");

const SIZE = 21;

let maze = [];

let player = {
    x:1,
    y:1
};

let exit = {
    x:SIZE-2,
    y:SIZE-2
};

function generateMaze(){

    maze = [];

    for(let y=0;y<SIZE;y++){

        maze[y] = [];

        for(let x=0;x<SIZE;x++){

            maze[y][x] = 1;

        }
    }

    carve(1,1);

}

function carve(x,y){

    maze[y][x] = 0;

    let directions = [

        [0,-2],
        [2,0],
        [0,2],
        [-2,0]

    ];

    directions.sort(
        ()=>Math.random()-0.5
    );

    for(let [dx,dy] of directions){

        let nx = x + dx;
        let ny = y + dy;

        if(

            nx > 0 &&
            ny > 0 &&
            nx < SIZE-1 &&
            ny < SIZE-1 &&
            maze[ny][nx] === 1

        ){

            maze[y + dy/2][x + dx/2] = 0;

            carve(nx,ny);

        }
    }
}

function drawMaze(){

    canvas.width = 500;
    canvas.height = 500;

    const cell =
    canvas.width / SIZE;

    ctx.fillStyle = "black";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for(let y=0;y<SIZE;y++){

        for(let x=0;x<SIZE;x++){

            if(maze[y][x] === 1){

                ctx.fillStyle = "white";

                ctx.fillRect(

                    x*cell,
                    y*cell,
                    cell,
                    cell

                );
            }
        }
    }

    /* saída */

    ctx.fillStyle = "#00ff66";

    ctx.beginPath();

    ctx.arc(

        exit.x*cell + cell/2,
        exit.y*cell + cell/2,

        cell/3,

        0,
        Math.PI*2

    );

    ctx.fill();

    /* jogador */

    ctx.fillStyle = "red";

    ctx.beginPath();

    ctx.arc(

        player.x*cell + cell/2,
        player.y*cell + cell/2,

        cell/3,

        0,
        Math.PI*2

    );

    ctx.fill();

}

function loadMaze(){

    document.getElementById(
        "phaseInfo"
    ).innerText =
    `FASE ${currentPhase} / 15`;

    generateMaze();

    player.x = 1;
    player.y = 1;

    exit.x = SIZE-2;
    exit.y = SIZE-2;

    drawMaze();

}

document.addEventListener(
    "keydown",
    (e)=>{

        if(e.key==="ArrowUp")
            moveDirection(0,-1);

        if(e.key==="ArrowDown")
            moveDirection(0,1);

        if(e.key==="ArrowLeft")
            moveDirection(-1,0);

        if(e.key==="ArrowRight")
            moveDirection(1,0);

    }
);

function moveDirection(dx,dy){

    const nx =
        player.x + dx;

    const ny =
        player.y + dy;

    if(

        maze[ny]

        &&

        maze[ny][nx] === 0

    ){

        player.x = nx;

        player.y = ny;

        drawMaze();

        checkWin();

    }

}

canvas.addEventListener(
    "touchstart",
    handleTouchStart,
    false
);

canvas.addEventListener(
    "touchend",
    handleTouchEnd,
    false
);

function handleTouchStart(event){

    touchStartX =
        event.changedTouches[0].screenX;

    touchStartY =
        event.changedTouches[0].screenY;

}

function handleTouchEnd(event){

    const touchEndX =
        event.changedTouches[0].screenX;

    const touchEndY =
        event.changedTouches[0].screenY;

    const dx =
        touchEndX - touchStartX;

    const dy =
        touchEndY - touchStartY;

    if(

        Math.abs(dx) <
        SWIPE_MIN_DISTANCE

        &&

        Math.abs(dy) <
        SWIPE_MIN_DISTANCE

    ){

        return;

    }

    if(Math.abs(dx) > Math.abs(dy)){

        if(dx > 0){

            moveDirection(1,0);

        }else{

            moveDirection(-1,0);

        }

    }else{

        if(dy > 0){

            moveDirection(0,1);

        }else{

            moveDirection(0,-1);

        }

    }

}

function checkWin(){

    if(

        player.x === exit.x &&
        player.y === exit.y

    ){

        unlockMemory();

    }

}



/* TESTE DE DESBLOQUEIO */

function unlockMemory(){

    gameScreen.style.display = "none";

    memoryScreen.style.display = "flex";

    document.getElementById(
        "memoryPhoto"
    ).src =
    `fotos/foto${currentPhase}.jpg`;

    document.getElementById(
        "memoryTitle"
    ).innerText =
    memories[currentPhase-1].title;

    document.getElementById(
        "memoryText"
    ).innerText =
    memories[currentPhase-1].text;

}

document
.getElementById("nextPhaseBtn")
.onclick = () => {

    currentPhase++;

    if(currentPhase > 15){

        memoryScreen.style.display="none";

        finalScreen.style.display="flex";

        return;
    }

    memoryScreen.style.display="none";

    gameScreen.style.display="flex";

    loadMaze();

};

document
.getElementById("finishBtn")
.onclick = () => {

    finalScreen.style.display="none";

    victoryScreen.style.display="flex";

};