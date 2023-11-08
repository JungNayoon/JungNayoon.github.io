var gameOver = false;
var score = 0;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 300;

var dinoImg, blockImg, backgroundImg, gameOverImg, redHeartImg, blackHeartImg;
function loadImage(){
    dinoImg = new Image();
    dinoImg.src = "image/dinosaur.png";
    blockImg = new Image();
    blockImg.src = "image/block.png";
    backgroundImg = new Image();
    backgroundImg.src = "image/background.jpg"
    gameOverImg = new Image();
    gameOverImg.src = "image/gameover.png";
    redHeartImg = new Image();
    redHeartImg.src = "image/redHeart.png";
    blackHeartImg = new Image();
    blackHeartImg.src = "image/blackHeart.png";
}

var dino = {
    x : 40,
    y : 200,
    width : 50,
    height : 50,
    draw(){
        ctx.drawImage(dinoImg, this.x, this.y)
    },
    jump(){
        dino.y = dino.y -3;
    },
    down(){
        dino.y = dino.y +3;
    }
};

class Block {
    constructor(){
        this.x = 400;
        this.y = 200;
        this.width = 50;
        this.height = 50;
        //this.speed = 100;
    };
    draw(){
        ctx.drawImage(blockImg, this.x, this.y);
    }
};

var Heart = {
    life : 5,
}

var timer = 0;
var blocks = [];

//장애물, 공룡 위치 업데이트
function update(){
    timer++;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //장애물 1개씩 생성
    if(timer % 130 === 0){
        var block = new Block();
        blocks.push(block);

    };
    
    //공룡 점프
    if(isJump == true){
        //dino.y = dino.y -3;
        dino.jump();
        jumpTimer++;
    }
    if(jumpTimer > 50){
        isJump = false;
        dino.down();
    }
    if(dino.y > 200){
        dino.y = 200;
    }
    if(dino.y <= -50){
        dino.y = 0;
    }
    dino.draw();
    checkHit();
}

var isJump = false;
var jumpTimer = 0;

//스페이스바 이벤트
document.addEventListener('keydown', function(e){
    var key = e.keyCode;
    if(key === 32){
        if(dino.y == 200){
            isJump = true;
            jumpTimer = 0;
        };
    };
});

//충돌 확인
function checkHit(){
    blocks.forEach(function(a, i, o){
        var x = a.x - (dino.x + 40);
        var y = a.y - (dino.y + 20);
        if(x < 0 && y < 0){
            Heart.life--;
            o.splice(i, 1);
            if(Heart.life == 0){
                gameOver = true;
                document.getElementById("retry").style.display = "block";
            };
        }
    })
};

//다시하기버튼
function retry(){
    location.reload();
};

//배경 이동
var background_x = 0;

//화면에 랜더링
function render(){
    ctx.drawImage(backgroundImg, background_x--, 0, 1920, canvas.height);
    background_x = background_x - 0.5;
    if(background_x <= -1420){
        background_x = 0;
    };

    dino.draw();
    ctx.fillText(`Score : ${score}`, 20, 40);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial"

    //block array에 있는 것 모두 그리기
    blocks.forEach(function(a, i, o){
        if(a.x < 0){
            o.splice(i, 1);
            score =  score + 100;
        }
        a.x = a.x -1.5;
        a.draw();
    });

    for(let i=0; i<Heart.life; i++){
        ctx.drawImage(redHeartImg, 15+(i*20), 50, 20, 20);
    };
};

function main(){
    if(!gameOver){
        update();
        render();
        requestAnimationFrame(main);
    } else{
        ctx.drawImage(gameOverImg, (canvas.width-200)/2, (canvas.height-200)/2, 200, 200);
    }
}

loadImage();
render();
main();