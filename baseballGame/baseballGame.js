//변수
let data = [];
let myAnswer = [];
let checkCount = 0;

const $form = document.getElementById("#form");

window.onkeydown = (e) => {
    if(e.keyCode == 13){
        submit();
    };
};

// 무작위로 숫자 4개 뽑기
for(let i=0; i<4; i++){
    let num = Math.floor(Math.random()*9);
    if(data.includes(num)){
        i--;
    } else{
        data.push(num);
    };
};
console.log(data);

//초기화
function reset(){
    myAnswer = [];
};
function again(){
    location.reload();
}

//확인 버튼 클릭
function submit(){
    reset();
    let number = $("#number").val();
    if(number.length == 4){
        for(let i=0; i<number.length; i++){
            myAnswer.push(parseInt(number.slice(i, i+1)));
        };
        console.log(myAnswer);
        homerun();
    } else{
        alert("네 자리 숫자가 아닙니다.\n다시 입력해주세요.")
        reset();
    };

};

// 홈런 판단
function homerun(){
    let checkList=[];
    for(let i = 0; i<myAnswer.length; i++){
        let dataNum = data[i];
        let myNum = myAnswer[i];

        if(dataNum === myNum){
            checkList.push(true);
        } else{
            checkList.push(false);
        };
    };
    console.log(checkList);

    if(checkList.includes(false)){
        checkCount++;
        if(checkCount == 10){
            appendFail();
        }else{
            checkBallAndStrike(checkList);
        };
    } else{
        checkCount++;
        appendResult("홈런!!", true);
        showAgainBtn();
    };
};

//볼, 스트라이크, 아웃 판단
function checkBallAndStrike(checkList){
    let ball = 0;
    let strike = 0;
    let out = 0;

    for(let i=0; i<checkList.length; i++){
        
        if(checkList[i] == true){
            strike++;
        } else{
            if(data.includes(myAnswer[i])){
                ball++;
            }else{
                out++;
            }
        };
    };
    resultList= {
        'ball': ball,
        'strike' : strike,
        'out' : out,
    };
    appendResult(resultList, false)
};

//결과 추가
function appendResult(result, homerun){
    const p = document.createElement("p")
    let message;

    if(homerun == true){
        message = document.createTextNode(`${checkCount}회 ${$("#number").val()} : ${result}`);
    } else{
        if(result.out == 4){
            message = document.createTextNode(`${checkCount}회 ${$("#number").val()} : 아웃!`);
        } else{
            message = document.createTextNode(`${checkCount}회 ${$("#number").val()} : ${result.strike}스트라이크 ${result.ball}볼`);
        };
    };

    document.querySelector("#result").appendChild(p).appendChild(message);
    $("#number").val("");
};

//10번 시도했을 경우
function appendFail(){
    const p = document.createElement("p")
    let message = document.createTextNode(`${checkCount}회 ${$("#number").val()} : 실패!! 정답은 ${data.join(" ")}`);
    document.querySelector("#result").appendChild(p).appendChild(message);
    showAgainBtn();
};

function showAgainBtn(){
    document.getElementById("submit").classList.add("hide");
    document.getElementById("again").classList.remove("hide");
    $("#number").prop("disabled", true);
}
