var MINE_BOX = '1';
var CLICKED_BOX = '2';
var NORMAL_BOX = '0';
var SIGN_COLOR = 'rgb(255, 255, 0)';
var NORMAL_COLOR = 'rgb(153, 153, 153)';
var totalNormalBox = 0;

document.oncontextmenu = function(e){
    e.preventDefault();
};

function startgame(){
    $('#box').css('display', 'block');
    var degree = $("#degree").val();

    degree = parseInt(degree);
    if(isNaN(degree) || degree > 3 || degree < 1){
        alert('请输入合法难度！');
        $("#degree").val('')
        return;
    }
    
    initBox(degree);
}

function getBoxSize(degree){
    var boxSize = 10;
    if(degree > 2){
        boxSize = 30;
    }else if(degree > 1){
        boxSize = 20;
    }

    return boxSize;
}

function initBox(degree){
    var boxSize = getBoxSize(degree);
    var boxHtml = '';
    totalNormalBox = boxSize * boxSize;
    var mineNum = totalNormalBox * degree / 10;
    totalNormalBox -= mineNum;

    for(var i = 0; i < boxSize; i++){
        boxHtml += '<tr>'
        for(var j = 0; j < boxSize; j++){
            var boxId = getBoxId(i, j);
            var isMine = 1;
            var leftBox = boxSize * (boxSize - i) - j;

            if(mineNum < leftBox){
                var random = Math.random();
                if(random > mineNum / leftBox){
                    isMine = 0;
                }else{
                    mineNum--;
                }
            }else{
                mineNum--;
            }

            boxHtml += '<td><div style="height:24px;width:24px;background-color:' + NORMAL_COLOR 
                + ';color:' + NORMAL_COLOR
                + ';border:1px solid black;cursor:pointer; margin:1px;" oncontextmenu="menuBox(this)" onclick="clickBox(this)" id="' + boxId 
                + '" x="' + i 
                + '" y="' + j 
                + '" ismine="' + isMine 
                + '">*</div></td>'
        }
        boxHtml += '</tr>'
    }

    totalNormalBox += mineNum;
    $("#box").html(boxHtml);
}

//右键进行炸弹备注
function menuBox(box){
    if($(box).css("background-color") == NORMAL_COLOR){
        $(box).css("background-color", SIGN_COLOR);
    }else if($(box).css("background-color") == SIGN_COLOR){
        $(box).css("background-color", NORMAL_COLOR);
    }
}

function getBoxId(x, y){
    return "box_" + x + "_" + y;
}

function clickBox(box){
    var isMine = $(box).attr('ismine');

    //当前是已点击的
    if(isMine == CLICKED_BOX){
        return;
    }

    //当前是炸弹则结束游戏
    if(isMine == MINE_BOX){
        alert('失败！');
        $('#box').css('display', 'none');
        return;
    }

    //当前非炸弹则变色
    var x = $(box).attr('x');
    var y = $(box).attr('y');
    x = parseInt(x);
    y = parseInt(y);

    //当前非炸弹需向周边延伸进行提示
    spread(x, y, true);
}

function spread(x, y, isSpread){
    var isMine = $('#' + getBoxId(x, y)).attr('ismine');
    if(isMine != NORMAL_BOX)
        return;

    var mineNum = ligthBox(x, y);

    //游戏结束
    if(--totalNormalBox == 0){
        alert('成功！');
        setTimeout(() => {
            $('#box').css('display', 'none');
        },2000);
        return;
    }

    if(isSpread){
        isSpread = isSpread && (mineNum == 0);
        spread(x - 1, y - 1, isSpread);
        spread(x - 1, y, isSpread);
        spread(x - 1, y + 1, isSpread);
        spread(x, y - 1, isSpread);
        spread(x, y + 1, isSpread);
        spread(x + 1, y - 1, isSpread);
        spread(x + 1, y, isSpread);
        spread(x + 1, y + 1, isSpread);
    }
}

//非炸弹则点亮
function ligthBox(x, y){
    $('#' + getBoxId(x, y)).css("background-color", "white");
    $('#' + getBoxId(x, y)).attr('ismine', CLICKED_BOX);
    var mineNum = getMineNum(x, y);
    $('#' + getBoxId(x, y)).html(mineNum);

    return mineNum;
}

//获取当前节点周边炸弹数量
function getMineNum(x, y){
    var num = 0;
    x = parseInt(x);
    y = parseInt(y);

    if($('#' + getBoxId(x - 1, y)).attr('ismine') == MINE_BOX){
        num++;
    }
    if($('#' + getBoxId(x - 1, y - 1)).attr('ismine') == MINE_BOX){
        num++;
    }
    if($('#' + getBoxId(x - 1, y + 1)).attr('ismine') == MINE_BOX){
        num++;
    }
    if($('#' + getBoxId(x, y - 1)).attr('ismine') == MINE_BOX){
        num++;
    }
    if($('#' + getBoxId(x, y + 1)).attr('ismine') == MINE_BOX){
        num++;
    }
    if($('#' + getBoxId(x + 1, y - 1)).attr('ismine') == MINE_BOX){
        num++;
    }
    if($('#' + getBoxId(x + 1, y)).attr('ismine') == MINE_BOX){
        num++;
    }
    if($('#' + getBoxId(x + 1, y + 1)).attr('ismine') == MINE_BOX){
        num++;
    }

    return num;
}

//提示黄色区域是否备注正确
function notice(){
    if(totalNormalBox == 0)
        return;

    var degree = $("#degree").val();
    var boxSize = getBoxSize(degree);
    for(var i = 0; i < boxSize; i++){
        for(var j = 0; j < boxSize ; j++){
            var id = "box_" + i + "_" + j;
            if($('#' + id).css("background-color") == SIGN_COLOR && $('#' + id).attr('ismine') != '1'){
                alert(++i + ',' + ++j);
                return;
            }
        }
    }
    alert('鼠标右击备注的黄色雷区都正确。');
}
