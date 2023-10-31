let canvas;
let cxt;

canvas = document.createElement("canvas");
cxt = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let gameover = false;
let score = 0;
let enemyLevel;
let scoreLevel;

//우주선 좌표
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;

//총알 좌표
let bulletList = [];
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.alive = true;
    this.init = function () {
        this.x = spaceshipX + 20;
        this.y = spaceshipY;
        bulletList.push(this);
    };
    this.update = function () {
        this.y -= 7
    };
    this.checkAlive = function(){
        if(this.y <= 0){
            this.alive = false;
        };
    }
    this.checkHit = function () {
        for (let i = 0; i < enemyList.length; i++) {
            if (enemyList[i].y >= this.y && enemyList[i].x <= this.x && enemyList[i].x + 60 >= this.x) {
                this.alive = false;
                score += scoreLevel;
                enemyList.splice(i, 1);
            };
        };
    };
};

//랜덤 숫자 생성
function random(min, max) {
    //0~400
    let randomNum = Math.floor(Math.random() * (max - min + 1) + min);
    return randomNum;
};

//적 좌표
let enemyList = [];
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.y = 0;
        this.x = random(0, canvas.width - 60);
        enemyList.push(this);
    };
    this.update = function () {
        this.y += enemyLevel;
        if (this.y >= canvas.height - 60) {
            gameover = true;
        };
    };
};


//각종 이미지
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = "img/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src = "img/spaceship.png";

    bulletImage = new Image();
    bulletImage.src = "img/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "img/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src = "img/gameover.png";
};

//방향키로 우주선 움직이기
let keydown = {};
function keyboardEventListener() {
    document.addEventListener("keydown", function (event) {
        keydown[event.keyCode] = true;
    });
    document.addEventListener("keyup", function (event) {
        delete keydown[event.keyCode];

        if (event.keyCode == 32) {
            createBullet();
        }
    });
};

//총알 생성
function createBullet() {
    let b = new Bullet();
    b.init();
};

//적 생성
function createEnemy() {
    const interval = setInterval(function () {
        let e = new Enemy();
        e.init();
    }, 1000);
}

function update() {
    if (37 in keydown) {      //왼쪽
        spaceshipX -= 5;
    }
    if (38 in keydown) {      //위쪽
        spaceshipY -= 5;
    }
    if (39 in keydown) {      //오른쪽
        spaceshipX += 5;
    }
    if (40 in keydown) {      //아래쪽
        spaceshipY += 5;
    };

    //캔버스 내에서만 이동 가능하도록 제한
    if (spaceshipX < 0) {
        spaceshipX = 0;
    }
    if (spaceshipX + 64 > canvas.width) {
        spaceshipX = canvas.width - 64;
    }
    if (spaceshipY < 0) {
        spaceshipY = 0;
    }
    if (spaceshipY + 64 > canvas.height) {
        spaceshipY = canvas.height - 64;
    }

    //총알 좌표 업데이트 (총알이 앞으로 나가게 하는 함수)
    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkAlive();
            bulletList[i].checkHit();
        };
    };

    //적 좌표 업데이트
    for (let j = 0; j < enemyList.length; j++) {
        enemyList[j].update();
    };

    //총알로 적을 맞춘 경우
    for (let k = 0; k < bulletList.length; k++) {
        for (let l = 0; l < enemyList.length; l++) {
            if (bulletList[k] == enemyList[l]) {
                delete bulletList[k];
                delete enemyList[l];
            };
        };
    };

    //적과 충돌한 경우
    for(let n=0; n<enemyList.length; n++){
        if(enemyList[n].y >= spaceshipY && enemyList[n].x <= spaceshipX && enemyList[n].x + 60 >= spaceshipX){
            gameover = true;
        }
    }
};

//배경이미지 랜더
function render() {
    cxt.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    cxt.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    cxt.fillText(`Score : ${score}`, 20, 40);
    cxt.fillStyle = "white";
    cxt.font = "20px Arial"

    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            cxt.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        };
    };

    for (let j = 0; j < enemyList.length; j++) {
        cxt.drawImage(enemyImage, enemyList[j].x, enemyList[j].y);
    };
}

function main() {
    if (!gameover) {
        update();   //좌표값 업데이트
        render();   //화면에 그리기
        requestAnimationFrame(main);    //애니메이션
    } else {
        cxt.drawImage(gameOverImage, canvas.width / 2 - 150, canvas.height / 2 - 150);
        document.getElementById("info").classList.remove("hide");
    }
};

//게임 시작
function startGame(value) {
    let level = value;
    switch (level) {
        case "easy":
            enemyLevel = 1;
            scoreLevel = 1;
            break;
        case "normal":
            enemyLevel = 3;
            scoreLevel = 2;
            break;
        case "hard":
            enemyLevel = 5;
            scoreLevel = 3;
            break;
    };
    createEnemy();
    document.getElementById("button").remove();
};

loadImage();
keyboardEventListener();
main();