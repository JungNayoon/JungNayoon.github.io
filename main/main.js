$(function () {
    //Top 버튼
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $("#topBtn, #bottomBtn").fadeIn();
        } else {
            $("#topBtn, #bottomBtn").fadeOut();
        }
    })

    $("#topBtn").on("click", function () {
        $("html, body").animate({
            scrollTop: 0
        }, 500)
    })
    $("#bottomBtn").on("click", function () {
        $("html, body").animate({
            scrollTop: $(document).height()
        }, 500)
    })

    //상단 고정 메뉴 
    $(window).scroll(function () {
        let scrT = $(this).scrollTop();
        let menuTop = $("#navMenu").position().top;

        if (scrT > menuTop) {
            $("#navMenu").addClass("fixed");
        } else {
            $("#navMenu").removeClass("fixed");
        }
    });

    $(".menu").on("click", function () {
        let num = $(this).index();
        let top;
        if (num == 0) {
            top = $("#checkBox").position().top - 50;
            $("html, body").animate({
                scrollTop: top
            }, 500);
        }
        else if (num == 1) {
            top = $("#calculator").position().top - 50;
            $("html, body").animate({
                scrollTop: top
            }, 500);
        }
        else if (num == 2) {
            top = $("#number").position().top - 50;
            $("html, body").animate({
                scrollTop: top
            }, 500);
        }
        else if (num == 3) {
            top = $("#chat").position().top - 50;
            $("html, body").animate({
                scrollTop: top
            }, 500);
        }
        else if (num == 4) {
            top = $("#size").position().top - 50;
            $("html, body").animate({
                scrollTop: top
            }, 500);
        }
        else if (num == 5) {
            location.href = "https://jungnayoon.github.io/mineSweeper/mineSweeper";
        }
        else if (num == 6) {
            location.href = "https://jungnayoon.github.io/baseballGame/baseballGame";
        }
        else if (num == 7) {
            location.href = "https://jungnayoon.github.io/TetrisGame/tetris";
        };
    });

    //모두선택 버튼
    $("#allChk").change("on", function () {
        let chk_condition = $("#allChk").prop("checked");
        if (chk_condition == true) {
            $(".chk").prop("checked", true);
        } else {
            $(".chk").prop("checked", false);
        }
    });

    //계산기
    $("#calculator #calInput").change("on", function () {
        let calInput = $(this).val();
        let calResult = eval(calInput);

        if (calResult) {
            $("#calResult").text(calResult);
        } else {
            console.log("계산식이 잘못되었습니다.");
        }

    })

    //자료형 판별하기
    $("#number input").on("change", function () {
        let write = $(this).val();
        let type = $("#number p");
        console.log(isNaN(write));
        console.log(typeof (write));
        if (isNaN(write) == false) {
            type.text("Number 입니다.");
        } else if (write === "true" || write === "false") {
            type.text("Boolean입니다.");
        } else {
            type.text("String 입니다.");
        }
    })

    //채팅
    $("#chat #send").on("click", function () {

        let write = $("#chat input").val();
        let com;

        if (write.indexOf("안녕") != -1 || write.indexOf("하이") != -1) {
            com = "안녕하세요";
            console.log(com);
        } else if (write.indexOf("날씨") != -1) {
            com = "오늘의 날씨는 <a href='https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EC%98%A4%EB%8A%98%EB%82%A0%EC%94%A8'>[날씨]</a>";
        } else if (write.indexOf("잘자") != -1 || write.indexOf("바이") != -1) {
            com = "안녕히 계세요.";
            $("#chat input").attr({
                "disabled": true,
                "placeholder": "[채팅종료]"
            });
            $("#chat button").text("reset");
            //$("#chat button").prop("id", "reset");
            $("#send").remove();
            $("#reset").attr("hidden", false);
        } else {
            com = "이해하지 못했습니다.";
        };

        let add =
            "<div class='chatBox'><div class='meBox'><p class='me'>나 : "
            + write
            + "</p></div><div class='comBox'><p class='com'>com :  "
            + com
            + "</p></div></div>";

        if (write) {
            $("#chatRoom").append(add);
            $("#chat input").val("");

        } else if (write == false && $("#chat button").attr("id") == "send") {
            alert("입력 값이 없습니다!");
        }
    });

    $("#reset").on("click", function () {
        location.reload();
    });

    //풍선 불기
    $("#smaller").on("click", function () {
        let bSize = $("#balloon").width();
        $("#balloon").animate({
            "width": "-=10px"
        });

        if (bSize <= 0) {
            bSize = 0;
        }
    });
    $("#bigger").on("click", function () {
        let bSize = $("#balloon").width();

        $("#balloon").animate({
            "width": "+=10px"
        });

        if (bSize >= 120) {
            bSize = 120;
            $("#balloon").remove();
            $("#bomb").prop("hidden", false);
            $("#bBtn").remove();
            $("#notice").prop("hidden", false);
        }
    });

    //배너 fadein fadeout
    function bannerAnimation() {
        $(".greet").animate({
            opacity: 0
        }, 3000, function () {
            $(".greet").text("Thank you");
        }).animate({
            opacity: 1
        }, 3000).animate({
            opacity: 0
        }, 3000, function () {
            $(".greet").text("감사합니다")
        }).animate({
            opacity: 1
        }, 3000);
    };

    for (let i = 1; i < 100000; i++) {
        bannerAnimation();
    };


});


