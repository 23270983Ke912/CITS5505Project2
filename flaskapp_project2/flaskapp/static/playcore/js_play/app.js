var $ = jQuery.noConflict();
var def_clrs = ['r', 'g', 'b', 'p', 'y']; // tile colors
var dim_x = 6; //tile number for x axis
var dim_y = 5; //tile number for y axis
var tile_w = 60; //tile width
var tile_h = 80; //tile height
var tile_b = 1; //tile boarder
var try_count = 3; //number of round for each game

var sky_speed = 800; // animate drop time for non existed tile
var grav_speed = 800; // animate drop time for existed tile
var move_speed = 160; // animate move time
var gone_speed = 300; // animate tile disappear time
var myrng = new Math.seedrandom('cits'); // set a random seed
var score = 0;
var moveHistory = new Array();
var userId;
var max_combo = 0;
var shareable = "0";



//pick random color
var pickRandColor = function () {
    var r = Math.floor(myrng() * def_clrs.length);
    return def_clrs[r];
}
var loadColor = function (i, j, loaddata_clrs) {
    console.log(loaddata_clrs[i][j])
    return loaddata_clrs[i][j];
}
function strtoarrary(clrdata) {
    clrdata = clrdata.split(',')
    for (i = 0; i < clrdata.length; i++) {
        clrdata[i] = clrdata[i].replace(/[^a-z0-9]/gi, '')
    }

    var finalarray = new Array();
    var row = new Array();
    for (i = 0; i < clrdata.length; i++) {
        if (i % 6 == 0 && i != 0) {
            finalarray.push(row)
            row = new Array()
        }
        row.push(clrdata[i])
    }
    finalarray.push(row)

    return finalarray
}
//init the board
var init = function () {

    $('#tries').text(try_count);
    var params = location.href.split('?')[1].split('&');
    data = {};
    for (x in params) {
        data[params[x].split('=')[0]] = params[x].split('=')[1];
    }
    console.log(data)
    var clrdata = decodeURI(data["loaddata_clrs"])
    loaddata_clrs = strtoarrary(clrdata)
    userId = data["userId"]

    console.log(userId)
    //set board size
    $('.demo').css('width', dim_x * tile_w).css('height', dim_y * tile_h);
    //generate tiles
    for (i = 0; i < dim_y; i++) {
        for (j = 0; j < dim_x; j++) {
            //var clr = pickRandColor();
            var clr = loadColor(i, j, loaddata_clrs);
            $('.demo').append('<div id="' + j + '-' + i + '" data-clr="' + clr + '" class="' + clr + ' tile" style="left:' + j * tile_w + 'px; top:' + i * tile_h + 'px;"  ></div>');
        }
    }

    //set tile css 
    $('.tile').css('width', tile_w - tile_b * 2);
    $('.tile').css('height', tile_h - tile_b * 2);
    $('.tile').css('border', tile_b + 'px solid #333');
    combo_cnt = 0;
    score = 0;
}

$(function () {
    init();
    var timer;

    $(".tile").draggable({
        grid: [parseInt(tile_w), parseInt(tile_h)], //set tile drag unit 
        start: function (e, ui) {

            try_count -= 1
            $('#tries').text(try_count);
            $("#progress").removeClass("hidden").addClass("shown");
            $("#countdownline").addClass('countdown');
            moveHistory = new Array();
            moveHistory.push(ui.offset.left / tile_w + '-' + ui.offset.top / tile_h)
            var count = 8;
            $('#timer').html(count);
            timer = setInterval(function () {
                count--;
                $('#timer').html(count);
                // update timer here

                if (count === 0) {
                    $(document).trigger("mouseup");
                    clearInterval(timer);
                }
            }, 1000);
        },
        drag: function (e, ui) {
            combo_cnt = 0;

            $('#combo').text(combo_cnt);
            $('#score').text(score);
            $(this).addClass('sel'); //add css to selected tile
            selLeft = Math.abs(ui.offset.left);
            selTop = ui.offset.top;
            pos_x = selLeft / tile_w;
            pos_y = selTop / tile_h;
            var cur_n = pos_x + '-' + pos_y; //current tile position "x-y"，same as id
      
            // if current tile position is different from tile id
            if (cur_n != $(this).attr('id')) {
                var ori = $(this).attr('id'); //tile id

                moveHistory.push(cur_n);
                moveTo(cur_n, ori); //tile id move to current tile position
                $(this).attr('id', cur_n); //set new position to tile id
            }
        },
        stop: function (e, ui) {
            $(".tile").draggable("disable")
            $('#timer').text(0);
            clearInterval(timer);
            $("#progress").removeClass("shown").addClass("hidden");
            $("#countdownline").removeClass('countdown');
            console.log("moveHistory", moveHistory)
            $(this).removeClass('sel');//when stop remove sel css
            makeChain();//calculate combo chain
        },
        containment: ".demo", //set draging area
    });
});

//move tile
function moveTo(id, pos) {
    var aryPos = pos.split("-");
    var x = aryPos[0] * tile_w;
    var y = aryPos[1] * tile_h;
    $('#' + id).animate({ 'top': y, 'left': x }, { 'duration': move_speed });
    $('#' + id).attr('id', pos);
}

//record Chain's tile，and sum up same color tiles
function repeatMap(repeatX, repeatY, clr, xn, yn) {
    this.repeatX = repeatX;
    this.repeatY = repeatY;
    this.clr = clr;
    this.xn = xn;
    this.yn = yn;
    return this;
}


//delete combochain's tile
function makeChain() {
    //flagMatrix record the number of tiles having the same color in x y axis
    var flagMatrix = new Array();
    for (i = 0; i < dim_x; i++) {
        flagMatrix[i] = new Array();
    }
    //calculate chain from left to right up to down record the number of tiles having the same color
    for (y = 0; y < dim_y; y++) {
        for (x = 0; x < dim_x; x++) {
            var repeatX = 0;
            var repeatY = 0;
            var clr = '';
            var xn = 0;
            var yn = 0;

            if (x > 0) {
                var curX_TileClr = $('#' + x + '-' + y).attr('data-clr');
                var lasX_TileClr = $('#' + (x - 1) + '-' + y).attr('data-clr');
                //if current x tile have the same color as the last x tile then repeatX+1 else set 0
                if (curX_TileClr == lasX_TileClr) {
                    repeatX = flagMatrix[x - 1][y].repeatX + 1;
                } else {
                    repeatX = 0;
                }
                clr = curX_TileClr;
                //if repeatX>1 means there are three same color tile which makes a chain                
                if (repeatX > 1) {
                    var i = repeatX;
                    //tag all x chain tiles with the total repeatX
                    for (i; i > 0; i--) {
                        flagMatrix[x - i][y].repeatX = repeatX;
                        flagMatrix[x - i][y].clr = clr;
                        flagMatrix[x - i][y].xn = i;
                    }
                }
            }
            if (y > 0) {
                var curY_TileClr = $('#' + x + '-' + y).attr('data-clr');
                var lasY_TileClr = $('#' + x + '-' + (y - 1)).attr('data-clr');
                //if current y tile have the same color as the last ytile then repeatY+1 else set 0
                if (curY_TileClr == lasY_TileClr) {
                    repeatY = flagMatrix[x][y - 1].repeatY + 1;
                } else {
                    repeatY = 0;
                }
                clr = curY_TileClr;
                //if repeatY>1 means there are three same color tile which makes a chain        
                if (repeatY > 1) {
                    var i = repeatY;
                    //tag all y chain tiles with the total repeatY
                    for (i; i > 0; i--) {
                        flagMatrix[x][y - i].repeatY = repeatY;
                        flagMatrix[x][y - i].clr = clr;
                        flagMatrix[x][y - i].yn = i;
                    }
                }
            }
            flagMatrix[x][y] = new repeatMap(repeatX, repeatY, clr, xn, yn);
            //$('#'+x+'-'+y).html(flagMatrix[x][y].repeatX+':'+flagMatrix[x][y].repeatY);
        }
    }

    // after recording Chains then start to prepare removing tiles
    var flag = false;
    var aryChk = new Array();
    var aryChains = new Array();
    var aryCombo = new Array();
    //collect combo group and record score
    for (x = 0; x < dim_x; x++) {
        for (y = 0; y < dim_y; y++) {
            if (flagMatrix[x][y].repeatX > 1 || flagMatrix[x][y].repeatY > 1) {
                score += 10
                aryChains.push(x + '-' + y);
            }
        }
    }


    var combo_n = 0;
    for (var i = 0; i < aryChains.length; i++) {
        if (!isChecked(aryChk, aryChains[i])) {
            aryChk.push(aryChains[i]);
            aryCombo[combo_n] = new Array();
            aryCombo[combo_n].push(aryChains[i]); //combo head
            ap = aryChains[i].split('-');
            var x = parseInt(ap[0]);
            var y = parseInt(ap[1]);
            rx = flagMatrix[x][y].repeatX;
            ry = flagMatrix[x][y].repeatY;
            if (rx > 1) {
                var ofs_x = rx - parseInt(flagMatrix[x][y].xn);
                x = x - ofs_x;
                for (var a = 0; a <= rx; a++) {
                    if (!isChecked(aryChk, (x + a) + '-' + y)) {
                        aryChk.push((x + a) + '-' + y);
                        aryCombo[combo_n].push((x + a) + '-' + y);
                        sry = flagMatrix[x + a][y].repeatY;
                        syn = flagMatrix[x + a][y].yn;
                        if (sry > 1) {
                            var ofs_y = sry - syn;
                            var sy = y - ofs_y;
                            for (var sb = 0; sb <= sry; sb++) {
                                if (!isChecked(aryChk, (x + a) + '-' + (sy + sb))) {
                                    aryChk.push((x + a) + '-' + (sy + sb));
                                    aryCombo[combo_n].push((x + a) + '-' + (sy + sb));
                                }
                            }
                        }
                    }
                }
            }
            if (ry > 1) {
                var ofs_y = ry - parseInt(flagMatrix[x][y].yn);
                y = y - ofs_y;
                for (var b = 0; b <= ry; b++) {
                    if (!isChecked(aryChk, x + '-' + (y + b))) {
                        aryChk.push(x + '-' + (y + b));
                        aryCombo[combo_n].push(x + '-' + (y + b));
                        srx = flagMatrix[x][y + b].repeatX;
                        sxn = flagMatrix[x][y + b].xn;
                        if (srx > 1) {
                            var ofs_x = srx - sxn;
                            var sx = x - ofs_x;
                            for (var sa = 0; sa <= srx; sa++) {
                                if (!isChecked(aryChk, (sx + sa) + '-' + (y + b))) {
                                    aryChk.push((sx + sa) + '-' + (y + b));
                                    aryCombo[combo_n].push((sx + sa) + '-' + (y + b));
                                }
                            }
                        }
                    }
                }
            }
            combo_n++;
        }

    }
    console.log(aryCombo);

    //visit all combo chain
    for (var d = 0; d < aryCombo.length; d++) {
        for (var e = 0; e < aryCombo[d].length; e++) {
            $('#' + aryCombo[d][e]).addClass('c' + d);
            aryP = aryCombo[d][e].split('-');
            var x = aryP[0];
            var y = aryP[1];

        }

        $('#combo').text(++combo_cnt);
        $('#score').text(score);

    }

    //console.log(ems);
    //animateElems(ems);

    //delete combo tiles
    for (x = 0; x < dim_x; x++) {
        for (y = 0; y < dim_y; y++) {
            if (flagMatrix[x][y].repeatX > 1 || flagMatrix[x][y].repeatY > 1) {
                $('#' + x + '-' + y).animate({ 'opacity': 0.2 }, gone_speed, function () {
                    $(this).addClass('gone').attr('data-gone', '1');
                });
                flag = true;
            }
         
        }
    }
    // after combo chain deleted then use gravity to drop the tiles above
    $(".tile").promise().done(function () {
        if (flag) {
            $('.tile').css('opacity', 1);
            console.log(flagMatrix);
            gravity();
        } else {
            // after all gravity combo chains are deleted then calculate result
            if (max_combo == null) {
                max_combo = combo_cnt;
            } else {
                if (combo_cnt > max_combo) {
                    max_combo = combo_cnt;
                }
            }
            $(".tile").draggable("enable")
             // after all round finish show the final result
            if (try_count <= 0) {
                $("#combotext").html("Max Combo")
                $('#combo').text(max_combo);
                function takeshot() {
                    var div = document.getElementById('mainbody');

                    html2canvas(div).then(
                        function (canvas) {
                            var share_button = document.createElement("BUTTON");
                            var t = document.createTextNode("Share Score");
                            share_button.appendChild(t);
                            share_button.addEventListener("click", function openpage() {
                                this.disabled = true;
                                document.getElementById('outputdiv').appendChild(output);
                                document.getElementById('output').appendChild(canvas);
                                var image = canvas.toDataURL(canvas).replace(canvas, "image/octet-stream");
                                shareable = "1"
                                $(".tile").addClass("endblur")
                                $(".tile").draggable("disable")
                                if (score != 0 || max_combo != 0) {
                                    var jsondata = JSON.stringify({
                                        playerid: userId,
                                        maxcombo: max_combo,
                                        score: score,
                                        shareable: shareable
                                    });
                                    console.log(jsondata)

                                    // record score with ajax to db
                                    $.ajax({
                                        url: "/scoreAdd",
                                        method: "POST",
                                        data: { json: jsondata },
                                        contentType: "application/json",
                                        success: function (data) {
                                            var a = document.createElement('A');
                                            a.href = image;
                                            a.download = "Your result: " + score;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                        },
                                        error: function (errMsg) {
                                            console.log(errMsg)
                                            alert(JSON.stringify(errMsg));
                                        }
                                    });

                                }
                                else {
                                    alert("Unable to share 0 to the score board...")
                                }
                            });

                            var viewscore_button = document.createElement("BUTTON");
                            t = document.createTextNode("View Score");
                            viewscore_button.appendChild(t);
                            viewscore_button.addEventListener("click", function openpage() {
                                top.location = "/score"
                            });

                            var restart_button = document.createElement("BUTTON");
                            t = document.createTextNode("Restart");
                            restart_button.appendChild(t);
                            restart_button.addEventListener("click", function openpage() {
                                top.location = "/play"
                            });

                            var output = document.createElement("div")
                            output.id = "output"

                            var btndiv = document.createElement("div")
                            btndiv.id = "btndiv"
                            document.getElementById('outputdiv').appendChild(btndiv);
                            document.getElementById('btndiv').appendChild(share_button);
                            document.getElementById('btndiv').appendChild(viewscore_button);
                            document.getElementById('btndiv').appendChild(restart_button);



                        })
                }
                 // record screenshot
                takeshot()

                var jsondata = JSON.stringify({
                    playerid: userId,
                    maxcombo: max_combo,
                    score: score,
                    shareable: shareable
                });
                console.log(jsondata)
                $(".tile").addClass("endblur")
                $(".tile").draggable("disable")
                // record score to db even user don't want to share it
                $.ajax({
                    url: "/scoreAdd",
                    method: "POST",
                    data: { json: jsondata },
                    contentType: "application/json",
                    success: function (data) {
                        console.log("Success");
                        console.log(data)
                        //top.location = data

                    },
                    error: function (errMsg) {
                        console.log(errMsg)
                        alert(JSON.stringify(errMsg));
                    }
                });
            }
        }
    });


}


var markChain = function (aryChk, id) {
    if (!isChecked(aryChk, id)) {
        aryChk.push(id);
        ary_pos = id.split('-');
        var x = parseInt(ary_pos[0]);
        var y = parseInt(ary_pos[1]);
        var p1, p2, p3, p4;
        alert(id);
        if (x >= 1 && flagMatrix[x][y].clr == flagMatrix[(x - 1)][y].clr) {
            if (markChain(aryChk, (x - 1) + '-' + y)) {
                p1 = true;
            } else {
                return true;
            }
        }
        if (flagMatrix[x][y].clr == flagMatrix[(x + 1)][y].clr) {
            if (markChain(aryChk, (x + 1) + '-' + y)) {
                p2 = true;
            } else {
                return true;
            }
        }
        if (y >= 1 && flagMatrix[x][y].clr == flagMatrix[(x)][y - 1].clr) {
            if (markChain(aryChk, x + '-' + (y - 1))) {
                p3 = true;
            } else {
                return true;
            }
        }
        if (flagMatrix[x][y].clr == flagMatrix[(x)][y + 1].clr) {
            if (markChain(aryChk, x + '-' + (y + 1))) {
                p4 = true;
            } else {
                return true;
            }
        }
        if (p1 && p2 && p3 && p4) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }

}
// check combo 
var isChecked = function (aryChk, id) {
    for (s = 0; s < aryChk.length; s++) {
        thisEntry = aryChk[s].toString();
        if (thisEntry == id) {
            return true;
        }
    }
    return false;
}
//exchange tiles
function tileExchange(oid, nid) {
    if (oid != nid &&
        ($('#' + oid).attr('data-gone') == '1' || $('#' + nid).attr('data-gone') == '1') &&
        $('#' + oid).not(':animated') || $('#' + nid).not(':animated')) {
        var pos_o = oid.split("-");
        var pos_n = nid.split("-");
        var ox = pos_o[0] * tile_w;
        var oy = pos_o[1] * tile_h;
        var nx = pos_n[0] * tile_w;
        var ny = pos_n[1] * tile_h;

        $('#' + oid).animate({ 'top': ny, 'left': nx }, { 'duration': grav_speed });
        //$('#'+oid).offset({top:ny, left:nx});
        $('#' + nid).offset({ top: oy, left: ox });

        $('#' + oid).attr('name', oid);
        $('#' + nid).attr('name', nid);

        $('#' + oid).attr('id', nid);
        $('div[name=' + nid + ']').attr('id', oid);

        $('#' + oid).attr('name', '');
        $('#' + nid).attr('name', '');
    }
}

//gravity drop for existed tile and non existed tile
function gravity() {
    
    //calculate the hole that delete tile made and exchange with the tile above
    for (x = 0; x < dim_x; x++) {
        var hole = 0;
        for (y = dim_y - 1; y >= 0; y--) {

            if ('1' == $('#' + x + '-' + y).attr('data-gone')) {
                hole++;
            } else {
                oldPos = x + '-' + y;
                newPos = x + '-' + (y + hole);
                tileExchange(oldPos, newPos);
            }
        }
    }
    // create new tile when deleted
    $('.tile[data-gone=1]').each(function () {

        var clr = pickRandColor();
        $(this).removeClass('r g b p y gone');
        $(this).addClass(clr);
        $(this).attr('data-clr', clr);

        $(this).removeAttr('data-gone');
        oset = $(this).offset();
        ol = oset.left;
        ot = oset.top;
        $(this).css('z-index', 999);
        $(this).offset({ top: ot - 300 });
        $(this).animate({ 'top': ot, 'left': ol }, sky_speed);
    });
    setTimeout(makeChain, sky_speed + 100);
}

