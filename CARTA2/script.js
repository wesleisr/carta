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
const LIGHT_RADIUS = 3;

/* MEMÓRIAS */

const memories = [

{
title:"Natal 2021",
text:"Essa é a nossa primeira foto, né? Engraçado como a maioria das fotos que temos são parecidas com essa... é a nossa marca registrada? Acho que é a minha pelo menos."
},

{
title:"Maio 2022",
text:"Tem uma foto desse dia em que estamos nós dois e mais três pessoas. Você lembra quem eram elas?"
},

{
title:"Dia dos Namorados 2022",
text:"Nosso primeiro Dia dos Namorados!"
},

{
title:"Julho 2022",
text:"Uma viagem, um hotel. Fazer esse treco me fez perceber que a minha memoria é pior do que parece 🤔"
},

{
title:"Ainda Julho (de acordo com o google",
text:"De quem era essa festa de aniversário?"
},

{
title:"Setembro 2022",
text:"Comemorando o seu aniversário em Arraial"
},

{
title:"Outubro 2022",
text:"Provavelmente no central park"
},

{
title:"Outubro 2022",
text:"Nosso ritual do dia 19... prometo retomar quando as coisas melhorarem"
},

{
title:"Dezembro 2022",
text:"Floresta dos Lagos, lembro de muitos mosquitos e de uma cachoeira bem decepcionante. fora isso foi legal."
},

{
title:"Fevereiro 2023",
text:"Isso foi em caraíva? a gente tem que visitar lá de noite para ver se é bom"
},

{
title:"Junho 2023",
text:"Um sushi em Trancoso."
},

{
title:"Julho 2023",
text:"Provavelmente um dia 19"
},

{
title:"Agosto 2023",
text:"Aniversário da Lara! O melhor desse dia foi a banheira de hidromassagem."
},

{
title:"Junho 2024",
text:"Outro hotel, outra aventura, outro lugar que eu não lembro onde é 😂."
},

{
title:"Dezembro 2025",
text:"Do primeiro ao mais recente, o melhor presente de todos é ter você comigo em todos os natais."
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

let SIZE = 9;

const mazeSizes = [
11, 11,
13, 13,
15, 15,
17, 17,
19, 19,
21, 21,
23, 23,
25
];

let maze = [];

let player = {
    x:1,
    y:1
};

let key = null;

let door = null;

let hasKey = false;

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

function addLoops(amount){

    for(let i=0;i<amount;i++){

        let x;
        let y;

        do{

            x = Math.floor(Math.random()*(SIZE-2))+1;
            y = Math.floor(Math.random()*(SIZE-2))+1;

        }while(
            maze[y][x] === 0
        );

        maze[y][x] = 0;

    }

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
function getRandomPathCell(){

    let x;
    let y;

    do{

        x = Math.floor(Math.random() * SIZE);
        y = Math.floor(Math.random() * SIZE);

    }while(

        maze[y][x] !== 0 ||

        (x === 1 && y === 1)

    );

    return {x,y};

}
function drawGlow(x,y,radius,color){

    const gradient =
    ctx.createRadialGradient(

        x,
        y,
        0,

        x,
        y,
        radius

    );

    gradient.addColorStop(
        0,
        color
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

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

    if(!hasKey){

    ctx.font =
    `${cell * 0.7}px Arial`;

    drawGlow(

    key.x * cell + cell/2,

    key.y * cell + cell/2,

    cell * 6,

    "rgba(255,255,100,0.8)"

);
    ctx.fillText(

        "🔑",

        key.x * cell +
        cell * 0.15,

        key.y * cell +
        cell * 0.8

    );

}

ctx.font =
`${cell * 0.7}px Arial`;

drawGlow(

    door.x * cell + cell/2,

    door.y * cell + cell/2,

    cell * 3.5,

    "rgba(100,180,255,0.7)"

);
ctx.fillText(

    "[🚪]",

    door.x * cell +
    cell * 0.15,

    door.y * cell +
    cell * 0.8

);



    /* jogador */

    ctx.font =
`${cell * 0.9}px Arial`;

ctx.fillText(

    "🧍‍♀️",

    player.x * cell +
    cell * 0.05,

    player.y * cell +
    cell * 0.85

);

/* SOMBRA COM GRADIENTE */

const lightX =
player.x * cell + cell/2;

const lightY =
player.y * cell + cell/2;

const darkness =
ctx.createRadialGradient(

    lightX,
    lightY,
    0,

    lightX,
    lightY,
    cell * LIGHT_RADIUS

);

darkness.addColorStop(
    0,
    "rgba(0,0,0,0)"
);

darkness.addColorStop(
    0.5,
    "rgba(0,0,0,0.35)"
);

darkness.addColorStop(
    1,
    "rgba(0,0,0,0.96)"
);

ctx.fillStyle = darkness;

ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
);

console.log("DESENHANDO ESCURIDÃO");

}
function getRandomPathCellInArea(
    minX,
    maxX,
    minY,
    maxY
){

    let x;
    let y;

    do{

        x = Math.floor(
            Math.random() *
            (maxX - minX + 1)
        ) + minX;

        y = Math.floor(
            Math.random() *
            (maxY - minY + 1)
        ) + minY;

    }while(

        maze[y][x] !== 0 ||

        (x === 1 && y === 1)

    );

    return {x,y};

}
function getFarthestCells(){

    const visited = [];

    for(let y=0;y<SIZE;y++){

        visited[y] = [];

        for(let x=0;x<SIZE;x++){

            visited[y][x] = -1;

        }
    }

    const queue = [];

    queue.push({x:1,y:1});

    visited[1][1] = 0;

    while(queue.length){

        const current = queue.shift();

        const directions = [

            [0,-1],
            [1,0],
            [0,1],
            [-1,0]

        ];

        for(const [dx,dy] of directions){

            const nx = current.x + dx;
            const ny = current.y + dy;

            if(

                nx >= 0 &&
                ny >= 0 &&
                nx < SIZE &&
                ny < SIZE &&

                maze[ny][nx] === 0 &&

                visited[ny][nx] === -1

            ){

                visited[ny][nx] =
                visited[current.y][current.x] + 1;

                queue.push({
                    x:nx,
                    y:ny
                });

            }

        }

    }

    const cells = [];

    for(let y=0;y<SIZE;y++){

        for(let x=0;x<SIZE;x++){

            if(

                maze[y][x] === 0 &&

                !(x === 1 && y === 1)

            ){

                cells.push({

                    x,
                    y,

                    distance:
                    visited[y][x]

                });

            }

        }

    }

    cells.sort(
        (a,b)=>
        b.distance - a.distance
    );

    return cells;

}
function loadMaze(){

    document
    .getElementById("controls")
    .style.display = "block";

    document.getElementById(
        "phaseInfo"
    ).innerText =
    `FASE ${currentPhase} / 15`;

    SIZE = mazeSizes[
        currentPhase - 1
    ];

    generateMaze();
    addLoops(
    Math.floor(SIZE * 1.5)
    );

    player.x = 1;
    player.y = 1;

    const farthest =
    getFarthestCells();

    const positions =
getFarthestCells();

key = {

    x: positions[0].x,
    y: positions[0].y

};

door = {

    x: positions[
        Math.floor(
            positions.length * 0.3
        )
    ].x,

    y: positions[
        Math.floor(
            positions.length * 0.3
        )
    ].y

};

hasKey = false;

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

    const nx = player.x + dx;
    const ny = player.y + dy;

    if(
        maze[ny] &&
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

    // PEGOU A CHAVE

    if(

        !hasKey &&

        player.x === key.x &&

        player.y === key.y

    ){

        hasKey = true;

        document
        .getElementById("keySound")
        .play();

        showMessage(
            "🗝️ Chave Encontrada!"
        );

        drawMaze();

        return;

    }

    // ENCONTROU A PORTA

    if(

        player.x === door.x &&

        player.y === door.y

    ){

        if(hasKey){

            document
            .getElementById("unlockSound")
            .play();

            showMessage(
                "🔓 Memória Desbloqueada!"
            );

            setTimeout(()=>{

                unlockMemory();

            },1500);

        }else{

            showMessage(
                "🚪 Encontre a chave primeiro!"
            );

        }

    }

}



/* TESTE DE DESBLOQUEIO */

function unlockMemory(){
    

    document
.getElementById("controls")
.style.display = "none";

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

    victoryScreen.style.display="flex";

    return;
}

    memoryScreen.style.display="none";

    gameScreen.style.display="flex";

    loadMaze();

};


document
.getElementById("upBtn")
.addEventListener(
    "click",
    ()=>moveDirection(0,-1)
);

document
.getElementById("downBtn")
.addEventListener(
    "click",
    ()=>moveDirection(0,1)
);

document
.getElementById("leftBtn")
.addEventListener(
    "click",
    ()=>moveDirection(-1,0)
);

document
.getElementById("rightBtn")
.addEventListener(
    "click",
    ()=>moveDirection(1,0)
);


document
.getElementById("showLetterBtn")
.onclick = () => {

    victoryScreen.style.display = "none";

    finalScreen.style.display = "flex";

};
document
.getElementById("backToVictoryBtn")
.onclick = () => {

    finalScreen.style.display = "none";

    victoryScreen.style.display = "flex";

};
const music =
document.getElementById("bgMusic");

const musicBtn =
document.getElementById("musicBtn");

musicBtn.onclick = () => {

    if(music.paused){

        music.play();

        musicBtn.innerText =
        "⏸️ Pausar Música";

    }else{

        music.pause();

        musicBtn.innerText =
        "🎵 Tocar Música";

    }

};
function showMessage(text){

    const msg =
    document.getElementById("gameMessage");

    msg.innerText = text;

    msg.classList.add("show");

    setTimeout(()=>{

        msg.classList.remove("show");

    },1200);

}
