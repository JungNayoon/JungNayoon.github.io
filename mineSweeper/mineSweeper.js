const $timer = document.querySelector("#timer");
const $tbody = document.querySelector("#table tbody");
const $result = document.querySelector("#result");
const $form = document.querySelector("#form");

//지뢰 수
let row;
let cell;
let bomb;

// 칸의 종류에 따라 코드명 부여
const CODE = {
    NORMAL: -1,     //닫힌칸(지뢰 X)
    QUESTION: -2,   //물음표(지뢰 X)
    FLAG: -3,        //깃발(지뢰 X)
    QUESTION_BOMB: -4,  //물음표(지뢰 O)
    FLAG_BOMB: -5,      //깃발(지뢰 O)
    BOMB: -6,           //닫힌칸(지뢰 O)
    OPENED: 0           //열린칸(0~8까지)
};

//변수
let data;
let openCount = 0;
let startTime;
let interval;

function onSubmit(event) {
    
    event.preventDefault();
    row = parseInt($("#row").val());
    cell = parseInt($("#cell").val());
    bomb = parseInt($("#bomb").val());
    if(bomb > row*cell){
        alert("지뢰의 개수가 칸의 개수를 초과합니다.\n다시입력해주세요.");
        return;
    };
    
    event.target.row.value = '';
    event.target.cell.value = '';
    event.target.bomb.value = '';
    
    $tbody.innerHTML = '';

    openCount = 0;

    startGame();
    
    //타이머 사용
    startTime = new Date();
    interval = setInterval(() => {
        const time = Math.floor((new Date() - startTime) / 1000);
        $timer.textContent = `${time}초`;
    }, 1000);
};

$form.addEventListener('submit', onSubmit);

function restart(){
    location.reload();
};

//지뢰 심기
function plantBomb() {

    //10*10 테이블을 위한 인덱스 만들기
    const candidate = Array(row * cell).fill().map((e, i) => i);

    //지뢰 넣을 랜덤 인덱스 10개 뽑기
    const shuffle = []; //뽑은 랜덤 인덱스 저장할 배열
    for (let i = 0; i < bomb; i++) {
        const random = Math.floor(Math.random() * candidate.length);
        const choice = candidate.splice(random, 1)[0];
        shuffle.push(choice);
    };
    console.log(shuffle);

    //모든 칸에 NOMAL 코드 부여하기
    const data = [];    //최종 데이터
    for (let i = 0; i < row; i++) {
        const normal = [];
        data.push(normal);
        for (let j = 0; j < cell; j++) {
            normal.push(CODE.NORMAL);
        };
    };

    //뽑아 놓은 지뢰 인덱스에 맞게 BOMB 코드 부여하기
    for (let i = 0; i < shuffle.length; i++) {
        let rowNum = Math.floor(shuffle[i] / row);
        let cellNum = shuffle[i] % row;

        data[rowNum][cellNum] = CODE.BOMB;
    };
    console.log(data);
    return data;
};

//마우스 오른쪽 버튼 이벤트 함수
function clickMouseRight(event) {
    event.preventDefault();
    const target = event.target;

    const rowIndex = target.parentNode.rowIndex;
    const cellIndex = target.cellIndex;
    const cellData = data[rowIndex][cellIndex];

    if (cellData === CODE.BOMB) {  //지뢰면 물음표지뢰로
        data[rowIndex][cellIndex] = CODE.QUESTION_BOMB;
        target.className = "question";
        target.textContent = '?';
    } else if (cellData === CODE.QUESTION_BOMB) {  //물음표지뢰면 깃발지뢰로
        data[rowIndex][cellIndex] = CODE.FLAG_BOMB;
        target.className = "flag";
        target.textContent = '🚩';
    } else if (cellData === CODE.FLAG_BOMB) {  //깃발지뢰면 지뢰로
        data[rowIndex][cellIndex] = CODE.BOMB;
        target.className = "";
        target.textContent = '';
    } else if (cellData === CODE.NORMAL) {  //일반이면 물음표로
        data[rowIndex][cellIndex] = CODE.QUESTION;
        target.className = "question";
        target.textContent = '?';
    } else if (cellData === CODE.QUESTION) {  //물음표면 깃발로
        data[rowIndex][cellIndex] = CODE.FLAG;
        target.className = "flag";
        target.textContent = '🚩';
    } else if (cellData === CODE.FLAG) {  //깃발이면 일반으로
        data[rowIndex][cellIndex] = CODE.NORMAL;
        target.className = "";
        target.textContent = '';
    };
};

//갯수 세기 함수
function countBomb(rowIndex, cellIndex) {
    const bombs = [CODE.BOMB, CODE.FLAG_BOMB, CODE.QUESTION_BOMB];
    let i = 0;

    bombs.includes(data[rowIndex - 1]?.[cellIndex - 1]) && i++;
    bombs.includes(data[rowIndex - 1]?.[cellIndex]) && i++;
    bombs.includes(data[rowIndex - 1]?.[cellIndex + 1]) && i++;
    bombs.includes(data[rowIndex][cellIndex - 1]) && i++;
    bombs.includes(data[rowIndex][cellIndex + 1]) && i++;
    bombs.includes(data[rowIndex + 1]?.[cellIndex - 1]) && i++;
    bombs.includes(data[rowIndex + 1]?.[cellIndex]) && i++;
    bombs.includes(data[rowIndex + 1]?.[cellIndex + 1]) && i++;

    return i;
};

// 주변 칸 열기
function open(rowIndex, cellIndex) {
    //클릭한 target 찾기
    const target = $tbody.children[rowIndex]?.children[cellIndex];

    //한 번 열린 곳은 오픈 금지
    if (data[rowIndex]?.[cellIndex] >= 0) {
        return;
    };

    if (!target) {
        return;
    };

    const count = countBomb(rowIndex, cellIndex);
    target.textContent = count || '';
    target.className = 'opened';
    data[rowIndex][cellIndex] = count;
    openCount++;

    //승리 표시
    if (openCount === row * cell - bomb) {
        const time = Math.floor((new Date() - startTime) / 1000);
        clearInterval(interval);

        $tbody.removeEventListener('contextmenu', clickMouseRight);
        $tbody.removeEventListener('click', clickMouseLeft);

        setTimeout(() => {
            alert(`승리!! ${time}초가 걸렸습니다.`)
        }, 500);
    };

    return count;
};

function openAround(rowIndex, cellIndex) {
    //콜스택 초과 방지
    setTimeout(() => {
        //클릭한 곳 주변 8개 칸 열기
        const count = open(rowIndex, cellIndex);

        //클릭한 곳에 지뢰가 없다면 주변 8개 칸 열기
        if (count === 0) {
            openAround(rowIndex - 1, cellIndex - 1);
            openAround(rowIndex - 1, cellIndex);
            openAround(rowIndex - 1, cellIndex + 1);
            openAround(rowIndex, cellIndex - 1);
            openAround(rowIndex, cellIndex + 1);
            openAround(rowIndex + 1, cellIndex - 1);
            openAround(rowIndex + 1, cellIndex);
            openAround(rowIndex + 1, cellIndex + 1);
        };
    }, 0);
};

//마우스 왼쪽 버튼 이벤트 함수
function clickMouseLeft(event) {
    const target = event.target;
    const rowIndex = target.parentNode.rowIndex;
    const cellIndex = target.cellIndex;
    const cellData = data[rowIndex][cellIndex];

    //일반이면 주변칸 열고 갯수 표시
    if (cellData === CODE.NORMAL) {
        openAround(rowIndex, cellIndex);
    }
    //지뢰면 종료
    else if (cellData === CODE.BOMB) {
        clearInterval(interval);
        target.textContent = '💣';
        target.className = 'bomb';
        $tbody.removeEventListener("contextmenu", clickMouseRight);
        $tbody.removeEventListener("click", clickMouseLeft);
        alert("실패! 재도전하십시오.");
    };
};

//게임시작
function startGame() {
    data = plantBomb();

    data.forEach((row) => {
        const $tr = document.createElement("tr");
        row.forEach((cell) => {
            const $td = document.createElement("td");
            if (cell === CODE.BOMB) {
                //$td.textContent = "X";
            };
            $tr.append($td);
        });
        $tbody.append($tr);
    });

    //마우스 오른쪽 버튼 이벤트 등록
    $tbody.addEventListener("contextmenu", clickMouseRight);
    //마우스 왼쪽 버튼 이벤트 등록
    $tbody.addEventListener("click", clickMouseLeft);
};













